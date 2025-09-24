"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, Book, Sparkles, Zap, Trophy, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameActive, setGameActive] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // Vocabulary words for bloggers/writers
  const vocabularyWords = [
    { word: "PROSE", meaning: "Written or spoken language in its ordinary form", category: "Writing" },
    { word: "SYNTAX", meaning: "The arrangement of words and phrases", category: "Grammar" },
    { word: "METAPHOR", meaning: "A figure of speech comparing two unlike things", category: "Literary" },
    { word: "NARRATIVE", meaning: "A spoken or written account of connected events", category: "Storytelling" },
    { word: "VOICE", meaning: "The individual writing style of an author", category: "Writing" },
    { word: "ANALOGY", meaning: "A comparison between two things for explanation", category: "Literary" },
    { word: "RHETORIC", meaning: "The art of effective speaking or writing", category: "Communication" },
    { word: "EPHEMERAL", meaning: "Lasting for a very short time", category: "Descriptive" },
    { word: "LOQUACIOUS", meaning: "Tending to talk a great deal", category: "Descriptive" },
    { word: "PERSUASIVE", meaning: "Good at persuading someone to do something", category: "Communication" },
    { word: "CONCISE", meaning: "Giving a lot of information clearly in few words", category: "Writing" },
    { word: "COHERENT", meaning: "Logical and consistent", category: "Writing" },
    { word: "ELOQUENT", meaning: "Fluent or persuasive in speaking or writing", category: "Communication" },
    { word: "VOCABULARY", meaning: "The body of words used in a particular language", category: "Language" },
    { word: "GRAMMAR", meaning: "The whole system and structure of a language", category: "Grammar" }
  ];

  const playSound = (type) => {
    if (isMuted) return;
    
    // Simple sound simulation (you can replace with actual sounds)
    if (type === 'correct') {
      // Positive sound
      console.log('🎵 Correct sound!');
    } else if (type === 'wrong') {
      // Negative sound
      console.log('🎵 Wrong sound!');
    }
  };

  const generateQuestion = () => {
    const randomWord = vocabularyWords[Math.floor(Math.random() * vocabularyWords.length)];
    const wrongOptions = vocabularyWords
      .filter(w => w.word !== randomWord.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.meaning);

    const allOptions = [randomWord.meaning, ...wrongOptions]
      .sort(() => 0.5 - Math.random());

    setCurrentWord(randomWord);
    setOptions(allOptions);
    setSelectedOption(null);
    setFeedback('');
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setGameActive(true);
    generateQuestion();
  };

  const checkAnswer = (option) => {
    if (selectedOption || !gameActive) return;

    setSelectedOption(option);
    const isCorrect = option === currentWord.meaning;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback('correct');
      playSound('correct');
    } else {
      setFeedback('wrong');
      playSound('wrong');
    }

    setTimeout(() => {
      generateQuestion();
      setFeedback('');
    }, 1500);
  };

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(time => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* Animated 404 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-9xl font-bold mb-4 relative"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </span>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-4 -right-4"
              >
                <Book className="w-12 h-12 text-blue-500" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
            >
              Page Not Found
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              While we search for your missing page, expand your vocabulary with our writer's word challenge!
            </motion.p>
          </motion.div>

          {/* Game Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 mb-8"
          >
            {!gameActive ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  className="mb-6"
                >
                  <div className="relative inline-block mb-4">
                    <Book className="w-20 h-20 text-blue-500 mx-auto" />
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Writer's Vocabulary Challenge
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Match words with their meanings. Perfect for bloggers and writers!
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mx-auto mb-4"
                >
                  <Zap className="w-5 h-5" />
                  Start Learning Words
                </motion.button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="font-bold text-blue-600 dark:text-blue-400">45s</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Time</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="font-bold text-purple-600 dark:text-purple-400">15</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="font-bold text-green-600 dark:text-green-400">10pt</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Per Word</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                    <div className="font-bold text-orange-600 dark:text-orange-400">Blog</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Themed</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Game Info */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-left">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Score: {score}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                      <Zap className="w-5 h-5 text-orange-500" />
                      Time: {timeLeft}s
                    </div>
                  </div>
                </div>

                {/* Current Word */}
                {currentWord && (
                  <motion.div
                    key={currentWord.word}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6 shadow-lg">
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full mb-2 inline-block">
                        {currentWord.category}
                      </span>
                      <h3 className="text-3xl font-bold mb-2">{currentWord.word}</h3>
                      <p className="text-blue-100">What does this word mean?</p>
                    </div>
                  </motion.div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => checkAnswer(option)}
                      disabled={selectedOption}
                      className={`p-4 rounded-xl text-left transition-all duration-200 font-medium ${
                        selectedOption === option
                          ? option === currentWord?.meaning
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-red-500 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:shadow-md border border-gray-200 dark:border-gray-600'
                      } ${selectedOption ? 'cursor-default' : 'cursor-pointer hover:scale-102'}`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`p-3 rounded-xl mb-4 font-semibold ${
                        feedback === 'correct' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {feedback === 'correct' ? '✓ Correct! Well done!' : '✗ Incorrect. Try again!'}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Over Message */}
                <AnimatePresence>
                  {timeLeft === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white"
                    >
                      <h4 className="text-xl font-bold mb-2">Game Complete!</h4>
                      <p className="text-lg">You scored {score} points!</p>
                      <div className="mt-2 text-sm">
                        {score >= 100 && "🏆 Vocabulary Master! 🏆"}
                        {score >= 50 && score < 100 && "🌟 Great Job! 🌟"}
                        {score < 50 && "📚 Keep learning! 📚"}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </motion.button>
            </Link>
            
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Return Home
              </motion.button>
            </Link>

            {!gameActive && timeLeft === 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Zap className="w-5 h-5" />
                Play Again
              </motion.button>
            )}
          </motion.div>

          {/* Educational Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/30"
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Writing Tip:</strong> Expanding your vocabulary helps create more engaging and precise content for your readers!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}