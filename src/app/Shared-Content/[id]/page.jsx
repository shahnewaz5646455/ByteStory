"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Clock,
  User,
  Copy,
  CheckCircle,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  Eye,
  Share2,
  Home,
  ArrowLeft,
} from "lucide-react";

export default function SharedContentPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params?.id;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.log("Content ID from params:", contentId);
    
    if (!contentId) {
      setError("Invalid content ID");
      setLoading(false);
      return;
    }

    fetchContent();
  }, [contentId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      console.log("Fetching content for ID:", contentId);
      
      const response = await fetch(`/api/content-saveTo-DB?id=${contentId}`);
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        setContent(data.record);
        setError("");
      } else {
        setError(data.message || "Failed to load content");
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy content");
    }
  };

  const shareContent = async () => {
    const shareData = {
      title: content.prompt || "Check out this AI-generated content",
      text: content.content.slice(0, 100) + "...",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <div className="flex min-h-screen items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4 inline-block"
            >
              <Loader2 className="h-12 w-12 text-indigo-600" />
            </motion.div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Loading content...
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              ID: {contentId}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
        <div className="flex min-h-screen items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xl dark:border-red-800 dark:bg-gray-800"
          >
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Content Not Found
            </h2>
            <p className="mb-2 text-gray-600 dark:text-gray-400">{error}</p>
            <p className="mb-6 text-xs text-gray-500 dark:text-gray-500">
              ID: {contentId}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg"
              >
                <Home size={18} />
                Go to Home
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const wordCount = content?.content
    ? content.content.split(/\s+/).filter((w) => w.length > 0).length
    : 0;

  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/90 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/90">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  ByteStory AI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Shared Content
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareContent}
                className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </motion.button>

              <a
                href="/"
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Home</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Metadata Card */}
          <div className="mb-6 rounded-2xl border border-indigo-100 bg-white p-4 shadow-lg sm:p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-4">
              {content.user?.name && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {content.user.name}
                  </span>
                </div>
              )}

              {content.generated_time?.time && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar size={16} className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {content.generated_time.time}
                  </span>
                </div>
              )}

              {content.template && (
                <div className="flex items-center gap-2">
                  <FileText
                    size={16}
                    className="flex-shrink-0 text-indigo-500"
                  />
                  <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                    {content.template}
                  </span>
                </div>
              )}
            </div>

            {content.prompt && (
              <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles
                    size={16}
                    className="flex-shrink-0 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Original Prompt
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {content.prompt}
                </p>
              </div>
            )}
          </div>

          {/* Content Card */}
          <div className="rounded-2xl border border-indigo-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            {/* Content Header */}
            <div className="flex flex-col gap-4 border-b border-indigo-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-700">
              <div>
                <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  Generated Content
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye size={14} className="flex-shrink-0" />
                    {wordCount} words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="flex-shrink-0" />
                    {readTime} min read
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </motion.button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-8">
              <div className="prose prose-sm prose-indigo max-w-none dark:prose-invert sm:prose-lg">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="mb-6 mt-8 border-b border-gray-200 pb-3 text-3xl font-bold text-gray-900 dark:border-gray-700 dark:text-white"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="mb-4 mt-6 text-2xl font-bold text-gray-800 dark:text-gray-200"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="mb-3 mt-5 text-xl font-semibold text-gray-700 dark:text-gray-300"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-5 text-justify leading-relaxed text-gray-800 dark:text-gray-200"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-bold text-gray-900 dark:text-white"
                        {...props}
                      />
                    ),
                    em: ({ node, ...props }) => (
                      <em
                        className="italic text-gray-700 dark:text-gray-300"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="mb-5 ml-6 list-disc space-y-2 text-gray-800 dark:text-gray-200"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="mb-5 ml-6 list-decimal space-y-2 text-gray-800 dark:text-gray-200"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="leading-relaxed text-justify" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="my-5 border-l-4 border-indigo-500 bg-indigo-50 py-3 pl-6 pr-4 italic text-gray-700 dark:bg-indigo-900/20 dark:text-gray-300"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, ...props }) =>
                      inline ? (
                        <code
                          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-indigo-600 dark:bg-gray-700 dark:text-indigo-400"
                          {...props}
                        />
                      ) : (
                        <code
                          className="block rounded-lg bg-gray-100 p-4 font-mono text-sm dark:bg-gray-700"
                          {...props}
                        />
                      ),
                  }}
                >
                  {content.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 text-center dark:border-indigo-800/30 dark:from-indigo-900/20 dark:to-purple-900/20"
          >
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Create Your Own Content
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Generate high-quality content with ByteStory AI in seconds
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl"
            >
              Try ByteStory AI
              <Sparkles size={18} />
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-indigo-100 bg-white/80 py-8 dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by ByteStory AI • Professional Content Generation
          </p>
        </div>
      </footer>
    </div>
  );
}