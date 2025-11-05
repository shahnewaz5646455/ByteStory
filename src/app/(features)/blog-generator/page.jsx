"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Sparkles,
  Brain,
  Zap,
  Clock,
  CheckCircle,
  Type,
  FileText,
  BookOpen,
  PenTool,
  ChevronDown,
  BarChart3,
  Copy,
  Wifi,
  WifiOff,
  AlertTriangle,
  Instagram,
  Key,
  X,
  ShoppingCart,
} from "lucide-react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";
import Reader from "@/components/ui/Reader";
import SpeechRecorder from "@/components/ui/speechRecorder";
import { useSelector } from "react-redux";

// Initialize Stripe with your public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function AIWriterPage() {
  const auth = useSelector((store) => store.authStore.auth);

  // ---- Blog Key State ----
  const [blogKeyCount, setBlogKeyCount] = useState(0);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---- Network State ----
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [showNetStatus, setShowNetStatus] = useState(false);
  const [showWaitingButton, setShowWaitingButton] = useState(false);
  const [showOffNetStatus, setShowOffNetStatus] = useState(!isOnline);
  const [hasNetworkChanged, setHasNetworkChanged] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  // ---- Content State ----
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blog");
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [error, setError] = useState("");

  // ---- Share State ----
  const [shareId, setShareId] = useState(null);
  const [sharedUrl, setSharedUrl] = useState(
    typeof window !== "undefined" ? window.location.href : "https://yourdomain.com"
  );
  const shareBtnRef = useRef(null);
  const shareMenuRef = useRef(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // ---- Fetch user and keys immediately (no setTimeout, no window.debug) ----
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.email) return;
      try {
        const response = await fetch(
          `/api/get-user-data?email=${encodeURIComponent(auth.email)}`
        );
        const data = await response.json();
        if (data?.success) {
           console.log("✅ USER DATA FROM DATABASE:");
        console.log("📧 Email:", data.user.email);
        console.log("👤 Name:", data.user.name);
        console.log("🔑 blog Keys:", data.user.blog_key);
          setBlogKeyCount( data.user.blog_key || 0);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [auth?.email]);

  // ---- Network listeners ----
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkChanged(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setHasNetworkChanged(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ---- Status banners + auto-run pending ----
  useEffect(() => {
    if (!hasNetworkChanged) return;

    if (isOnline) {
      setShowOffNetStatus(false);
      setShowWaitingButton(false);
      setShowNetStatus(true);

      // Only auto-execute if we still have keys
      if (pendingRequest && blogKeyCount > 0) {
        executeGenerateContent(pendingRequest.input, pendingRequest.template);
        setPendingRequest(null);
      }

      const t = setTimeout(() => setShowNetStatus(false), 4000);
      return () => clearTimeout(t);
    } else {
      setShowNetStatus(false);
      setShowOffNetStatus(true);
      setIsGenerating(false);
    }
  }, [isOnline, hasNetworkChanged, pendingRequest, blogKeyCount]);

  // ---- Strong client-side gate (auth + keys) ----
  const canGenerate = !!auth && blogKeyCount > 0 && !!input.trim() && !isGenerating;

  // ---- Generate flow with robust key handling ----
  const executeGenerateContent = async (inputText, template) => {
    // Client-side guard — blocks if zero keys
    if (!auth) {
      setError("Please login to use AI writing tool");
      return;
    }
    if (blogKeyCount <= 0) {
      setShowKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setError("");
    setOutput("");

    try {
      // IMPORTANT: Server must also enforce keys and atomically decrement.
      const resp = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Include user identification if your API expects it (recommended)
        body: JSON.stringify({
          prompt: inputText,
          template,
          email: auth?.email, // or userId if preferred
        }),
      });

      // If your server responds 402/400 when no keys, handle it here
      if (resp.status === 402) {
        setShowKeyModal(true);
        setIsGenerating(false);
        return;
      }

      const data = await resp.json();

      if (resp.ok && data?.success) {
        setOutput(data.content);

        // If API returns updated remaining keys, reflect them:
        if (typeof data?.remaining_blog_keys === "number") {
          setBlogKeyCount(data.remaining_blog_keys);
        } else {
          // Optional: optimistically decrement exactly once per success
          setBlogKeyCount((k) => Math.max(k - 1, 0));
        }
      } else {
        // If server says "No blog keys left"
        if (String(data?.message || "").toLowerCase().includes("no blog keys")) {
          setShowKeyModal(true);
        } else {
          setError(data?.message || "Failed to generate content. Please try again.");
        }
      }
    } catch (e) {
      console.error(e);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter a topic or description");
      return;
    }

    if (!auth) {
      setError("Please login to use AI writing tool");
      return;
    }

    if (blogKeyCount <= 0) {
      // Hard stop: show purchase modal
      setShowKeyModal(true);
      return;
    }

    if (!isOnline) {
      // Do not queue if no keys
      setPendingRequest({ input: input.trim(), template: selectedTemplate });
      setShowWaitingButton(true);
      setError("");
      return;
    }

    await executeGenerateContent(input.trim(), selectedTemplate);
  };

  const PostToDB = async () => {
    if (!output.trim()) {
      setError("No content to share");
      throw new Error("No content to share");
    }

    const time = new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    try {
      const resp = await fetch("/api/content-saveTo-DB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          template: selectedTemplate,
          content: output,
          type: "blog",
          generated_time: { time },
          visibility: "public",
          user: { email: auth?.email, name: auth?.name },
        }),
      });

      const contentData = await resp.json();

      if (!resp.ok || !contentData?.success) {
        throw new Error(contentData?.message || "Failed to save content");
      }

      const insertedId = contentData.data.insertedId;
      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
      const shareUrl = `${origin}/Shared-Content/${insertedId}`;

      setShareId(insertedId);
      setSharedUrl(shareUrl);

      return shareUrl;
    } catch (error) {
      console.error("❌ Failed to save content:", error);
      setError(error.message || "Failed to save content for sharing");
      throw error;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy content");
    }
  };

 const handleCheckout = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineItems: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Blog Keys (10-pack)" },
              unit_amount: 100, // $1.00
            },
            quantity: 1, // 1 pack
          },
        ],

        // ✅ Use snake_case to match webhook expectations
        email: auth.email,
        key_type: "blog",    // ✅ Changed from keyType to key_type
        quantity: 10,        // ✅ 10 keys per pack
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Checkout failed");
    }

    // Redirect using Stripe-hosted URL
    if (data.url) {
      window.location.href = data.url;
      return;
    }

    // Fallback: redirect using session ID
    if (data.id) {
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    }
  } catch (err) {
    console.error("❌ Checkout error:", err);
    alert("Checkout failed: " + err.message);
  } finally {
    setLoading(false);
  }
};
  const templates = [
    { id: "blog", name: "Blog Post", icon: <FileText size={18} /> },
    { id: "creative", name: "Creative Story", icon: <PenTool size={18} /> },
    { id: "academic", name: "Academic Paper", icon: <BookOpen size={18} /> },
    { id: "marketing", name: "Marketing Copy", icon: <Type size={18} /> },
  ];

  const features = [
    {
      title: "AI-Powered Content",
      description: "Advanced language models for high-quality content generation",
      icon: <Brain className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
    {
      title: "Lightning Fast",
      description: "Generate content in seconds, not hours",
      icon: <Zap className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
    {
      title: "SEO Optimized",
      description: "Content optimized for search engines",
      icon: <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
  ];

  const shareTitle = output ? output.slice(0, 80) : "Check this out";

  // Close share menu on outside click/esc
  useEffect(() => {
    function onClick(e) {
      if (!showShareMenu) return;
      const t = e.target;
      if (
        shareBtnRef.current &&
        !shareBtnRef.current.contains(t) &&
        shareMenuRef.current &&
        !shareMenuRef.current.contains(t)
      ) {
        setShowShareMenu(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setShowShareMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [showShareMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 transition-colors duration-200 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 dark:text-white">
      {/* Online banner */}
      {showNetStatus && (
        <div className="sticky top-0 z-50 animate-pulse bg-green-500 py-3 px-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-5 w-5 text-white" />
            <h1 className="text-lg font-semibold text-white">You are back online !✅</h1>
          </div>
        </div>
      )}

      {/* Offline banner */}
      {showOffNetStatus && (
        <div className="sticky top-0 z-50 bg-red-600 py-3 px-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-5 w-5 text-white animate-pulse" />
            <h1 className="text-lg font-semibold text-white">You are currently offline</h1>
          </div>
          <p className="mt-1 text-sm text-red-100">
            Requests will be processed when network is restored
          </p>
        </div>
      )}

      {/* Key Purchase Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowKeyModal(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>

              {/* Modal Content */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <Key className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  No Blog Keys Left!
                </h3>

                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  You have used all your available blog keys. Purchase more keys to
                  continue using the AI writing tool.
                </p>

                {/* Key Package */}
                <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-900/20">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                        10 Blog Keys Package
                      </h4>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Generate 10 AI articles
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        $1
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        0.1 per article
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Maybe Later
                  </button>

                  <button
                    onClick={() => {
                      handleCheckout();
                      setShowKeyModal(false);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-medium text-white transition-all hover:from-amber-600 hover:to-orange-600"
                  >
                    <ShoppingCart size={18} />
                    Buy Now
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Secure payment • Instant delivery • Money back guarantee
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        {/* Hero */}
        <section className="mb-6 text-center">
          <div className="mb-4 inline-flex w-full justify-center md:mb-6">
            <span className="flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-medium text-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-purple-600/20 md:px-4 md:py-2 md:text-sm">
              <Sparkles className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
              AI Writing Assistant
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 text-4xl font-bold sm:text-5xl"
          >
            Transform Your Ideas Into
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text pb-2 text-transparent">
              Masterful Writing
            </span>
          </motion.h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Our AI writing assistant helps you create compelling content, from
            blog posts to professional documents, in seconds.
          </p>
        </section>

        {/* Blog Key Counter */}
        {auth && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 flex md:justify-end justify-center"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 shadow-lg border border-amber-200/50 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-amber-700/30">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Blog Keys
                </span>
              </div>
              <div className="h-6 w-px bg-amber-300 dark:bg-amber-600" />
              <motion.div
                key={blogKeyCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1"
              >
                <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {blogKeyCount}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  available
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Writer Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mb-16 rounded-2xl border border-indigo-100/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700/50 dark:bg-gray-800/95 dark:shadow-gray-900/50 dark:hover:shadow-indigo-900/20"
        >
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Input */}
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  What would you like to write about?
                </h3>

                {/* Template Selector */}
                <div className="relative mb-6">
                  <div className="mb-2 flex items-center">
                    <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Content Type
                    </span>
                  </div>
                  <button
                    onClick={() => setShowTemplates((v) => !v)}
                    className="group flex w-full items-center justify-between rounded-xl border border-indigo-200/50 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 transition-all duration-200 hover:border-indigo-300 dark:border-gray-600 dark:from-gray-700 dark:to-gray-600 dark:hover:border-gray-500"
                    type="button"
                  >
                    <div className="flex items-center">
                      <span className="text-indigo-600 dark:text-indigo-300">
                        {templates.find((t) => t.id === selectedTemplate)?.icon}
                      </span>
                      <span className="ml-3 font-medium text-gray-800 dark:text-white">
                        {templates.find((t) => t.id === selectedTemplate)?.name}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-indigo-400 transition-transform duration-300 ${showTemplates ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showTemplates && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                      >
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              setShowTemplates(false);
                            }}
                            type="button"
                            className={`group flex w-full items-center px-4 py-3 text-left transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-gray-700 ${selectedTemplate === template.id
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                : "text-gray-700 dark:text-gray-300"
                              }`}
                          >
                            <span className="text-indigo-500 transition-transform group-hover:scale-110 dark:text-indigo-400">
                              {template.icon}
                            </span>
                            <span className="ml-3 font-medium">{template.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-2 flex items-center">
                  <PenTool className="mr-2 h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Your Topic
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setError("");
                    }}
                    placeholder="Describe what you want to write about... (e.g., 'A blog post about sustainable gardening practices')"
                    className="h-48 w-full resize-none rounded-2xl border-2 border-indigo-100/70 bg-white p-5 pr-16 pb-16 font-medium text-gray-800 outline-none transition-all duration-300 placeholder-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/50 dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                    disabled={isGenerating}
                  />

                  <div className="absolute bottom-3 right-3 z-10">
                    <motion.button
                      whileHover={{ scale: canGenerate ? 1.05 : 1 }}
                      whileTap={{ scale: canGenerate ? 0.95 : 1 }}
                      type="submit"
                      aria-label="Send"
                      disabled={!canGenerate}
                      className={`rounded-full p-3 shadow-lg transition-all duration-300 ${!canGenerate
                          ? "cursor-not-allowed bg-gray-300 dark:bg-gray-600"
                          : "cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30 dark:hover:shadow-purple-500/20"
                        }`}
                    >
                      {isGenerating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock size={22} className="text-white" />
                        </motion.div>
                      ) : !auth ? (
                        <Key size={22} className="text-gray-200" />
                      ) : blogKeyCount <= 0 ? (
                        <Key size={22} className="text-white" />
                      ) : (
                        <Send size={22} className="text-white" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Login Message */}
                {!auth && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <p className="text-blue-600 dark:text-blue-400 text-sm text-center">
                      🔐 Please login to use the AI Writing Assistant
                    </p>
                  </div>
                )}

                {/* No keys message (optional helper) */}
                {auth && blogKeyCount <= 0 && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                    <p className="text-amber-700 dark:text-amber-300 text-sm text-center">
                      You have no blog keys remaining.{" "}
                      <button
                        type="button"
                        className="underline font-medium"
                        onClick={() => setShowKeyModal(true)}
                      >
                        Buy more keys
                      </button>{" "}
                      to generate content.
                    </p>
                  </div>
                )}

                {showWaitingButton && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 rounded-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 dark:border-yellow-700 dark:from-yellow-900/20 dark:to-orange-900/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                          Waiting for Network Connection
                        </h4>
                        <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-300">
                          Your request is queued and will be processed automatically when
                          internet connection is restored.
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                          </div>
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                            Monitoring network status...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center text-sm text-red-500"
                  >
                    <span className="mr-1">⚠️</span> {error}
                  </motion.p>
                )}
              </form>
            </div>

            {/* Divider */}
            <div className="hidden lg:block">
              <div className="mx-4 h-full w-px bg-gradient-to-b from-transparent via-indigo-200/50 to-transparent dark:via-gray-600" />
            </div>

            {/* Output */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                    Generated Content
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Powered by ByteStory AI • Professional quality
                  </p>
                </div>

                {output && (
                  <div className="flex justify-center gap-2 relative" ref={shareBtnRef}>
                    <button
                      type="button"
                      onClick={() => setShowShareMenu((v) => !v)}
                      className="flex items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-indigo-700 transition-all duration-200 hover:bg-indigo-100 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                    >
                      Share
                    </button>

                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          ref={shareMenuRef}
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: -8, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.18 }}
                          className="absolute right-0 -top-2 translate-y-[-100%] z-30 rounded-xl border border-indigo-100/60 bg-white p-2 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                          role="menu"
                        >
                          <div className="flex items-center gap-2">
                            <FacebookShareButton
                              url={sharedUrl}
                              quote={shareTitle}
                              beforeOnClick={async () => {
                                try {
                                  const newUrl = await PostToDB();
                                  setSharedUrl(newUrl);
                                  return true;
                                } catch {
                                  return false;
                                }
                              }}
                            >
                              <FacebookIcon size={36} round />
                            </FacebookShareButton>

                            <WhatsappShareButton
                              url={sharedUrl}
                              title={shareTitle}
                              separator=" — "
                              beforeOnClick={async () => {
                                try {
                                  const newUrl = await PostToDB();
                                  setSharedUrl(newUrl);
                                  return true;
                                } catch {
                                  return false;
                                }
                              }}
                            >
                              <WhatsappIcon size={36} round />
                            </WhatsappShareButton>

                            {/* Instagram-style share */}
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const shareUrl = await PostToDB();

                                  if (navigator.share) {
                                    await navigator.share({
                                      title: shareTitle,
                                      text: output.slice(0, 100) + "...",
                                      url: shareUrl,
                                    });
                                    setShowShareMenu(false);
                                  } else {
                                    await navigator.clipboard.writeText(shareUrl);
                                    alert("Link copied to clipboard! Share this URL: " + shareUrl);
                                  }
                                } catch (error) {
                                  if (error.name !== "AbortError") {
                                    console.error("Share failed:", error);
                                    alert("Sharing failed. Please try again.");
                                  }
                                }
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white shadow hover:opacity-90 focus:outline-none"
                            >
                              <Instagram size={18} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Copy button */}
                    <div>
                      <motion.button
                        onClick={copyToClipboard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-indigo-700 transition-all duration-200 hover:bg-indigo-100 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                      >
                        <Copy size={18} className="mr-2" />
                        <span className="text-sm font-medium">
                          {copied ? "Copied!" : "Copy"}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-72 overflow-y-auto rounded-2xl border-2 border-indigo-100/50 bg-gradient-to-br from-white to-indigo-50/50 p-6 shadow-inner dark:from-gray-700/80 dark:to-gray-800/80 dark:border-gray-600">
                {isGenerating ? (
                  <div className="flex h-full items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0.5, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="relative">
                        <Sparkles className="mb-3 h-8 w-8 text-indigo-500" />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-2 rounded-full border-2 border-indigo-200 border-t-indigo-500"
                        />
                      </div>
                      <p className="font-medium text-gray-600 dark:text-gray-400">
                        Crafting your content...
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                        This may take a few moments
                      </p>
                    </motion.div>
                  </div>
                ) : output ? (
                  <div className="max-w-none markdown-content">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white border-b pb-2"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-xl font-bold mt-5 mb-3 text-gray-800 dark:text-gray-200"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-lg font-semibold mt-4 mb-2 text-gray-700 dark:text-gray-300"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="mb-4 text-justify leading-relaxed text-gray-800 dark:text-gray-200"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-bold text-gray-900 dark:text-white" {...props} />
                        ),
                        em: ({ node, ...props }) => (
                          <em className="italic text-gray-700 dark:text-gray-300" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="mb-4 ml-6 list-disc space-y-2 text-gray-800 dark:text-gray-200"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="mb-4 ml-6 list-decimal space-y-2 text-gray-800 dark:text-gray-200"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => <li className="text-justify" {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-4 border-indigo-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {output}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="relative mb-4">
                      <Type size={40} className="text-indigo-300 dark:text-indigo-500" />
                      <Sparkles className="absolute -right-2 -top-2 h-5 w-5 animate-pulse text-indigo-500" />
                    </div>
                    <h4 className="mb-2 font-semibold text-gray-600 dark:text-gray-400">
                      Awaiting Your Inspiration
                    </h4>
                    <p className="max-w-xs text-sm text-gray-500 dark:text-gray-500">
                      Enter your topic above and watch as AI transforms it into professional
                      content
                    </p>
                  </div>
                )}
              </div>

              {/* Word Count & Status */}
              {output && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60"
                >
                  <div className="flex flex-col xs:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 animate-ping rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {output.split(/\s+/).filter((w) => w.length > 0).length} words
                      </span>
                    </div>
                    <div className="hidden xs:block mx-2 h-5 w-px bg-gray-300 dark:bg-gray-600" />
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="font-medium whitespace-nowrap">Ready to use</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    {/* <Reader /> */}
                  </div>
                </motion.div>
              )}

              {/* Speech Recorder - Mobile */}
              <div className="mt-6 block lg:hidden">
                <SpeechRecorder />
              </div>
            </div>
          </div>

          {/* Speech Recorder - Desktop */}
          <div className="mt-6 hidden lg:block">
            <SpeechRecorder />
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="rounded-xl border border-indigo-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-indigo-900/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
