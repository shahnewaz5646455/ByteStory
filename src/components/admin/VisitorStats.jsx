"use client";

import { useState, useEffect } from "react";
import { Users, Eye, TrendingUp, Globe, RefreshCw, BarChart3, Mail } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function VisitorStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("today");
  const [chartType, setChartType] = useState("line");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch statistics from API
  const fetchStats = async (isBackgroundRefresh = false) => {
    // Only show loading skeleton on initial load, not for background refreshes
    if (!isBackgroundRefresh) {
      setLoading(true);
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
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  // Load stats when component mounts and when period changes
  useEffect(() => {
    fetchStats(false);

    // Refresh every 30 seconds in background
    const interval = setInterval(() => {
      if (!isInitialLoad) {
        fetchStats(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [period, isInitialLoad]);

  // Dynamic chart data from API stats
  const getChartData = () => {
    if (!stats?.hourlyData || stats.hourlyData.length === 0) {
      return [];
    }

    return stats.hourlyData.map((hour) => ({
      name: hour.hour,
      visitors: hour.visitors || 0,
      pageViews: hour.pageViews || 0,
      activeUsers: hour.activeUsers || 0
    }));
  };

  if (loading && isInitialLoad) {
    return <StatsSkeleton />;
  }

  if (!stats && !isInitialLoad) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
          Failed to load statistics. Please try again.
        </div>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Website Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Real-time insights into your website performance
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => window.open('https://us1.admin.mailchimp.com/', '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span className="font-medium">Newsletter</span>
          </button>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={() => fetchStats(false)}
            className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.realtime?.activeUsers || stats?.period?.activeUsers || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Currently online</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.period?.visitors || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">This {period}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Page Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.period?.pageViews || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">This {period}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totals?.users || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Registered users</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Popular Pages Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Overview Chart */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Traffic Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Visitor trends over time</p>
                </div>
              </div>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setChartType("line")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    chartType === "line"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    chartType === "bar"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No data available for the selected period</p>
                    </div>
                  </div>
                ) : chartType === "line" ? (
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

        {/* Popular Pages */}
        <PopularPages pages={stats?.popularPages || []} />
      </div>
    </div>
  );
}

function PopularPages({ pages }) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Popular Pages</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Most visited pages</p>
        </div>
      </div>
      <div className="space-y-3">
        {pages.map((page, index) => (
          <div key={index} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {page._id}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate block mt-1">
                {page.path || 'Unknown path'}
              </span>
            </div>
            <span className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
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

// Skeleton Loading Component (Only for initial load)
function StatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse ml-4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Popular Pages Side by Side Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Skeleton */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
              <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        {/* Popular Pages Skeleton */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}