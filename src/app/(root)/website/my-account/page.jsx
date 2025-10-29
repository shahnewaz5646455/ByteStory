"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MyAccount = () => {
  const [userStats, setUserStats] = useState({
    stories: 0,
    reactions: 0,
    conversations: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch total stats from the API
  useEffect(() => {
    const fetchTotalStats = async () => {
      try {
        const response = await fetch("/api/posts/stats");
        if (response.ok) {
          const stats = await response.json();
          setUserStats(stats);

          // Generate chart data based on the stats
          const newChartData = [
            { name: "Stories", value: stats.stories },
            { name: "Reactions", value: stats.reactions },
            { name: "Comments", value: stats.conversations },
          ];
          setChartData(newChartData);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalStats();
  }, []);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          <p className="text-indigo-600 dark:text-indigo-400">
            Count: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12 text-left">
            <div className="animate-pulse">
              <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg w-64 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96"></div>
            </div>
          </div>

          {/* Stats Cards Loading */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 animate-pulse"
              >
                <div className="text-center">
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 animate-pulse">
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Recycle Bin Style */}
        <div className="mb-12 text-left">
          <div className="relative inline-block mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Community Analytics
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Track your community's growth and engagement with real-time
            analytics and insights.
          </p>
        </div>

        {/* Stats Cards Grid - Recycle Bin Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Stories Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                {userStats.stories}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Stories
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total published stories
              </p>
            </div>
          </div>

          {/* Total Reactions Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                {userStats.reactions}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Reactions
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Combined likes and loves
              </p>
            </div>
          </div>

          {/* Total Comments Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-3">
                {userStats.conversations}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Comments
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total conversations
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Area Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Community Engagement Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Visual representation of stories, reactions, and comments across
              your community
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Engagement Metrics
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
