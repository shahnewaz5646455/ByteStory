"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  Eye,
  Globe,
  Lock,
  Share2,
  Hash,
  User,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react";

export default function MyContentPage() {
  const auth = useSelector((s) => s?.authStore?.auth);
  const router = useRouter();

  // State
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Load user's shared content
  async function loadUserContents(page = 1) {
    if (!auth?.email) return;

    try {
      setLoading(true);
      setError(null);

      const url = new URL(
        "/api/user/generated-contents",
        window.location.origin
      );
      url.searchParams.set("email", auth.email);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", "12");

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load your content");
      }

      setContents(data.data.items || []);
      setMeta({
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total,
        pages: data.data.pages,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Copy shareable link
  async function copyShareLink(contentId) {
    try {
      const shareUrl = `${window.location.origin}/content/${contentId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(contentId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  // Filter content based on search and filters
  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      content.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.template?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || content.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Initial load
  useEffect(() => {
    if (auth?.email) {
      loadUserContents();
    }
  }, [auth?.email]);

  // Redirect if not authenticated
  if (!auth) {
    router.replace("/login");
    return null;
  }

  // Content type badge
  function ContentTypeBadge({ type }) {
    const typeConfig = {
      blog: {
        label: "Blog Post",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      email: {
        label: "Email",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      hashtag: {
        label: "Hashtags",
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
      summary: {
        label: "Summary",
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      },
      social: {
        label: "Social Media",
        color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      },
    };

    const config = typeConfig[type] || {
      label: type,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Sparkles className="h-3 w-3" />
        {config.label}
      </span>
    );
  }

  // Visibility badge
  function VisibilityBadge({ visibility }) {
    if (visibility === "private") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300">
          <Lock className="h-3 w-3" />
          Private
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
        <Globe className="h-3 w-3" />
        Public
      </span>
    );
  }

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 pb-1 bg-clip-text text-transparent mb-4">
                {/* <FileText className="h-8 w-8 text-blue-600" /> */}
                My Generated Content
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                All your AI-generated content that you've shared
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {meta.total} items
              </span>
              <button
                onClick={() => loadUserContents()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in your content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="blog">Blog Posts</option>
                <option value="email">Emails</option>
                <option value="hashtag">Hashtags</option>
                <option value="summary">Summaries</option>
                <option value="social">Social Media</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6 text-center">
            <div className="text-rose-600 dark:text-rose-400 mb-2">{error}</div>
            <button
              onClick={() => loadUserContents()}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 underline"
            >
              Try again
            </button>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery || typeFilter !== "all"
                ? "No matching content found"
                : "No shared content yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start generating and sharing AI-powered content to see it here!"}
            </p>
            {!searchQuery && typeFilter === "all" && (
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white cursor-pointer rounded-xl"
              >
                <Sparkles className="h-5 w-5" />
                Generate New Content
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredContents.map((content) => (
                <div
                  key={content._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <ContentTypeBadge type={content.type} />
                      <VisibilityBadge visibility={content.visibility} />
                    </div>

                    {content.prompt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        <span className="font-medium">Prompt:</span>{" "}
                        {content.prompt}
                      </p>
                    )}

                    {content.template && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        <span className="font-medium">Template:</span>{" "}
                        {content.template}
                      </p>
                    )}
                  </div>

                  {/* Content Preview */}
                  <div className="p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                      <div className="text-gray-700 dark:text-gray-300 line-clamp-4 text-sm">
                        {content.content}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {content.generated_time?.time ||
                            new Date(content.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyShareLink(content._id)}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Copy share link"
                        >
                          {copiedId === content._id ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>

                        <a
                          href={`/content/${content._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => loadUserContents(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Page {meta.page} of {meta.pages}
                </span>

                <button
                  onClick={() => loadUserContents(meta.page + 1)}
                  disabled={meta.page >= meta.pages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
