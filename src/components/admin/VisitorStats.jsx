"use client";

import { useState, useEffect } from "react";
import { Users, Eye, TrendingUp, Globe, Clock, ArrowUpRight, RefreshCw, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

export function VisitorStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [period, setPeriod] = useState("today");
  const [chartType, setChartType] = useState("line"); // "line", "bar", "pie"

  // Fetch statistics from API
  const fetchStats = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch(`/api/visitors/stats?period=${period}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchStats(true);

    // Refresh every 30 seconds without showing any skeleton
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/visitors/stats?period=${period}`);
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data); // Silently update the data
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [period]);

  const handleRefresh = () => {
    fetchStats(true); // Show skeleton only on manual refresh
  };

  // Mock chart data - Replace with actual data from your API
  const chartData = [
    { name: 'Mon', visitors: 400, pageViews: 240, activeUsers: 24 },
    { name: 'Tue', visitors: 300, pageViews: 139, activeUsers: 18 },
    { name: 'Wed', visitors: 200, pageViews: 980, activeUsers: 32 },
    { name: 'Thu', visitors: 278, pageViews: 390, activeUsers: 21 },
    { name: 'Fri', visitors: 189, pageViews: 480, activeUsers: 28 },
    { name: 'Sat', visitors: 239, pageViews: 380, activeUsers: 19 },
    { name: 'Sun', visitors: 349, pageViews: 430, activeUsers: 25 },
  ];

  const pieData = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Referral', value: 300 },
    { name: 'Organic', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <StatsSkeleton />;
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
          Failed to load statistics. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Website Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time insights into your website performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.period.activeUsers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currently online</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.period.visitors}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This {period}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Page Views</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.period.pageViews}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This {period}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totals.users}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered users</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Main Chart */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Traffic Overview</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType("line")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    chartType === "line"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    chartType === "bar"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#1D4ED8' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pageViews" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#7C3AED' }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    <Bar dataKey="visitors" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pageViews" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <PieChart className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Traffic Sources</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularPages pages={stats.popularPages} loading={false} />
        <ActiveUsers users={stats.activeUserDetails} loading={false} />
      </div>
    </div>
  );
}


function PopularPages({ pages, loading }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Popular Pages</h3>
      </div>
      <div className="space-y-4">
        {pages.map((page, index) => (
          <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">
                {page._id}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {page.path || 'Unknown path'}
              </span>
            </div>
            <span className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
              {page.count}
            </span>
          </div>
        ))}
        {pages.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No page views yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveUsers({ users, loading }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Active Now</h3>
      </div>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 truncate">On: {user.page}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              }`}>
              {user.role}
            </span>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No active users</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton Loading Component
function StatsSkeleton() {
  return (
    <div className="p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Content Sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}