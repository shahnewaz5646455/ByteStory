import { NextResponse } from "next/server";
import Visitor from "@/app/models/Visitor";
import PageView from "@/app/models/PageView";
import { connectDB } from "@/lib/database.Connection";
import ActiveSession from "@/app/models/ActiveSession";
import UserModel from "@/app/models/User.model";

export async function GET(request) {
  try {
    await connectDB();

    // Get time period from URL parameters
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "today";
    const compare = url.searchParams.get("compare") || "false";

    // Calculate start date based on period
    const startDate = new Date();
    let previousStartDate = new Date();

    if (period === "today") {
      startDate.setHours(0, 0, 0, 0); // Start of today
      previousStartDate.setDate(startDate.getDate() - 1);
      previousStartDate.setHours(0, 0, 0, 0); // Start of yesterday
    } else if (period === "week") {
      startDate.setDate(startDate.getDate() - 7); // 7 days ago
      previousStartDate.setDate(startDate.getDate() - 7); // Previous 7 days
    } else if (period === "month") {
      startDate.setMonth(startDate.getMonth() - 1); // 1 month ago
      previousStartDate.setMonth(startDate.getMonth() - 1); // Previous month
    } else {
      startDate.setFullYear(2000); // All time (very old date)
      previousStartDate.setFullYear(2000);
    }

    // Get total counts
    const totalVisitors = await Visitor.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    const totalPageViews = await PageView.countDocuments();

    // Get counts for the selected period
    const periodVisitors = await Visitor.countDocuments({
      createdAt: { $gte: startDate },
    });

    const periodPageViews = await PageView.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get counts for previous period (for comparison)
    let previousPeriodVisitors = 0;
    let previousPeriodPageViews = 0;

    if (compare === "true") {
      previousPeriodVisitors = await Visitor.countDocuments({
        createdAt: {
          $gte: previousStartDate,
          $lt: startDate,
        },
      });

      previousPeriodPageViews = await PageView.countDocuments({
        createdAt: {
          $gte: previousStartDate,
          $lt: startDate,
        },
      });
    }

    // Calculate percentage changes
    const calculatePercentageChange = (current, previous) => {
      if (!previous || previous === 0) return 100; // If no previous data, show 100%
      return ((current - previous) / previous) * 100;
    };

    const visitorsChange = calculatePercentageChange(
      periodVisitors,
      previousPeriodVisitors
    );
    const pageViewsChange = calculatePercentageChange(
      periodPageViews,
      previousPeriodPageViews
    );

    // Get active users (online now)
    const activeUsersCount = await ActiveSession.countDocuments({
      userType: "user",
    });
    const activeGuestsCount = await ActiveSession.countDocuments({
      userType: "guest",
    });
    const totalActive = activeUsersCount + activeGuestsCount;

    // Get popular pages
    const popularPages = await PageView.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$page",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get active user details
    const activeUserDetails = await ActiveSession.find({ userType: "user" })
      .sort({ lastActive: -1 })
      .limit(10);

    // Get hourly data for charts
    const hourlyData = await getHourlyData(startDate, period);

    // NEW: Get traffic sources data
    const trafficSources = await getTrafficSources(startDate);

    // Get device types data
    const deviceTypes = await getDeviceTypes(startDate);

    // Return all the statistics
    return NextResponse.json({
      success: true,
      data: {
        totals: {
          visitors: totalVisitors,
          users: totalUsers,
          pageViews: totalPageViews,
        },
        period: {
          visitors: periodVisitors,
          pageViews: periodPageViews,
          activeUsers: totalActive,
          activeUsersCount,
          activeGuestsCount,
        },
        // NEW: Comparison data
        comparison: {
          previousPeriod: {
            visitors: previousPeriodVisitors,
            pageViews: previousPeriodPageViews,
          },
          percentageChange: {
            visitors: visitorsChange,
            pageViews: pageViewsChange,
            visitorsFormatted: `${
              visitorsChange >= 0 ? "+" : ""
            }${visitorsChange.toFixed(1)}%`,
            pageViewsFormatted: `${
              pageViewsChange >= 0 ? "+" : ""
            }${pageViewsChange.toFixed(1)}%`,
          },
        },
        popularPages: popularPages,
        activeUserDetails: activeUserDetails.map((session) => ({
          name: session.userInfo?.name || "Unknown User",
          email: session.userInfo?.email || "Unknown",
          role: session.userInfo?.role || "user",
          lastActive: session.lastActive,
          page: session.page,
        })),
        // Chart data
        hourlyData,
        trafficSources,
        deviceTypes,
        realtime: {
          activeUsers: totalActive,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

// Rest of the functions remain the same...
async function getHourlyData(startDate, period) {
  const hourGroupFormat =
    period === "today"
      ? { hour: { $hour: "$createdAt" } }
      : { hour: { $dateToString: { format: "%m-%d", date: "$createdAt" } } };

  const hourlyVisitors = await Visitor.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: hourGroupFormat,
        visitors: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$visitorId" },
      },
    },
    {
      $sort: { "_id.hour": 1 },
    },
  ]);

  const hourlyPageViews = await PageView.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: hourGroupFormat,
        pageViews: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.hour": 1 },
    },
  ]);

  // Combine the data
  const hourlyDataMap = new Map();

  hourlyVisitors.forEach((item) => {
    const hour =
      period === "today"
        ? `${item._id.hour.toString().padStart(2, "0")}:00`
        : item._id.hour;

    hourlyDataMap.set(hour, {
      hour,
      visitors: item.visitors,
      activeUsers: item.uniqueVisitors.length,
      pageViews: 0,
    });
  });

  hourlyPageViews.forEach((item) => {
    const hour =
      period === "today"
        ? `${item._id.hour.toString().padStart(2, "0")}:00`
        : item._id.hour;

    if (hourlyDataMap.has(hour)) {
      hourlyDataMap.get(hour).pageViews = item.pageViews;
    } else {
      hourlyDataMap.set(hour, {
        hour,
        visitors: 0,
        activeUsers: 0,
        pageViews: item.pageViews,
      });
    }
  });

  return Array.from(hourlyDataMap.values()).sort((a, b) => {
    if (period === "today") {
      return a.hour.localeCompare(b.hour);
    }
    return new Date(a.hour) - new Date(b.hour);
  });
}

async function getTrafficSources(startDate) {
  const trafficSources = await Visitor.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$source",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return trafficSources.map((source) => ({
    source: source._id || "Direct",
    count: source.count,
  }));
}

async function getDeviceTypes(startDate) {
  const deviceTypes = await Visitor.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$deviceType",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return deviceTypes.map((device) => ({
    device: device._id || "Unknown",
    count: device.count,
  }));
}
