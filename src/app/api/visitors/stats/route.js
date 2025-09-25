import { NextResponse } from "next/server";
import Visitor from "@/app/models/Visitor";
import PageView from "@/app/models/PageView";
// import User from "@/models/User";
import { connectDB } from "@/lib/database.Connection";
import ActiveSession from "@/app/models/ActiveSession";
import UserModel from "@/app/models/User.model";

export async function GET(request) {
  try {
    await connectDB();

    // Get time period from URL parameters
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "today";

    // Calculate start date based on period
    const startDate = new Date();
    if (period === "today") {
      startDate.setHours(0, 0, 0, 0); // Start of today
    } else if (period === "week") {
      startDate.setDate(startDate.getDate() - 7); // 7 days ago
    } else if (period === "month") {
      startDate.setMonth(startDate.getMonth() - 1); // 1 month ago
    } else {
      startDate.setFullYear(2000); // All time (very old date)
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
        popularPages: popularPages,
        activeUserDetails: activeUserDetails.map((session) => ({
          name: session.userInfo?.name || "Unknown User",
          email: session.userInfo?.email || "Unknown",
          role: session.userInfo?.role || "user",
          lastActive: session.lastActive,
          page: session.page,
        })),
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
