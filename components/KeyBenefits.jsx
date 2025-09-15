"use client"
import React from "react";
import { PenTool, Zap, TrendingUp, Layout, BarChart3, Heart } from "lucide-react";

const benefits = [
  {
    icon: <PenTool className="h-7 w-7 text-purple-600" />,
    title: "Smart Content Creation",
    desc: "Generate high-quality, engaging content in minutes with our advanced AI algorithms.",
  },
  {
    icon: <TrendingUp className="h-7 w-7 text-purple-600" />,
    title: "SEO Optimization",
    desc: "Built-in SEO tools that analyze and optimize your content for higher search rankings.",
  },
  {
    icon: <Zap className="h-7 w-7 text-purple-600" />,
    title: "Lightning Fast",
    desc: "Create, edit, and publish content 10x faster than traditional methods.",
  },
  {
    icon: <Layout className="h-7 w-7 text-purple-600" />,
    title: "AI Blog Templates",
    desc: "Kickstart your writing with ready-made AI-powered blog templates tailored to your niche.",
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-purple-600" />,
    title: "Performance Analytics",
    desc: "Track your blog’s growth with detailed insights on views, engagement, and audience reach.",
  },
  {
    icon: <Heart className="h-7 w-7 text-purple-600" />,
    title: "Engagement Features",
    desc: "Boost interaction with likes, comments, and save options for your readers.",
  },
];


const KeyBenefits = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">AI Platform</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the powerful features that make content creation effortless and effective
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;