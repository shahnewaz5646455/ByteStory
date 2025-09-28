"use client";
import { FileText, Scale, AlertTriangle, UserCheck, Copyright, Globe, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: UserCheck,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using ByteStory, you accept and agree to be bound by these Terms",
        "You must be at least 13 years old to use our services",
        "We reserve the right to modify these terms at any time"
      ]
    },
    {
      icon: Scale,
      title: "User Responsibilities",
      content: [
        "Provide accurate and complete registration information",
        "Maintain the security of your account credentials",
        "Use services in compliance with all applicable laws",
        "Do not engage in unauthorized access or use"
      ]
    },
    {
      icon: Copyright,
      title: "Intellectual Property",
      content: [
        "All content and trademarks are property of ByteStory",
        "Users retain ownership of their uploaded content",
        "Grant us license to use content for service provision",
        "No copying or distribution without permission"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Illegal or fraudulent activities",
        "Spamming or phishing attempts",
        "Distribution of malware or viruses",
        "Harassment or hate speech",
        "Copyright infringement"
      ]
    },
    {
      icon: Shield,
      title: "Limitation of Liability",
      content: [
        "Services provided 'as is' without warranties",
        "Not liable for indirect or consequential damages",
        "Maximum liability limited to service fees paid",
        "Not responsible for third-party content"
      ]
    },
    {
      icon: Globe,
      title: "Governing Law",
      content: [
        "Governed by laws of Bangladesh",
        "Disputes resolved in Dhaka courts",
        "International users comply with local laws",
        "UN Convention on Contracts excluded"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20">
      {/* Hero Section */}
      <section className="py-16 overflow-hidden">
     
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            Legal Agreement
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Welcome to ByteStory! These Terms of Service govern your use of our website and services. 
              Please read them carefully before using our platform. By accessing or using our services, 
              you agree to be bound by these terms.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h3>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Legal Sections */}
      <section className=" bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Termination</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We may suspend or terminate your account if you violate these terms. 
                You may also terminate your account at any time by contacting us.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Changes to Terms</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We may update these terms periodically. Continued use after changes constitutes acceptance. 
                We'll notify you of significant changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl p-8 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Important Notice</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms of Service constitute a legal agreement between you and ByteStory. 
              If you do not agree with any part of these terms, you must not use our services. 
              We recommend reviewing these terms regularly for updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}