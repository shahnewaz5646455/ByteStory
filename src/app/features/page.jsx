"use client";

import { useState } from "react";
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
} from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import { AuroraText } from "@/components/ui/aurora-text";
import { toast } from "react-toastify";

export default function AIWriterPage() {
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
      description:
        "Advanced language models for high-quality content generation",
      icon: (
        <Brain className="text-indigo-600 dark:text-indigo-400" size={24} />
      ),
    },
    {
      title: "Lightning Fast",
      description: "Generate content in seconds, not hours",
      icon: <Zap className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
    {
      title: "SEO Optimized",
      description: "Content optimized for search engines",
      icon: (
        <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={24} />
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter a topic or description");
      return;
    }

    setIsGenerating(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          template: selectedTemplate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.content);
      } else {
        setError("Failed to generate content. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Content copied to clipboard!", {
        className:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg rounded-lg",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
        position: "top-right",
        autoClose: 800,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy content", {
        className:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg rounded-lg",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex mb-4 md:mb-6 justify-center w-full">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md hover:shadow-lg dark:hover:shadow-purple-600/20 transition-shadow duration-300 flex items-center">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              AI Writing Assistant
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Transform Your Ideas Into
            <span className="block bg-clip-text pb-2 text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              <AuroraText>Masterful Writing</AuroraText>
            </span>
          </motion.h2>

          <TextAnimate
            animation="slideLeft"
            by="character"
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Our AI writing assistant helps you create compelling content, from
            blog posts to professional documents, in seconds.
          </TextAnimate>
        </section>
        {/* Writer Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className=" rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 border border-indigo-100/50 dark:border-gray-700/50 hover:shadow-2xl dark:hover:shadow-indigo-900/20 transition-all duration-300 mb-16 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Input Section */}
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  What would you like to write about?
                </h3>

                {/* Template Selector */}
                <div className="relative mb-6">
                  <div className="flex items-center mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Content Type
                    </span>
                  </div>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl w-full justify-between border border-indigo-200/50 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-gray-500 transition-all duration-200 group"
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
                      className={`transition-transform duration-300 text-indigo-400 ${showTemplates ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showTemplates && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl overflow-hidden z-20 border border-indigo-100 dark:border-gray-700 shadow-2xl"
                      >
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              setShowTemplates(false);
                            }}
                            className={`flex items-center w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200 group ${selectedTemplate === template.id
                              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                              : "text-gray-700 dark:text-gray-300"
                              }`}
                          >
                            <span className="text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                              {template.icon}
                            </span>
                            <span className="ml-3 font-medium">
                              {template.name}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <div className="flex items-center mb-2">
                    <PenTool className="w-4 h-4 text-indigo-500 mr-2" />
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
                    className="w-full h-48 bg-white dark:bg-gray-700/80 border-2 border-indigo-100/70 dark:border-gray-600 rounded-2xl p-5 focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 dark:focus:ring-indigo-500/20 resize-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white font-medium"
                    disabled={isGenerating}
                  />

                  <div className="absolute bottom-4 right-4 flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isGenerating || !input.trim()}
                      className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isGenerating || !input.trim()
                        ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer hover:shadow-indigo-500/30 dark:hover:shadow-purple-500/20"
                        }`}
                    >
                      {isGenerating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Clock size={22} className="text-white" />
                        </motion.div>
                      ) : (
                        <Send size={22} className="text-white" />
                      )}
                    </motion.button>
                  </div>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-3 flex items-center"
                  >
                    <span className="mr-1">⚠️</span> {error}
                  </motion.p>
                )}
              </form>
            </div>

            {/* Divider */}
            <div className="hidden lg:block">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-indigo-200/50 dark:via-gray-600 to-transparent mx-4"></div>
            </div>

            {/* Output Section */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    Generated Content
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Powered by AI • Professional quality
                  </p>
                </div>
                {output && (
                  <motion.button
                    onClick={copyToClipboard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-200 border border-indigo-100 dark:border-indigo-700/30"
                  >
                    <Copy size={18} className="mr-2" />
                    <span className="text-sm font-medium">Copy</span>
                  </motion.button>
                )}
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-700/80 dark:to-gray-800/80 border-2 border-indigo-100/50 dark:border-gray-600 rounded-2xl p-6 h-48 overflow-y-auto shadow-inner">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      initial={{ opacity: 0.5, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1.5,
                      }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="relative">
                        <Sparkles className="text-indigo-500 mb-3 w-8 h-8" />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute -inset-2 border-2 border-indigo-200 border-t-indigo-500 rounded-full"
                        />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Crafting your content...
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        This may take a few moments
                      </p>
                    </motion.div>
                  </div>
                ) : output ? (
                  <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed font-light">
                      {output.split("\n").map((paragraph, index) =>
                        paragraph.trim() ? (
                          <p key={index} className="mb-4 text-justify">
                            {paragraph}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="relative mb-4">
                      <Type
                        size={40}
                        className="text-indigo-300 dark:text-indigo-500"
                      />
                      <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-indigo-500 animate-pulse" />
                    </div>
                    <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Awaiting Your Inspiration
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
                      Enter your topic above and watch as AI transforms it into
                      professional content
                    </p>
                  </div>
                )}
              </div>

              {/* Word Count & Actions */}
              {output && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {output.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                  words generated
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-indigo-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-indigo-900/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-6">
            Ready to elevate your writing?
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg shadow-md hover:shadow-lg dark:hover:shadow-purple-600/20 transition-shadow duration-300"
          >
            Start Writing Now
          </motion.button>
        </motion.section>
      </main>
    </div>
  );
}
