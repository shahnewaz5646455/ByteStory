"use client";
import React from "react";
import {
  FileText,
  Search,
  Settings,
  Upload,
  BarChart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FileText className="text-xl" />,
      title: "Create Content",
      description:
        "Generate high-quality blog posts in minutes with our AI-powered editor. Just provide a topic and let our AI do the heavy lifting.",
      color: "from-blue-500 to-cyan-500",
      feature: "Content Creation",
    },
    {
      id: 2,
      icon: <Search className="text-xl" />,
      title: "Optimize SEO",
      description:
        "Get real-time SEO suggestions to improve your content's search engine visibility and ranking potential.",
      color: "from-purple-500 to-pink-500",
      feature: "SEO Optimizer",
    },
    {
      id: 3,
      icon: <Settings className="text-xl" />,
      title: "Refine & Customize",
      description:
        "Fine-tune your content with our editing tools. Adjust tone, add media, and perfect your message.",
      color: "from-amber-500 to-orange-500",
      feature: "Content Editor",
    },
    {
      id: 4,
      icon: <Upload className="text-xl" />,
      title: "Publish",
      description:
        "One-click publishing to your preferred platforms. WordPress, Webflow, Ghost, and more.",
      color: "from-green-500 to-teal-500",
      feature: "Publisher",
    },
    {
      id: 5,
      icon: <BarChart className="text-xl" />,
      title: "Analyze Performance",
      description:
        "Track your content's performance with detailed analytics on views, engagement, and SEO metrics.",
      color: "from-indigo-500 to-blue-500",
      feature: "Analytics",
    },
  ];

  return (
    <section className="py-16 dark:bg-gray-900 relative overflow-hidden0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 px-5 py-2.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
            Streamline Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Content Workflow
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform ideas into published content with our seamless five-step process
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Middle Line */}
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2"></div>

          <div className="steps-container space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-item relative flex items-center w-full ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                {/* Dot */}
                <div className="timeline-dot md:block hidden absolute left-1/2 transform -translate-x-1/2 bg-white border-4 border-indigo-500 rounded-full w-6 h-6 z-10"></div>

                {/* Card */}
                <div
                  className={`w-full md:w-5/12 dark:bg-gray-800 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
                    index % 2 === 0 ? "ml-0 mr-auto" : "ml-auto mr-0"
                  }`}
                >
                  <div
                    className="feature-badge inline-flex items-center text-sm font-medium mb-4 py-1 rounded-md"
                    style={{
                      background: `linear-gradient(to right, ${step.color
                        .split(" ")[0]
                        .replace("from-", "#")}, ${step.color
                        .split(" ")[1]
                        .replace("to-", "#")})`,
                    }}
                  >
                    {step.icon}
                    <span className="ml-2">{step.feature}</span>
                  </div>
                  <h3 className="step-title text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="step-description text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <button className="group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer">
            <span className="relative z-10 text-lg">Start Your Free Trial</span>
            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2 duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
          <p className="text-gray-500 dark:text-gray-400 text-base mt-5 font-medium">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
