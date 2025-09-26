"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import Reader from "@/components/ui/Reader";
import SpeechRecorder from "@/components/ui/speechRecorder";

export default function AIWriterPage() {
  // ---- Network state ----
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [showNetStatus, setShowNetStatus] = useState(false);
  const [showWaitingButton, setShowWaitingButton] = useState(false);
  const [showOffNetStatus, setShowOffNetStatus] = useState(!isOnline);
  const [hasNetworkChanged, setHasNetworkChanged] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  // ---- App state ----
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blog");
  const [showTemplates, setShowTemplates] = useState(false);
  const [error, setError] = useState("");

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

      if (pendingRequest) {
        // resume queued request
        executeGenerateContent(pendingRequest.input, pendingRequest.template);
        setPendingRequest(null);
      }

      const t = setTimeout(() => setShowNetStatus(false), 4000);
      return () => clearTimeout(t);
    } else {
      setShowNetStatus(false);
      setShowOffNetStatus(true);
      setIsGenerating(false); // stop spinner if any
    }
  }, [isOnline, hasNetworkChanged, pendingRequest]);

  // ---- API call ----
  const executeGenerateContent = async (inputText, template) => {
    setIsGenerating(true);
    setError("");
    setOutput("");
    try {
      const resp = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText, template }),
      });
      const data = await resp.json();
      if (data?.success) setOutput(data.content);
      else setError("Failed to generate content. Please try again.");
    } catch (e) {
      console.error(e);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a topic or description");
      return;
    }
    if (!isOnline) {
      setPendingRequest({ input: input.trim(), template: selectedTemplate });
      setShowWaitingButton(true);
      setError("");
      return;
    }
    await executeGenerateContent(input.trim(), selectedTemplate);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert("Content copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy content");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 transition-colors duration-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
      {/* Online banner */}
      {showNetStatus && (
        <div className="sticky top-0 z-50 animate-pulse bg-green-500 py-3 px-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-5 w-5 text-white" />
            <h1 className="text-lg font-semibold text-white">You are back online ✅</h1>
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

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        {/* Hero */}
        <section className="mb-16 text-center">
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

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Our AI writing assistant helps you create compelling content, from
            blog posts to professional documents, in seconds.
          </p>
        </section>

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
                    className="group flex w-full items-center justify-between rounded-xl border border-indigo-200/50 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 transition-all duration-200 hover:border-indigo-300 dark:from-gray-700 dark:to-gray-600 dark:border-gray-600 dark:hover:border-gray-500"
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
                      className={`text-indigo-400 transition-transform duration-300 ${
                        showTemplates ? "rotate-180" : ""
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
                            className={`group flex w-full items-center px-4 py-3 text-left transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-gray-700 ${
                              selectedTemplate === template.id
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

              {/* Use a FORM so onSubmit fires */}
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <div className="mb-2 flex items-center">
                    <PenTool className="mr-2 h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Your Topic
                    </span>
                  </div>

                  <textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setError("");
                    }}
                    placeholder="Describe what you want to write about... (e.g., 'A blog post about sustainable gardening practices')"
                    className="h-48 w-full resize-none rounded-2xl border-2 border-indigo-100/70 bg-white p-5 font-medium text-gray-800 outline-none transition-all duration-300 placeholder-gray-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/50 dark:border-gray-600 dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                    disabled={isGenerating}
                  />

                  <div className="absolute bottom-4 right-4 flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isGenerating || !input.trim()}
                      className={`rounded-full p-3 shadow-lg transition-all duration-300 ${
                        isGenerating || !input.trim()
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
                      ) : (
                        <Send size={22} className="text-white" />
                      )}
                    </motion.button>
                  </div>
                  <SpeechRecorder/>
                </div>

                {/* Waiting for Network Badge */}
                {showWaitingButton && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 dark:border-yellow-700 dark:from-yellow-900/20 dark:to-orange-900/20"
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
                  <motion.button
                    onClick={copyToClipboard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-indigo-700 transition-all duration-200 hover:bg-indigo-100 dark:border-indigo-700/30 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                  >
                    <Copy size={18} className="mr-2" />
                    <span className="text-sm font-medium">Copy</span>
                  </motion.button>
                )}
              </div>

              <div className="h-48 overflow-y-auto rounded-2xl border-2 border-indigo-100/50 bg-gradient-to-br from-white to-indigo-50/50 p-6 shadow-inner dark:from-gray-700/80 dark:to-gray-800/80 dark:border-gray-600">
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
                  <div className="prose prose-sm max-w-none dark:prose-invert sm:prose">
                    <div className="leading-relaxed text-gray-800 dark:text-gray-200">
                      {output.split("\n").map((paragraph, i) =>
                        paragraph.trim() ? (
                          <p key={i} className="mb-4 text-justify">
                            {paragraph}
                          </p>
                        ) : null
                      )}
                    </div>
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
                      Enter your topic above and watch as AI transforms it into professional content
                    </p>
                  </div>
                )}
              </div>

              {/* Word Count & Status */}
              {output && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 animate-ping rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {output.split(/\s+/).filter((w) => w.length > 0).length} words
                    </span>
                  </div>
                  <Reader/>
                  <div className="mx-3 h-5 w-px bg-gray-300 dark:bg-gray-600" />
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Ready to use</span>
                  </div>
                </motion.div>
              )}
            </div>
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
