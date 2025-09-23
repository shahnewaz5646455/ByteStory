"use client"

import { useState } from "react"
import { Search, Zap, CheckCircle, ArrowRight, Play, Image as ImageIcon } from "lucide-react"

const tools = [
  {
    title: "SEO Checker",
    description: "Our SEO Checker analyzes your website and gives you actionable suggestions to improve your ranking on search engines. Perfect for bloggers, businesses, and marketers.",
    features: [
      "Keyword optimization analysis",
      "Meta tag recommendations",
      "Content readability score",
      "Backlink opportunity suggestions",
      "Competitor analysis insights"
    ],
    useCases: ["Bloggers", "E-commerce sites", "Content marketers", "Small businesses"],
    imageType: "screenshot" // or "video"
  },
  {
    title: "Grammar Checker",
    description: "Eliminate grammar, spelling, and punctuation mistakes instantly. Improve the readability and professionalism of your content.",
    features: [
      "Real-time grammar correction",
      "Spelling and punctuation check",
      "Tone and style suggestions",
      "Plagiarism detection",
      "Vocabulary enhancement"
    ],
    useCases: ["Writers", "Students", "Professionals", "Non-native speakers"],
    imageType: "screenshot"
  },
  {
    title: "Blog Post Generator",
    description: "Turn a simple title into a complete, well-structured blog post. Save time and focus on creativity while AI takes care of the writing.",
    features: [
      "Topic expansion and research",
      "SEO-optimized structure",
      "Multiple content tones available",
      "Image suggestion integration",
      "One-click publishing ready"
    ],
    useCases: ["Content creators", "Marketing teams", "Agency writers", "Small business owners"],
    imageType: "video"
  },
  {
    title: "AI Summarizer",
    description: "Summarize long articles, research papers, or reports into concise overviews. Get the main ideas in seconds.",
    features: [
      "Adjustable summary length",
      "Key point extraction",
      "Bullet point or paragraph format",
      "Multiple language support",
      "Citation preservation"
    ],
    useCases: ["Researchers", "Students", "Executives", "Journalists"],
    imageType: "screenshot"
  },
  {
    title: "PDF Summarizer",
    description: "Upload any PDF file and get a clear summary of its content. Perfect for study notes, business reports, and research material.",
    features: [
      "PDF text extraction",
      "Chapter-wise summarization",
      "Key statistics highlighting",
      "Academic paper analysis",
      "Batch processing support"
    ],
    useCases: ["Academics", "Legal professionals", "Business analysts", "Researchers"],
    imageType: "screenshot"
  },
  {
    title: "PDF Extractor",
    description: "Extract raw text from any PDF file and optionally generate a summarized version. Useful for documents that are too long to read.",
    features: [
      "Text and image extraction",
      "Format preservation",
      "Table and chart recognition",
      "OCR for scanned documents",
      "Export to multiple formats"
    ],
    useCases: ["Data entry professionals", "Researchers", "Archivists", "Content managers"],
    imageType: "video"
  },
  {
    title: "Hashtag Generator",
    description: "Get AI-powered hashtag suggestions for your blog posts and social media content to increase visibility and engagement.",
    features: [
      "Trending hashtag analysis",
      "Platform-specific suggestions",
      "Engagement probability scoring",
      "Hashtag performance tracking",
      "Seasonal trend incorporation"
    ],
    useCases: ["Social media managers", "Influencers", "Brands", "Content creators"],
    imageType: "screenshot"
  }
]

export default function FeaturesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTool, setActiveTool] = useState(0)

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.useCases.some(useCase => useCase.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Tools for <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Content Creators</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover our suite of AI tools designed to streamline your content creation process, 
            enhance quality, and boost your online presence.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredTools.map((tool, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tool.title}
                  </h3>
                  <button
                    onClick={() => setActiveTool(index)}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
                  >
                    View Details <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.useCases.slice(0, 3).map((useCase, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                    >
                      {useCase}
                    </span>
                  ))}
                  {tool.useCases.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                      +{tool.useCases.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    {tool.imageType === "video" ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    {tool.imageType === "video" ? "Video demo" : "Screenshot"}
                  </span>
                  <span>{tool.features.length} features</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Tool View */}
        {filteredTools.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content Side */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {filteredTools[activeTool]?.title}
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {filteredTools[activeTool]?.description}
                </p>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredTools[activeTool]?.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Perfect For</h4>
                  <div className="flex flex-wrap gap-2">
                    {filteredTools[activeTool]?.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                    Try Now
                  </button>
                  <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                    View Documentation
                  </button>
                </div>
              </div>

              {/* Media Side */}
              <div className="bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-8">
                <div className="text-center">
                  {filteredTools[activeTool]?.imageType === "video" ? (
                    <div className="relative">
                      <div className="w-full h-64 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <Play className="h-16 w-16 text-white opacity-70" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all duration-200">
                          <Play className="h-8 w-8 text-white" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 mt-4">
                    {filteredTools[activeTool]?.imageType === "video" 
                      ? "Tool demonstration video" 
                      : "Tool interface screenshot"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  )
}