'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Brain, 
  Zap, 
  Clock, 
  CheckCircle, 
  Type,
  FileText,
  BookOpen,
  PenTool,
  ChevronDown,
  BarChart3
} from 'lucide-react';

export default function AIWriterPage() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blog');
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    { id: 'blog', name: 'Blog Post', icon: <FileText size={18} /> },
    { id: 'creative', name: 'Creative Story', icon: <PenTool size={18} /> },
    { id: 'academic', name: 'Academic Paper', icon: <BookOpen size={18} /> },
    { id: 'marketing', name: 'Marketing Copy', icon: <Type size={18} /> },
  ];

  const features = [
    {
      title: 'AI-Powered Content',
      description: 'Advanced language models for high-quality content generation',
      icon: <Brain className="text-indigo-600 dark:text-indigo-400" size={24} />
    },
    {
      title: 'Lightning Fast',
      description: 'Generate content in seconds, not hours',
      icon: <Zap className="text-indigo-600 dark:text-indigo-400" size={24} />
    },
    {
      title: 'SEO Optimized',
      description: 'Content optimized for search engines',
      icon: <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={24} />
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setOutput(`Here's your generated content based on: "${input}"\n\nThis is a beautifully crafted piece of content created by our advanced AI writing assistant. It incorporates your requested topic while maintaining coherence, proper structure, and engaging language. The output is ready to use with minimal edits needed.`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200">
     

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex mb-4 md:mb-6 justify-center w-full">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md hover:shadow-lg dark:hover:shadow-purple-600/20 transition-shadow duration-300 flex items-center">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              AI Writing Assistant
            </span>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Transform Your Ideas Into
            <span className="block bg-clip-text pb-2 text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Masterful Writing
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Our AI writing assistant helps you create compelling content, 
            from blog posts to professional documents, in seconds.
          </motion.p>
        </section>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-indigo-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-indigo-900/30 transition-all duration-300"
            >
              <div className="w-12 h-12  bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Writer Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border border-indigo-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-indigo-900/30 transition-all duration-300 mb-16"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Input Section */}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">What would you like to write about?</h3>
                
                {/* Template Selector */}
                <div className="relative mb-4">
                  <button 
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-gray-700 rounded-lg w-full justify-between border border-indigo-100 dark:border-gray-600"
                  >
                    <div className="flex items-center">
                      {templates.find(t => t.id === selectedTemplate)?.icon}
                      <span className="ml-2">
                        {templates.find(t => t.id === selectedTemplate)?.name}
                      </span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showTemplates && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg overflow-hidden z-10 border border-indigo-100 dark:border-gray-700 shadow-lg"
                      >
                        {templates.map(template => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              setShowTemplates(false);
                            }}
                            className={`flex items-center w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors ${selectedTemplate === template.id ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : ''}`}
                          >
                            {template.icon}
                            <span className="ml-2">{template.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe what you want to write about..."
                    className="w-full h-40 bg-white dark:bg-gray-700 border border-indigo-100 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  
                  <div className="absolute bottom-3 right-3 flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isGenerating || !input.trim()}
                      className={`p-2 rounded-full ${isGenerating || !input.trim() ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}
                    >
                      {isGenerating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock size={20} className="text-white" />
                        </motion.div>
                      ) : (
                        <Send size={20} className="text-white" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Output Section */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">Your Generated Content</h3>
              
              <div className="bg-white dark:bg-gray-700 border border-indigo-100 dark:border-gray-600 rounded-xl p-4 h-40 overflow-y-auto">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      initial={{ opacity: 0.5, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1
                      }}
                      className="flex flex-col items-center"
                    >
                      <Sparkles className="text-indigo-500 mb-2" size={24} />
                      <p>Generating your content...</p>
                    </motion.div>
                  </div>
                ) : output ? (
                  <div>
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{output}</p>
                    <div className="flex justify-end mt-4">
                      <button className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                        <CheckCircle size={16} className="mr-1" />
                        Copy Content
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Type size={32} className="mb-2" />
                    <p>Your generated content will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-6">Ready to elevate your writing?</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg shadow-md hover:shadow-lg dark:hover:shadow-purple-600/20 transition-shadow duration-300"
          >
            Start Writing Now
          </motion.button>
        </motion.section>
      </main>
    </div>
  );
}