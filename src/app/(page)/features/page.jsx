"use client"

import { useState } from "react"
import { Zap, CheckCircle, } from "lucide-react"
import NextImage from "next/image"
import { Safari } from "@/components/ui/safari"


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
    imageType: "screenshot",
    imageUrl: "/screenshots/seo.png"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200 py-12">
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
        </div>

        {/* Detailed Tool View */}

        <div className="space-y-16">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
            >
              {/* Content Side */}
              <div className={`
      bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8
      order-1
      ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}
    `}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {tool.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {tool.description}
                </p>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {tool.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Perfect For</h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.useCases.map((useCase, uIndex) => (
                      <span
                        key={uIndex}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Media Side */}
              <div
                className={`
      relative flex items-center justify-center
      order-2
      ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}
    `}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 ">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-blue-900/20 rounded-2xl" />
                </div>

                {/* Safari Component wrapper */}
                <div className="relative z-10 w-full max-w-2xl ">
                  <Safari
                    url={`https://app.yourwebsite.com/${tool.title.toLowerCase().replace(/\s/g, '-')}`}
                    className="shadow-lg"
                  >
                    <div className="w-full h-full bg-white dark:bg-gray-900 overflow-hidden">
                      {tool.imageType === "screenshot" && tool.imageUrl ? (
                        <div className="relative w-full h-full">
                          <NextImage
                            src={tool.imageUrl}
                            alt={tool.title}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                          <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <Zap className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                              {tool.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Demo interface coming soon
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Safari>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}