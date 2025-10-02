"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Feather, Lightbulb, Rocket, Users, CheckCircle2, ArrowRight } from "lucide-react";
import TeamOrbitCarousel from "../../../../components/OrbitCarousel";
import AboutTeamSection from "../../../../components/AboutTeamSection";
import { StickyScrollRevealDemo } from "../../../../components/StickyScrollRevealDemo";

const features = [
  {
    icon: <Lightbulb className="h-6 w-6" aria-hidden="true" />,
    title: "Idea Collector",
    desc: "Save keywords and prompts. Turn them into drafts when AI is ready.",
  },
  {
    icon: <Feather className="h-6 w-6" aria-hidden="true" />,
    title: "Clean Writing Workspace",
    desc: "A distraction-free editor with autosave and version history (coming soon).",
  },
  {
    icon: <Users className="h-6 w-6" aria-hidden="true" />,
    title: "Community Insights",
    desc: "Discover trending topics from what people are exploring.",
  },
];

const roadmap = [
  { badge: "Now", items: ["Landing, Auth", "About & Features", "Idea Collector"] },
  { badge: "Next", items: ["Draft Editor", "Public Feed", "Profile Pages"] },
  { badge: "Soon", items: ["AI Article Generation", "SEO Tools", "Smart Summaries"] },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_top,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(40rem_20rem_at_top,rgba(139,92,246,0.15),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              About ByteStory
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Blogging, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Made Effortless</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're building a friendly space where ideas become posts. Start with simple keywords today; soon, generate and publish full articles with AI.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 text-gray-800 dark:text-gray-200 font-semibold hover:border-indigo-200 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                See features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Lower the barrier to blogging. Whether you're a student, creator, or a busy professional, we want you to go from idea to post without friction.
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Fast onboarding with email login</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Keep your ideas safe with autosave</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Grow with the community via trending topics</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-gray-700 p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  <Feather className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Vision</p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">From keywords to content</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Start simple: capture your ideas now. As we roll out AI generation, those ideas become polished drafts you can publish.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What You Can Do Today</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Even before AI launches, you can organize ideas and explore what the community cares about.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center mb-4">
                <div className="text-indigo-600 dark:text-indigo-400">
                  {f.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
              <Rocket className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Roadmap</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {roadmap.map((stage) => (
              <div key={stage.badge} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl border border-indigo-100 dark:border-gray-700 p-5">
                <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
                  {stage.badge}
                </span>
                <ul className="space-y-3">
                  {stage.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-center  border border-indigo-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all duration-300 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Be an Early Builder</h3>
          <p className="max-w-2xl mx-auto mb-6">
            Help us shape the future of AI-powered blogging. Create an account, save your ideas, and get notified when generation goes live.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-2 md:px-6 md:py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-150 transform cursor-pointer flex items-center justify-center w-max"
            >
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/features"
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-indigo-100 dark:border-gray-700 font-semibold px-6 py-3 md:px-6 md:py-3 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-300 flex items-center justify-center cursor-pointer w-max"
            >
              Explore features
            </Link>
          </div>
        </div>
      </section>
         <AboutTeamSection />
          <TeamOrbitCarousel/>
          <StickyScrollRevealDemo />
    </div>
  );
}