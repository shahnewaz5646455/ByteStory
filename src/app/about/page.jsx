"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Feather, Lightbulb, Rocket, Users, CheckCircle2, ArrowRight } from "lucide-react";

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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_top,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(40rem_20rem_at_top,rgba(67,56,202,0.15),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Blogging, made effortless
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-gray-300">
              We're building a friendly space where ideas become posts. Start with simple keywords today; soon, generate and publish full articles with AI.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-indigo-600 px-4 py-2 text-white shadow hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-slate-800 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
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
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Our mission</h2>
            <p className="mt-3 text-slate-600 dark:text-gray-300">
              Lower the barrier to blogging. Whether you're a student, creator, or a busy professional, we want you to go from idea to post without friction.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-5 w-5 text-slate-900 dark:text-indigo-400" />
                <span>Fast onboarding with email login.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-5 w-5 text-slate-900 dark:text-indigo-400" />
                <span>Keep your ideas safe with autosave.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-5 w-5 text-slate-900 dark:text-indigo-400" />
                <span>Grow with the community via trending topics.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900 dark:bg-indigo-600 p-3 text-white">
                  <Feather className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Vision</p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">From keywords to content</h3>
                </div>
              </div>
              <p className="mt-3 text-slate-600 dark:text-gray-300">
                Start simple: capture your ideas now. As we roll out AI generation, those ideas become polished drafts you can publish.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-white">What you can do today</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-gray-300">
          Even before AI launches, you can organize ideas and explore what the community cares about.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 dark:bg-gray-700 p-2 text-slate-900 dark:text-indigo-400">{f.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              </div>
              <p className="mt-2 text-slate-600 dark:text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-slate-900 dark:text-indigo-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Roadmap</h2>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {roadmap.map((stage) => (
              <div key={stage.badge} className="rounded-xl border border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 p-4">
                <span className="inline-block rounded-full bg-slate-900 dark:bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
                  {stage.badge}
                </span>
                <ul className="mt-3 space-y-2 text-slate-700 dark:text-gray-300">
                  {stage.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-slate-900 dark:text-indigo-400" />
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
        <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-900 dark:bg-gray-800 px-6 py-10 text-white shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold">Be an early builder</h3>
            <p className="mt-2 max-w-2xl text-slate-200 dark:text-gray-300">
              Help us shape the future of AI-powered blogging. Create an account, save your ideas, and get notified when generation goes live.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-indigo-600 px-4 py-2 font-medium text-slate-900 dark:text-white shadow hover:bg-slate-100 dark:hover:bg-indigo-700 transition-colors"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-500 dark:border-gray-600 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:hover:bg-gray-700 transition-colors"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}