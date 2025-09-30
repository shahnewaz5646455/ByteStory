"use client";
import { Shield, Lock, Eye, Mail, Database, Users, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, etc.) provided during registration",
        "Usage data and analytics to improve our services",
        "Cookies and similar tracking technologies"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our services",
        "To notify you about changes to our services",
        "To provide customer support",
        "To gather analysis valuable for improving our services"
      ]
    },
    {
      icon: Shield,
      title: "Data Protection",
      content: [
        "We implement security measures to protect your data",
        "Regular security assessments and updates",
        "Encryption of sensitive information",
        "Limited access to personal data"
      ]
    },
    {
      icon: Users,
      title: "Third-Party Sharing",
      content: [
        "We do not sell your personal information",
        "Service providers who assist in our operations",
        "Legal requirements and law enforcement",
        "Business transfers (mergers/acquisitions)"
      ]
    },
    {
      icon: Eye,
      title: "Your Rights",
      content: [
        "Right to access your personal information",
        "Right to correct inaccurate data",
        "Right to delete your personal data",
        "Right to withdraw consent"
      ]
    },
    {
      icon: Mail,
      title: "Contact Us",
      content: [
        "Email: privacy@bytestory.com",
        "Response time: Within 48 hours",
        "Data Protection Officer available"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20">
      {/* Hero Section */}
      <section className="py-16 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Your Privacy Matters
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold pb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
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
              At ByteStory, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
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

      {/* Additional Information */}
      <section className="pb-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cookies Policy</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and for advertising purposes. 
                You can control cookies through your browser settings.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Data Retention</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}