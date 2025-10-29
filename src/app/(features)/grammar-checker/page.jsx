"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, Copy, Edit3, Sparkles, BookOpen, ArrowRight, X, ChevronRight, Star, Zap, Shield, Languages, Moon, Sun, Monitor, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AuroraText } from '@/components/ui/aurora-text';
import { TextAnimate } from '@/components/ui/text-animate';

const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const textAreaRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const checkGrammar = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to check grammar');
      }
    } catch (err) {
      setError('An error occurred while checking grammar');
      console.error('Grammar check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Clear results when text changes
    if (results) setResults(null);
    if (error) setError(null);
  };

  const copyToClipboard = async () => {
    if (results?.correctedText) {
      await navigator.clipboard.writeText(results.correctedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const applyCorrection = () => {
    if (results?.correctedText) {
      setText(results.correctedText);
      setResults(null);
    }
  };

  const focusTextArea = () => {
    textAreaRef.current?.focus();
  };

  // Features data
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Lightning Fast",
      description: "Get instant grammar suggestions in real-time"
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Advanced AI",
      description: "Powered by cutting-edge natural language processing"
    },
    {
      icon: <Languages className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Multi-Lingual",
      description: "Supports multiple languages and dialects"
    }
  ];

  // Stats data
  const stats = [
    { value: "99%", label: "Accuracy" },
    { value: "50k+", label: "Users" },
    { value: "1M+", label: "Checks" },
    { value: "0.5s", label: "Avg. Response" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
<div className="text-center mb-8">
  <div className="flex items-center justify-center gap-3 mb-4 cursor-default">
    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full cursor-default">
      <Sparkles className="h-8 w-8 text-white cursor-default" />
    </div>
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white cursor-default">
      Grammar Checker
    </h1>
  </div>
  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto cursor-default">
    Enhance your writing with our advanced AI-powered grammar checker
  </p>
</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-indigo-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-indigo-800 dark:text-white">Your Text</h2>
              <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900 rounded-full px-3 py-1">
                <BookOpen size={18} className="text-indigo-600 dark:text-indigo-300" />
                <span className="text-sm text-indigo-600 dark:text-indigo-300">{text.length} characters</span>
              </div>
            </div>
            
            <div className="relative mb-6">
              <textarea
                ref={textAreaRef}
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here to check for grammar mistakes..."
                className="w-full h-72 p-5 border border-indigo-200 dark:border-gray-600 rounded-xl focus:ring-3 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              
              {text.length > 0 && (
                <button
                  onClick={() => setText('')}
                  className="absolute top-3 right-3 p-1.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-700 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="mt-8">
              <button
                onClick={checkGrammar}
                disabled={isLoading || !text.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-indigo-200 dark:hover:shadow-purple-900/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="mr-2" />
                    Check Grammar
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl flex items-start border border-red-200 dark:border-red-800"
              >
                <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-indigo-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-indigo-800 dark:text-white">Analysis Results</h2>
              {results && (
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 rounded-full px-3 py-1">
                  <CheckCircle size={18} className="text-green-500 dark:text-green-400" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {results.issues?.length === 0 ? 'Perfect!' : `${results.issues?.length} issues found`}
                  </span>
                </div>
              )}
            </div>
            
            <div className="min-h-72">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-72"
                  >
                    <div className="text-center">
                      <div className="relative">
                        <Loader2 size={40} className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 rounded-full opacity-0 animate-ping"></div>
                      </div>
                      <p className="text-indigo-700 dark:text-indigo-300 font-medium">Analyzing your text...</p>
                      <p className="text-indigo-500 dark:text-indigo-400 text-sm mt-1">Checking for grammar, spelling, and punctuation</p>
                    </div>
                  </motion.div>
                ) : results ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {results.issues?.length > 0 ? (
                      <>
                        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center">
                            <AlertCircle size={18} className="mr-2" />
                            Suggested Corrections
                          </h3>
                          <ul className="space-y-3">
                            {results.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-amber-700 dark:text-amber-300 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <span className="font-medium">"{issue.context}":</span> {issue.message}
                                {issue.suggestion && (
                                  <span className="ml-1 block mt-1">
                                    → Suggestion: <span className="font-medium text-green-700 dark:text-green-400">"{issue.suggestion}"</span>
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="font-semibold text-indigo-800 dark:text-white mb-3">Corrected Text</h3>
                          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <p className="text-indigo-900 dark:text-indigo-100 whitespace-pre-wrap leading-relaxed">{results.correctedText}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button
                            onClick={copyToClipboard}
                            className="flex items-center px-5 py-2.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors font-medium"
                          >
                            <Copy size={16} className="mr-2" />
                            {isCopied ? 'Copied!' : 'Copy Text'}
                          </button>
                          
                          <button
                            onClick={applyCorrection}
                            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium shadow-md"
                          >
                            <Edit3 size={16} className="mr-2" />
                            Apply Correction
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">Perfect Writing!</h3>
                        <p className="text-green-600 dark:text-green-300">No grammar issues found. Your text looks great!</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-72 text-center p-6 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20"
                  >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 p-3 rounded-full mb-4">
                      <Sparkles size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-indigo-800 dark:text-indigo-200 mb-2">Awaiting Your Text</h3>
                    <p className="text-indigo-600 dark:text-indigo-300">Your grammar check results will appear here</p>
                    <p className="text-sm text-indigo-500 dark:text-indigo-400 mt-2">Check for spelling, punctuation, and grammar mistakes</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Tips Section */}
        <section className="mx-auto max-w-6xl px-6 py-10">
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1 }}
    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-md"
  >
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
        <Edit3 className="h-5 w-5" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pro Writing Tips</h2>
    </div>
    
    <div className="grid gap-6 md:grid-cols-3">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl border border-indigo-100 dark:border-gray-700 p-5">
        <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
          Tip 1
        </span>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-semibold">Be Specific</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
            Use precise language to convey your message clearly and avoid ambiguity.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl border border-indigo-100 dark:border-gray-700 p-5">
        <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
          Tip 2
        </span>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-semibold">Vary Sentence Length</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
            Mix short and long sentences to create rhythm and maintain reader engagement.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl border border-indigo-100 dark:border-gray-700 p-5">
        <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">
          Tip 3
        </span>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
            <div className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-semibold">Proofread</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
            Always review your writing multiple times to catch errors and improve clarity.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
</section>
      </div>
    </div>
  );
};

export default GrammarChecker;