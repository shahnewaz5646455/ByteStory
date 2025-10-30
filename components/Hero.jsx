"use client"

import React from 'react';
import { Brain, BarChart3, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SparklesText } from '@/components/ui/sparkles-text';
import GridBackgroundView from '@/components/ui/GridBackgroundView';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { useSelector } from 'react-redux';

const Hero = () => {
  const auth = useSelector((store) => store.authStore.auth);
  return (
    <section className="relative px-4 overflow-hidden flex flex-col items-center justify-center py-12 md:py-16 lg:py-0 min-h-[calc(100vh-64px)]">
      <div className="absolute inset-0  z-0">
      <GridBackgroundView />
      <BackgroundBeamsWithCollision className="absolute inset-0 z-0" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Badge */}
        <div className="inline-flex mb-4 md:mb-6 justify-center md:mt-8 w-full">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md hover:shadow-lg dark:hover:shadow-purple-600/20 transition-shadow duration-300 flex items-center">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            AI-Powered Content Suite
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-300 mb-4 md:mb-6 leading-tight text-center">
          Create, Optimize & Publish with{" "}
          <span className="inline-block">
            <SparklesText>AI Power</SparklesText>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed text-center px-4">
          The all-in-one platform for AI content generation, SEO optimization, and seamless publishing.
        </p>

        {/* Buttons */}
        <div className="flex flex-nowrap justify-center gap-4 mb-16">
          <Link
             href={auth ? "/tools" : "/login"}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm md:text-base px-5 py-3 md:px-8 md:py-4 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-150 transform cursor-pointer flex items-center justify-center w-max whitespace-nowrap"
          >
            Start Creating Now
          </Link>
          <Link href="/features" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-indigo-100 dark:border-gray-700 font-semibold text-sm md:text-base px-5 py-3  md:px-8 md:py-4 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-300 flex items-center justify-center cursor-pointer w-max whitespace-nowrap">
            View All Features
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto mb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-indigo-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-indigo-900/30 transition-shadow duration-300">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">AI Content Generation</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Create high-quality blog posts, articles, and marketing copy in minutes with our advanced AI.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-purple-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-purple-900/30 transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">SEO Scoring & Optimization</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get real-time SEO analysis and recommendations to maximize your content's search visibility.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-indigo-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-indigo-900/30 transition-shadow duration-300">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">One-Click Publishing</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Publish your optimized content directly to your blog or CMS with our seamless integration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;