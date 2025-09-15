"use client"
import React from 'react';
import { Brain, BarChart3, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-indigo-50 min-h-screen via-white to-purple-50 text-center py-16 md:py-24 px-4 overflow-hidden">
            {/* Background bubbles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-100 rounded-full opacity-50 mix-blend-multiply animate-blob"></div>
                <div className="absolute bottom-0 -right-20 w-72 h-72 bg-indigo-100 rounded-full opacity-50 mix-blend-multiply animate-blob animation-delay-2000"></div>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
                {/* Badge */}
                <div className="inline-flex mb-6">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI-Powered Content Suite
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Create, Optimize & Publish with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">AI Power</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
                    The all-in-one platform for AI content generation, SEO optimization, and seamless publishing.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <Link href="/login" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-150 transform cursor-pointer flex items-center justify-center">
                        Start Creating Now
                    </Link>
                    <button className="bg-white text-gray-800 border-2 border-indigo-100 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition duration-300 flex items-center justify-center cursor-pointer">
                        View All Features
                    </button>
                </div>
            </div>
            
            {/* Feature Cards */}
            <div className='max-w-6xl mx-auto px-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {/* Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 group hover:bg-indigo-200 transition-all duration-300  bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <Brain className="h-6 w-6 text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">AI Content Generation</h3>
                        <p className="text-gray-600 text-sm">Create high-quality blog posts, articles, and marketing copy in minutes with our advanced AI.</p>
                    </div>
                    
                    {/* Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 group hover:bg-purple-200 transition-all duration-300  bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <BarChart3 className="h-6 w-6 text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">SEO Scoring & Optimization</h3>
                        <p className="text-gray-600 text-sm">Get real-time SEO analysis and recommendations to maximize your content's search visibility.</p>
                    </div>
                    
                    {/* Content Publishing Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 group hover:bg-indigo-200 transition-all duration-300  bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <Send className="h-6 w-6 text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">One-Click Publishing</h3>
                        <p className="text-gray-600 text-sm">Publish your optimized content directly to your blog or CMS with our seamless integration.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;