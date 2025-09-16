"use client"

import React from 'react';
import { Brain, BarChart3, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SparklesText } from '@/components/ui/sparkles-text';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 min-h-screen via-white to-purple-50 px-4 overflow-hidden flex flex-col items-center justify-center py-12 md:py-16 lg:py-20">
      {/* Background bubbles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 md:-top-20 md:-left-20 w-48 h-48 md:w-72 md:h-72 bg-purple-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-0 -right-16 md:-right-20 w-48 h-48 md:w-72 md:h-72 bg-indigo-100 rounded-full opacity-50 mix-blend-multiply"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Badge */}
        <div className="inline-flex mb-4 md:mb-6 justify-center w-full">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            AI-Powered Content Suite
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight text-center">
          Create, Optimize & Publish with{" "}
          <span className="inline-block">
            <SparklesText>AI Power</SparklesText>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed text-center px-4">
          The all-in-one platform for AI content generation, SEO optimization, and seamless publishing.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-150 transform cursor-pointer flex items-center justify-center w-max"
          >
            Start Creating Now
          </Link>
          <button className="bg-white text-gray-800 border-2 border-indigo-100 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition duration-300 flex items-center justify-center cursor-pointer w-max">
            View All Features
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 group hover:bg-indigo-200 transition-all duration-300 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">AI Content Generation</h3>
            <p className="text-gray-600 text-sm">
              Create high-quality blog posts, articles, and marketing copy in minutes with our advanced AI.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 group hover:bg-purple-200 transition-all duration-300 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">SEO Scoring & Optimization</h3>
            <p className="text-gray-600 text-sm">
              Get real-time SEO analysis and recommendations to maximize your content's search visibility.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100 hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 group hover:bg-indigo-200 transition-all duration-300 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">One-Click Publishing</h3>
            <p className="text-gray-600 text-sm">
              Publish your optimized content directly to your blog or CMS with our seamless integration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;