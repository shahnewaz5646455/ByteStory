"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { showToast } from "@/lib/showToast";

export default function RecycleBinPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSelector((store) => store.authStore.auth);

  const fetchRecycledPosts = async () => {
    if (!session?.email) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/posts/recycle", {
        headers: {
          "x-user-email": session.email,
        },
      });

      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      } else {
        console.error("Failed to fetch recycled posts");
      }
    } catch (error) {
      console.error("Error fetching recycled posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (postId) => {
    try {
      const response = await fetch(`/api/posts/recycle/${postId}`, {
        method: "POST",
        headers: {
          "x-user-email": session.email,
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
        showToast("success", "Post restored successfully!");
      } else {
        showToast("error", "Failed to restore post");
      }
    } catch (error) {
      console.error("Error restoring post:", error);
      showToast("error", "Error loading recycle bin");
    }
  };

  const handlePermanentDelete = async (postId) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/recycle/${postId}`, {
        method: "DELETE",
        headers: {
          "x-user-email": session.email,
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));

        showToast("success", "Post permanently deleted!");
      } else {
        showToast("error", "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("error", "Error deleting post");
    }
  };

  useEffect(() => {
    if (session?.email) {
      fetchRecycledPosts();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view recycle bin
          </h2>
          <Link
            href="/website"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r pb-2 from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2 relative z-10">
              Recycle Bin
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 blur-lg opacity-30 scale-110"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Deleted posts will be automatically permanently deleted after 7
            days. Restore them before it's too late!
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center items-center space-x-8 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {posts.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Deleted Posts
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {posts.filter((post) => post.daysLeft <= 3).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Expiring Soon
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Link
            href="/my-posts"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            ← Back to My Posts
          </Link>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {isLoading ? (
            // Loading skeleton
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
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Recycle Bin is Empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
                  No posts have been deleted yet. Deleted posts will appear here
                  and will be automatically permanently deleted after 7 days.
                </p>
              </div>
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transform transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.authorImage || "/default-avatar.png"}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {post.authorName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Deleted {new Date(post.deletedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.daysLeft > 3
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : post.daysLeft > 0
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {post.daysLeft > 0
                      ? `${post.daysLeft} days left`
                      : "Expired"}
                  </div>
                </div>

                {post.title && (
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {post.title}
                  </h2>
                )}

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.content}
                </p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>👍 {post.likes?.length || 0}</span>
                  <span>❤️ {post.loves?.length || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRestore(post.id)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(post.id)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
