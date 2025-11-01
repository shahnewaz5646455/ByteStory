"use client";

import CreatePost from "@/components/CreatePost";
import Post from "@/components/Post";
import { TrendingUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetch(`/api/posts?page=${pageNum}&limit=8`);
      if (response.ok) {
        const postsData = await response.json();

        if (postsData.length === 0) {
          setHasMore(false);
        } else {
          if (isLoadMore) {
            setPosts((prevPosts) => [...prevPosts, ...postsData]);
          } else {
            setPosts(postsData);
          }
          setPage(pageNum);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more when 100px from bottom
    if (scrollTop + windowHeight >= documentHeight - 100) {
      fetchPosts(page + 1, true);
    }
  }, [page, hasMore, isLoadingMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handlePostCreated = () => {
    // Reset and reload first page
    setPage(1);
    setHasMore(true);
    fetchPosts(1, false);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  // Filter posts based on active filter and search query
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeFilter === "popular") {
      return matchesSearch && post.likes.length + post.loves.length >= 5;
    }

    return matchesSearch;
  });

  // Sort posts - popular first for popular filter, newest first otherwise
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeFilter === "popular") {
      const aReactions = a.likes.length + a.loves.length;
      const bReactions = b.likes.length + b.loves.length;
      return bReactions - aReactions;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animated Header Skeleton */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto"></div>
            </div>
          </div>

          {/* Create Post Skeleton */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 mb-8 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg mb-3"></div>
                <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Post Skeletons */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex space-x-3">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                </div>
                <div className="mt-6 flex space-x-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg flex-1"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Create Post Section */}
        <div className="mb-8">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search stories, tags, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${activeFilter === "all"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                All Stories
              </button>
              <button
                onClick={() => setActiveFilter("popular")}
                className={`group/button relative px-4 flex items-center gap-2 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer overflow-hidden isolate
    ${activeFilter === "popular"
                    ? "inline-flex items-center justify-center bg-gray-800 backdrop-blur-lg text-base font-semibold text-white transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-gray-600/50 dark:hover:shadow-indigo-600/30 border border-white/20 dark:border-indigo-400/20"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                <TrendingUp /> Popular
                <div className="pointer-events-none absolute inset-0 flex h-full w-full justify-center overflow-hidden [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-10 bg-white/20 dark:bg-indigo-300/20 blur-md"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {searchQuery ? "No stories found" : "No stories yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any stories matching "${searchQuery}". Try different keywords or browse all stories.`
                    : "Be the first to share your story and inspire the ByteStory community! Your voice matters."}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => document.querySelector("textarea")?.focus()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Write First Story
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="text-sm text-gray-500 dark:text-gray-400 px-2">
                Showing {sortedPosts.length} of {posts.length} stories
                {searchQuery && ` for "${searchQuery}"`}
                {activeFilter === "popular" && " (Most popular first)"}
                {hasMore && " • Scroll down for more"}
              </div>

              {/* Posts Grid */}
              {sortedPosts.map((post, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className="transform transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <Post
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                </div>
              ))}

              {/* Loading More Indicator */}
              {isLoadingMore && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              )}

              {/* End of Results */}
              {!hasMore && posts.length > 0 && (
                <div className="text-center py-8">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      🎉 You've reached the end! No more stories to load.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-8 right-8 sm:hidden">
          <button
            onClick={() => document.querySelector("textarea")?.focus()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transform hover:scale-110 transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
