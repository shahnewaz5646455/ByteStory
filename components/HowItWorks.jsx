"use client";
import React from "react";
import { FileText, Search, Settings, Upload, BarChart, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Create Content",
      description: "Generate high-quality blog posts in minutes with our AI-powered editor. Just provide a topic and let our AI do the heavy lifting.",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Optimize SEO",
      description: "Get real-time SEO suggestions to improve your content's search engine visibility and ranking potential.",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Refine & Customize",
      description: "Fine-tune your content with our editing tools. Adjust tone, add media, and perfect your message.",
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Publish",
      description: "One-click publishing to your preferred platforms. WordPress, Webflow, Ghost, and more.",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Analyze Performance",
      description: "Track your content's performance with detailed analytics on views, engagement, and SEO metrics.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-5 py-2.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
            <span className="mr-2.5">🚀</span>
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5 tracking-tight">
            Streamline Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Content Workflow
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform ideas into published content with our seamless five-step process
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-16 bottom-16 w-1 bg-gradient-to-b from-indigo-300 to-purple-300 dark:from-indigo-800 dark:to-purple-800 transform -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row items-center bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Step Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center relative z-10 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                    <div className="text-indigo-600 dark:text-indigo-300">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-50 group-hover:opacity-70 animate-pulse"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 md:ml-10 mt-6 md:mt-0 text-center md:text-left">
                  <div className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-3">
                    <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    STEP {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <button className="group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm">
            <span className="relative z-10 text-lg">Start Your Free Trial</span>
            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2 duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 rounded-xl"></div>
          </button>
          <p className="text-gray-500 dark:text-gray-400 text-base mt-5 font-medium">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;