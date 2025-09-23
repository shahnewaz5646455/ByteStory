"use client";

import { motion } from "framer-motion";
import { Users, Target, Heart, Zap, ArrowRight } from "lucide-react";

export default function AboutTeamSection() {
  return (
    <section className="py-10 px-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
             
              
              <h2 className="text-4xl py-2 md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 dark:from-white dark:to-indigo-400 bg-clip-text text-transparent">
                The Innovators Behind ByteStory
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                We're a passionate team of five visionaries united by a common goal: 
                to revolutionize content creation through artificial intelligence. 
                Our diverse expertise in machine learning, software engineering, 
                and user experience design comes together to build tools that 
                empower creativity worldwide.
              </p>
            </div>

            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/30"
            >
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                    Our Mission
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    To democratize high-quality content creation by making advanced AI 
                    tools accessible, intuitive, and powerful for everyone—from students 
                    and entrepreneurs to established enterprises.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Innovation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pushing boundaries daily</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Collaboration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stronger together</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Passion</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Love what we do</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">Excellence</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quality in everything</p>
                </div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-4"
            >
              <button className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                Meet the Team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Decorative background elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
            
            {/* Main Image Container */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-2xl border border-gray-100 dark:border-gray-700">
              <img
                src="/team.png" // Replace with your generated image path
                alt="ByteStory AI Team - 5 innovative professionals"
                className="w-full h-auto rounded-2xl object-cover"
              />
              
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-medium">Since 2025</span>
              </div>
              
              {/* Stats overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">50+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600 dark:text-purple-400">5</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Experts</div>
                  </div>
                  <div>
                    <div className="font-bold text-pink-600 dark:text-pink-400">100%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Passion</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}