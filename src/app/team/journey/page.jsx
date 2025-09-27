"use client";
import { Calendar, Flag, Rocket, Users, Award, Sparkles, ArrowRight, Lightbulb } from "lucide-react";

export default function JourneyPage() {
  const milestones = [
    {
      year: "2023",
      icon: <Flag className="w-6 h-6" />,
      title: "The Idea Was Born",
      description: "It all started with a simple idea: to build AI-powered tools that make content creation easier, faster, and smarter. Our small team came together with big dreams.",
      color: "from-blue-500 to-cyan-500",
      achievements: ["Concept Development", "Market Research", "Team Assembly"]
    },
    {
      year: "2024",
      icon: <Users className="w-6 h-6" />,
      title: "Forming the Team",
      description: "We officially formed a team of 5 passionate members. Each person brought unique skills—Frontend, Backend, Design, and Vision—to turn our idea into reality.",
      color: "from-purple-500 to-pink-500",
      achievements: ["Team Formation", "Skill Mapping", "Project Planning"]
    },
    {
      year: "Early 2025",
      icon: <Rocket className="w-6 h-6" />,
      title: "Building the Platform",
      description: "We started designing and coding the platform. From authentication to SEO tools, from dashboards to landing pages—we built the foundation of our product.",
      color: "from-orange-500 to-red-500",
      achievements: ["UI/UX Design", "Backend Development", "Frontend Implementation"]
    },
    {
      year: "Mid 2025",
      icon: <Calendar className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Our workflow became stronger. With daily scrums, design improvements, and brainstorming sessions, the project started shaping into a complete product.",
      color: "from-green-500 to-emerald-500",
      achievements: ["Agile Development", "Quality Assurance", "User Testing"]
    },
    {
      year: "Future",
      icon: <Award className="w-6 h-6" />,
      title: "What's Next?",
      description: "We aim to launch our platform publicly, gather user feedback, and continuously improve. Our journey is just beginning, and the best is yet to come.",
      color: "from-indigo-500 to-purple-500",
      achievements: ["Public Launch", "User Growth", "Feature Expansion"]
    },
  ];

  const stats = [
    { number: "5", label: "Team Members", icon: Users },
    { number: "1", label: "Years of Journey", icon: Calendar },
    { number: "7+", label: "AI Tools Built", icon: Rocket },
    { number: "50K+", label: "Future Users", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Our Story
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Our Journey
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every great product has a story. Here's how our team of passionate individuals 
            came together, built a vision, and transformed an idea into reality. 
            This is our journey—step by step, milestone by milestone.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full hidden md:block"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex items-start mb-16 last:mb-0">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-800 z-10 hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Content Card */}
                <div className="ml-0 md:ml-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 flex-1">
                  {/* Year Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${milestone.color} text-white rounded-full text-sm font-medium mb-4`}>
                    {milestone.icon}
                    <span>{milestone.year}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {milestone.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {milestone.description}
                  </p>
                  
                  {/* Achievements */}
                  <div className="flex flex-wrap gap-2">
                    {milestone.achievements.map((achievement, achievementIndex) => (
                      <span
                        key={achievementIndex}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4" />
            The Road Ahead
          </div>
          
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            And The Story Continues...
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
            Our journey is not just about technology—it's about passion, teamwork, 
            and the belief that we can make a difference. We're excited to continue 
            growing, innovating, and achieving new milestones together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Join Our Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="inline-flex items-center justify-center px-8 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-700 transition-all duration-300">
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

      {/* Inspirational Quote */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-indigo-200/50 dark:border-indigo-800/50">
            <blockquote className="text-2xl italic text-gray-700 dark:text-gray-300 leading-relaxed">
              "The journey of a thousand miles begins with a single step. 
              Our step was an idea, our journey is the future of AI-powered creativity."
            </blockquote>
            <div className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium">
              — The ByteStory Team
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}