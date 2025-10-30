"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Heart,
  MessageCircle,
  BarChart3,
} from "lucide-react";
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
  const session = useSelector((store) => store.authStore.auth);

  // Fetch user-specific stats from the API
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!session?.email) return;

      try {
        setIsLoading(true);

        // Fetch user's posts first
        const postsResponse = await fetch(`/api/posts/user/${session.email}`);
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch user posts");
        }

        const userPosts = await postsResponse.json();

        // Calculate stats from user's posts
        const nonDeletedPosts = userPosts.filter((post) => !post.isDeleted);
        const totalStories = nonDeletedPosts.length;
        const totalReactions = nonDeletedPosts.reduce(
          (total, post) => total + post.likes.length + post.loves.length,
          0
        );
        const totalConversations = nonDeletedPosts.reduce(
          (total, post) => total + post.comments.length,
          0
        );

        setUserStats({
          stories: totalStories,
          reactions: totalReactions,
          conversations: totalConversations,
        });

        // Generate chart data based on the user's stats
        const newChartData = [
          { name: "Stories", value: totalStories },
          { name: "Reactions", value: totalReactions },
          { name: "Comments", value: totalConversations },
        ];
        setChartData(newChartData);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [session]);

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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your account
          </h2>
          <Link
            href="/website"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="">
          {/* Header Skeleton */}
          <div className="mb-12 text-left">
            <div className="animate-pulse">
              <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg w-64 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96"></div>
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="flex justify-start mb-8">
            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-xl w-40 animate-pulse"></div>
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
      <div className="">
        {/* Header */}
        <div className="mb-12 text-left">
          <div className="relative inline-block mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 pb-1 bg-clip-text text-transparent">
              Story Analytics
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Track your writing journey and engagement metrics. See how your
            stories resonate with the community.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-start mb-8">
          <Link
            href="/my-posts"
            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Posts
          </Link>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* My Stories Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {userStats.stories}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                My Stories
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stories you've published
              </p>
            </div>
          </div>

          {/* My Reactions Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {userStats.reactions}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                My Reactions
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Likes and loves received
              </p>
            </div>
          </div>

          {/* My Conversations Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {userStats.conversations}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                My Conversations
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comments on your stories
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Area Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 md:p-6 p-2 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Engagement Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Visual breakdown of your stories, reactions, and conversations
              </p>
            </div>
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
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
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
                Your Engagement Metrics
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Average Reactions per Story
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {userStats.stories > 0
                  ? Math.round(userStats.reactions / userStats.stories)
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Average Comments per Story
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {userStats.stories > 0
                  ? Math.round(userStats.conversations / userStats.stories)
                  : 0}
              </span>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <p className="text-indigo-700 dark:text-indigo-300 text-sm">
              <span className="font-semibold">
                Hello {session.name || session.email}!
              </span>
              {userStats.stories === 0
                ? " Start your journey by creating your first story in the feed!"
                : ` You've published ${userStats.stories} stories and received ${userStats.reactions} reactions. Keep writing!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
