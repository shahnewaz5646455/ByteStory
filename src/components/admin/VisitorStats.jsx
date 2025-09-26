"use client";

import { useState, useEffect } from "react";

export function VisitorStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("today");

  // Fetch statistics from API
  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/visitors/stats?period=${period}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load stats when component mounts and when period changes
  useEffect(() => {
    fetchStats();

    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [period]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Loading Statistics...</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-red-500 p-4 bg-red-100 rounded">
          Failed to load statistics. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Website Analytics</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Users"
          value={stats.period.activeUsers}
          description="Currently online"
          color="blue"
        />
        <StatCard
          title={`Visitors (${period})`}
          value={stats.period.visitors}
          description={`This ${period}`}
          color="green"
        />
        <StatCard
          title={`Page Views (${period})`}
          value={stats.period.pageViews}
          description={`This ${period}`}
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={stats.totals.users}
          description="Registered users"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularPages pages={stats.popularPages} />
        <ActiveUsers users={stats.activeUserDetails} />
      </div>
    </div>
  );
}

// Component for each statistic card
function StatCard({ title, value, description, color }) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 ${
        colorClasses[color] || colorClasses.blue
      }`}
    >
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold my-2">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

// Component to show popular pages
function PopularPages({ pages }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">Popular Pages</h3>
      <div className="space-y-3">
        {pages.map((page, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm truncate flex-1 mr-4">{page._id}</span>
            <span className="bg-gray-200 px-2 py-1 rounded text-sm font-medium">
              {page.count}
            </span>
          </div>
        ))}
        {pages.length === 0 && (
          <p className="text-gray-500 text-center py-4">No page views yet</p>
        )}
      </div>
    </div>
  );
}

// Component to show active users
function ActiveUsers({ users }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">Active Now</h3>
      <div className="space-y-3">
        {users.map((user, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">On: {user.page}</p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs ${
                user.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.role}
            </span>
          </div>
        ))}
        {users.length === 0 && (
          <p className="text-gray-500 text-center py-4">No active users</p>
        )}
      </div>
    </div>
  );
}
