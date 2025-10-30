"use client";
import React from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  FileText, 
  Users, 
  Notebook, 
  Search, 
  FileUp, 
  Hash, 
  MessageSquare, 
  Mail,
  Zap,
  ArrowRight,
  Star,
  Eye,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react';
import Link from 'next/link';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: CheckCircle,
      title: "Grammar Checker",
      description: "AI-powered grammar, punctuation, and spelling checker with real-time suggestions and explanations.",
      details: [
        "Real-time grammar and spell checking",
        "Contextual suggestions with explanations",
        "One-click fixes and corrections",
        "Before-and-after comparison view",
        "Stylistic improvements"
      ],
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Learn Section",
      description: "Interactive learning hub with writing tutorials and personalized skill assessment tests.",
      details: [
        "Personalized writing skill assessment",
        "Interactive tutorials and guides",
        "Progress tracking and recommendations",
        "Writing challenges and exercises",
        "Skill-based learning paths"
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      id: 3,
      icon: FileText,
      title: "Blog Post Generator",
      description: "Create full articles with guided prompts, voice input, and multiple content types.",
      details: [
        "Multiple content types (blog, story, academic)",
        "Voice input support",
        "Topic-based content generation",
        "SEO-optimized structure",
        "Multiple draft versions"
      ],
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      id: 4,
      icon: Users,
      title: "Feed Page",
      description: "Social blogging platform with dynamic content feed, reactions, and community engagement.",
      details: [
        "Dynamic content feed",
        "Like, comment, and share functionality",
        "Trending posts and topics",
        "User following system",
        "Real-time notifications"
      ],
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    {
      id: 5,
      icon: Notebook,
      title: "My Stories",
      description: "Personal dashboard for managing published and draft content with analytics.",
      details: [
        "Content management dashboard",
        "Post analytics and insights",
        "Edit, delete, and share controls",
        "Draft autosave feature",
        "Publication scheduling"
      ],
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800"
    },
    {
      id: 6,
      icon: FileText,
      title: "Smart Notepad",
      description: "Quick-capture writing tool with formatting options, accessible from any page.",
      details: [
        "Floating quick-access icon",
        "Rich text formatting",
        "Text snippets and templates",
        "Cross-platform sync",
        "Quick export options"
      ],
      color: "from-gray-600 to-gray-800",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      borderColor: "border-gray-200 dark:border-gray-800"
    },
    {
      id: 7,
      icon: Search,
      title: "SEO Score Analyzer",
      description: "Analyze content SEO-friendliness with keyword density, readability, and optimization suggestions.",
      details: [
        "Keyword density analysis",
        "Readability scoring",
        "Meta tag optimization",
        "Competitor analysis",
        "SEO improvement suggestions"
      ],
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200 dark:border-teal-800"
    },
    {
      id: 8,
      icon: FileUp,
      title: "PDF Summarizer & Extractor",
      description: "Upload PDFs to get AI-generated summaries and extract text from scanned documents.",
      details: [
        "AI-powered PDF summarization",
        "Text extraction from scanned PDFs",
        "Multiple summary lengths",
        "Key point highlighting",
        "Batch processing support"
      ],
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800"
    },
    {
      id: 9,
      icon: Hash,
      title: "AI Hashtag Generator",
      description: "Generate platform-specific hashtags tailored to your content and target audience.",
      details: [
        "Platform-specific hashtags",
        "Trending hashtag suggestions",
        "Audience targeting",
        "Hashtag performance analytics",
        "Batch generation"
      ],
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800"
    },
    {
      id: 10,
      icon: MessageSquare,
      title: "AI Text Summarizer",
      description: "Condense long-form content into concise summaries while preserving key information.",
      details: [
        "Multiple summary lengths",
        "Key point extraction",
        "Bullet point generation",
        "Customizable detail level",
        "Multi-language support"
      ],
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      borderColor: "border-cyan-200 dark:border-cyan-800"
    },
    {
      id: 11,
      icon: Mail,
      title: "AI Email Writer",
      description: "Draft professional emails with tone selection, purpose targeting, and recipient customization.",
      details: [
        "Tone and style selection",
        "Purpose-based templates",
        "Recipient profiling",
        "Professional formatting",
        "Quick send integration"
      ],
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800"
    }
  ];

  const socialFeatures = [
    {
      icon: Eye,
      title: "Content Visibility",
      description: "Share your writing with a growing community of readers and writers"
    },
    {
      icon: Heart,
      title: "Engagement Metrics",
      description: "Track likes, comments, and shares to understand audience reception"
    },
    {
      icon: MessageCircle,
      title: "Community Interaction",
      description: "Build relationships through comments and direct feedback"
    },
    {
      icon: Share,
      title: "Content Distribution",
      description: "Easily share your posts across multiple platforms"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Header Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-900/50">
            <Zap className="w-4 h-4" />
            Powerful Writing Suite
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            All Features
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Discover our comprehensive suite of AI-powered writing tools designed to 
            <span className="font-semibold text-indigo-600 dark:text-indigo-400"> enhance your creativity </span>
            and streamline your workflow
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>11 AI Tools</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 text-green-500" />
              <span>10K+ Users</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>Real-time Processing</span>
            </div>
          </div>

          <Link 
            href="/tools" 
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>

      {/* Social Engagement Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Social Writing Community
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Beyond content creation - engage with a vibrant community of writers, 
              share your work, and get real-time feedback on our social feed platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {socialFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/feed" 
              className="group inline-flex items-center gap-3 border-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-gray-900 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              <span>Visit Feed Page</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={feature.id}
                  className={`${feature.bgColor} ${feature.borderColor} rounded-3xl p-8 border-2 hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer`}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature Details */}
                  <ul className="space-y-3">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Writing?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are already using our AI tools to create better content faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools" 
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Creating Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="/learn" 
              className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Learn More</span>
              <BookOpen className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;