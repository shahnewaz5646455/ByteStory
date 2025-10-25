"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What exactly does this AI content platform do?",
    answer: "Our platform provides a suite of AI-powered tools including SEO optimization, blog post generation, hashtag suggestions, content rewriting, and performance analytics. It's designed to streamline your entire content creation workflow from ideation to publication.",
  },
  {
    question: "What type of content can I create with this platform?",
    answer: "You can create blog posts, social media content, product descriptions, email newsletters, SEO-optimized articles, and much more. The platform supports various content formats and tones to match your brand voice.",
  },
  {
    question: "Can I interact with other users' posts?",
    answer: "Yes! You can like, comment, share, and save any public post on the platform. Engage with the community to build connections.",
  },
   {
    question: "What type of content can I create with this platform?",
    answer: "You can create blog posts, social media content, product descriptions, email newsletters, SEO-optimized articles, and much more. The platform supports various content formats and tones to match your brand voice.",
  },
 
  {
    question: "Is my content safe and private?",
    answer: "Your unpublished drafts are private. Published posts are visible based on your privacy settings. We never share your data with third parties.",
  },
  {
    question: "Will there be a premium version?",
    answer: "We're planning to introduce a premium version with advanced features, but the core functionality will always remain free for our community.",
  },
  {
    question: "How do I get support if I need help?",
    answer: "We offer 24/7 email support, comprehensive documentation, video tutorials, and live chat for premium users. Our average response time is under 2 hours for urgent issues.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Questions</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find quick answers to common questions about our platform. Can't find what you're looking for? 
          <Link href="contact" className="text-indigo-600 dark:text-indigo-500 hover:underline ml-1">Contact our support team</Link>.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow duration-200"
          >
            <button
              className="flex items-center w-full text-left p-6 font-medium text-gray-900 dark:text-white"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="flex-1 pr-4">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}