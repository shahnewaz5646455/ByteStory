"use client";
import { motion } from "framer-motion";
import { Sparkles, FileText, Zap, TrendingUp, CheckCircle, Hash, Mail, ArrowRight } from "lucide-react";

const tools = [
  {
    name: "SEO Checker",
    desc: "Analyze and optimize your website for search engines.",
    icon: TrendingUp,
    href: "/seo-checker",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    tag: "Popular"
  },
  {
    name: "Grammar Checker",
    desc: "Check for grammar, spelling, and punctuation errors.",
    icon: CheckCircle,
    href: "/grammar-checker",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    tag: "New"
  },
  {
    name: "Blog Post Generator",
    desc: "Generate a full blog post from a simple title.",
    icon: FileText,
    href: "/blog-generator",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    tag: "AI Powered"
  },
  {
    name: "AI Summarizer",
    desc: "Summarize long articles and texts quickly.",
    icon: Zap,
    href: "/AIsummarizer",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    tag: "Fast"
  },
  {
    name: "PDF Summarizer",
    desc: "Quickly get the main points from any PDF document.",
    icon: FileText,
    href: "/pdf_summarizer",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    tag: "Time Saver"
  },
  {
    name: "PDF Extractor",
    desc: "Extract text from PDF and generate summarized version instantly.",
    icon: Sparkles,
    href: "/pdf-converter",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    tag: "Pro"
  },
  {
    name: "Hashtag Generator",
    desc: "Get suggested hashtags for your blog posts and content.",
    icon: Hash,
    href: "/hashtag",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    tag: "Social"
  },
  {
    name: "Email Writer",
    desc: "Create professional emails with AI assistance.",
    icon: Mail,
    href: "/email-writer",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    tag: "Business"
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              {tools.length}+ Powerful Tools
            </span>
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Toolbox</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Everything you need to create, optimize, and grow your content. 
            Powered by cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <a
                  href={tool.href}
                  className="block h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    {tool.tag && (
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${tool.bgColor} text-gray-700 dark:text-gray-300`}>
                        {tool.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                    {tool.desc}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Use Tool
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}