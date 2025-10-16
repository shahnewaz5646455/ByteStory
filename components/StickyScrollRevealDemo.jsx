"use client";
import React from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, Zap, Brain, FileText, Hash, BookOpen, Download } from "lucide-react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "SEO Checker",
    description:
      "Optimize your content for search engines with our advanced SEO analysis tool. Get real-time suggestions for keywords, meta descriptions, and content structure. Improve your search rankings and drive more organic traffic to your website with data-driven recommendations.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg ">
          <img 
            src="thumbnail/seo1.png" 
            alt="SEO Checker" 
            className="w-full h-full object-cover"
          />
      </div>
    ),
  },
  {
    title: "Grammar Checker",
    description:
      "Eliminate errors and polish your writing with our intelligent grammar checker. Detect spelling mistakes, punctuation errors, and style issues in real-time. Get detailed explanations and suggestions to improve your writing clarity and professionalism across all your documents.",
      content: (
          <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg ">
          <img 
          src="thumbnail/grammer2.png" 
            alt="Grammar Checker" 
            className="w-full h-full object-cover"
          />
      </div>
    ),
  },
  {
    title: "Blog Post Generator",
    description:
      "Create engaging, SEO-optimized blog posts from simple titles or keywords. Our AI generates complete articles with proper structure, headings, and compelling content. Customize the tone, length, and style to match your brand voice and target audience perfectly.",
      content: (
          <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg ">
          <img 
          src="thumbnail/blog3.png" 
            alt="Blog Post Generator" 
            className="w-full h-full object-cover"
          />
      </div>
    ),
  },
  {
    title: "AI Summarizer",
    description:
      "Quickly extract key points from long articles, research papers, or documents. Our AI summarizer condenses content while preserving essential information and context. Save hours of reading time and get straight to the insights that matter for your work or studies.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg ">
          <img 
            src="thumbnail/summary4.png" 
            alt="AI Summarizer" 
            className="w-full h-full object-cover"
          />
      </div>
    ),
  },
  {
    title: "PDF Tools Suite",
    description:
      "Extract, summarize, and analyze PDF documents with our powerful PDF tools. Convert PDF content to editable text, generate comprehensive summaries, and extract specific data points. Perfect for researchers, students, and professionals working with document-heavy workflows.",
      content: (
          <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg ">
          <img 
          src="thumbnail/pdf5.png" 
            alt="PDF Tools Suite" 
            className="w-full h-full object-cover"
          />
      </div>
    ),
  },
  {
    title: "Hashtag Generator",
    description:
      "Boost your social media engagement with perfectly targeted hashtags. Our AI analyzes your content and suggests relevant, trending hashtags across platforms. Increase your reach, improve discoverability, and grow your audience with data-driven hashtag recommendations.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg ">
          <img 
            src="thumbnail/hashtag6.png"  
            alt="Hashtag Generator" 
            className="w-full h-full object-cover"
          />
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful AI Writing <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Tools Suite</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover our comprehensive suite of AI-powered writing tools designed to enhance your productivity, 
            improve your content quality, and streamline your writing workflow.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="thumbnail/seo1.png" 
                alt="SEO Checker" 
                className="w-16 h-16 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Checker</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="thumbnail/grammer2.png" 
                alt="Grammar Checker" 
                className="w-16 h-16 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grammar Checker</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="thumbnail/blog3.png" 
                alt="Blog Post Generator" 
                className="w-16 h-16 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blog Generator</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="thumbnail/summary4.png" 
                alt="AI Summarizer" 
                className="w-16 h-16 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Summarizer</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="thumbnail/pdf5.png" 
                alt="PDF Summarizer" 
                className="w-16 h-16 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF Tools</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="thumbnail/hashtag6.png" 
                alt="Hashtag Generator" 
                className="w-16 h-16 object-cover rounded-lg mb-3"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hashtag Generator</span>
            </div>
          </div>
        </motion.div>



































        <StickyScroll content={content} />
        
      
      </div>
    </div>
  );
}