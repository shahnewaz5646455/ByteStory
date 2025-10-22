"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const tools = [
  { 
    name: "SEO Checker", 
    desc: "Analyze and optimize your website for search engines." 
  },
  { 
    name: "Grammar Checker", 
    desc: "Check for grammar, spelling, and punctuation errors." 
  },
  { 
    name: "Blog Post Generator", 
    desc: "Generate a full blog post from a simple title." 
  },
  { 
    name: "AI Summarizer", 
    desc: "Summarize long articles and texts quickly." 
  },
  { 
    name: "PDF Summarizer", 
    desc: "Quickly get the main points from any PDF document." 
  },
  { 
    name: "PDF Extractor", 
    desc: "Extract text from PDF and generate summarized version instantly." 
  },
  { 
    name: "Hashtag Generator", 
    desc: "Get suggested hashtags for your blog posts and content." 
  },
  { 
    name: "Email Writer", 
    desc: "Create professional emails with AI assistance." 
  },
];

export default function ToolboxSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center lg:text-left">
        <p className="text-indigo-500 font-semibold mb-2">Creator's Toolbox</p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          8 <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">AI-Powered</span> Blogging Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
          Here's every tool inside <span className="font-medium text-indigo-500">ByteStory</span>, 
          designed to help you create content faster & more effectively.  
          New tools are added all the time.
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-8 gap-x-12">
          {tools.map((tool, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start md:items-center gap-3"
            >
              <span className="text-indigo-500 text-xl font-semibold">✔</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-start text-sm mt-1">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-12 flex justify-center lg:justify-start">
         <div className="flex gap-4 justify-center items-center mb-6">
                        <Link href="/tools" className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2 cursor-pointer">
                            <span className="whitespace-nowrap">SEE ALL TOOLS</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    </div>
        </div>
      </div>
    </section>
  );
}