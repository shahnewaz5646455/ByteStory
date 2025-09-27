"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Star,
  Target,
  BookOpen,
} from "lucide-react";

const SkillAssessmentQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Quiz questions with scoring weights
  const quizQuestions = [
    {
      id: 1,
      question: "How often do you write professionally or academically?",
      type: "single",
      options: [
        { id: "a", text: "Daily", score: 4, level: "advanced" },
        { id: "b", text: "Weekly", score: 3, level: "intermediate" },
        { id: "c", text: "Monthly", score: 2, level: "beginner" },
        { id: "d", text: "Rarely", score: 1, level: "beginner" },
      ],
    },
    {
      id: 2,
      question: "What types of writing are you most comfortable with?",
      type: "multiple",
      options: [
        {
          id: "a",
          text: "Academic papers/research",
          score: 3,
          level: "advanced",
        },
        {
          id: "b",
          text: "Business reports/professional",
          score: 3,
          level: "intermediate",
        },
        {
          id: "c",
          text: "Blog posts/articles",
          score: 2,
          level: "intermediate",
        },
        { id: "d", text: "Social media/content", score: 1, level: "beginner" },
        { id: "e", text: "Creative writing", score: 2, level: "intermediate" },
      ],
    },
    {
      id: 3,
      question: "How confident are you with grammar and punctuation?",
      type: "single",
      options: [
        {
          id: "a",
          text: "Very confident - I rarely make mistakes",
          score: 4,
          level: "advanced",
        },
        {
          id: "b",
          text: "Confident - occasional errors",
          score: 3,
          level: "intermediate",
        },
        {
          id: "c",
          text: "Somewhat confident - need occasional help",
          score: 2,
          level: "beginner",
        },
        {
          id: "d",
          text: "Not confident - frequently unsure",
          score: 1,
          level: "beginner",
        },
      ],
    },
    {
      id: 4,
      question: "What's your experience with research and citations?",
      type: "single",
      options: [
        {
          id: "a",
          text: "Expert with multiple citation styles",
          score: 4,
          level: "advanced",
        },
        {
          id: "b",
          text: "Comfortable with common styles (APA/MLA)",
          score: 3,
          level: "intermediate",
        },
        {
          id: "c",
          text: "Basic understanding, need guidance",
          score: 2,
          level: "beginner",
        },
        {
          id: "d",
          text: "Little to no experience",
          score: 1,
          level: "beginner",
        },
      ],
    },
    {
      id: 5,
      question: "How do you handle writer's block or creative challenges?",
      type: "single",
      options: [
        {
          id: "a",
          text: "Have established strategies that work",
          score: 4,
          level: "advanced",
        },
        {
          id: "b",
          text: "Can usually work through it",
          score: 3,
          level: "intermediate",
        },
        {
          id: "c",
          text: "Struggle and need help",
          score: 2,
          level: "beginner",
        },
        { id: "d", text: "Often get stuck", score: 1, level: "beginner" },
      ],
    },
    {
      id: 6,
      question: "What writing tools and software are you familiar with?",
      type: "multiple",
      options: [
        {
          id: "a",
          text: "Advanced: LaTeX, Scrivener, academic tools",
          score: 4,
          level: "advanced",
        },
        {
          id: "b",
          text: "Professional: Word, Google Docs, Grammarly",
          score: 3,
          level: "intermediate",
        },
        {
          id: "c",
          text: "Basic: Simple text editors",
          score: 2,
          level: "beginner",
        },
        {
          id: "d",
          text: "AI writing assistants",
          score: 2,
          level: "intermediate",
        },
      ],
    },
  ];

  // Results configuration
  const resultLevels = {
    beginner: {
      minScore: 0,
      maxScore: 12,
      title: "Writing Foundation Builder",
      description:
        "Perfect starting point for building strong writing fundamentals",
      color: "from-green-500 to-blue-500",
      recommendations: [
        "Basic grammar and punctuation mastery",
        "Sentence structure fundamentals",
        "Paragraph development techniques",
        "Simple essay formatting",
      ],
      icon: BookOpen,
    },
    intermediate: {
      minScore: 13,
      maxScore: 20,
      title: "Skill Refiner",
      description:
        "Enhance your existing skills and develop professional writing abilities",
      color: "from-blue-500 to-purple-500",
      recommendations: [
        "Advanced grammar and style",
        "Research paper formatting",
        "Professional business writing",
        "SEO content optimization",
      ],
      icon: Target,
    },
    advanced: {
      minScore: 21,
      maxScore: 28,
      title: "Writing Expert",
      description: "Master advanced techniques and specialized writing formats",
      color: "from-purple-500 to-pink-500",
      recommendations: [
        "Academic publishing strategies",
        "Complex research methodologies",
        "Specialized technical writing",
        "Advanced editing and proofreading",
      ],
      icon: Award,
    },
  };

  // Start quiz timer
  useEffect(() => {
    if (quizStarted && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [quizStarted, showResults]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeSpent(0);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId, answerId, isMultiple = false) => {
    if (isMultiple) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: prev[questionId]?.includes(answerId)
          ? prev[questionId].filter((id) => id !== answerId)
          : [...(prev[questionId] || []), answerId],
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerId,
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const calculateResults = () => {
    clearInterval(timerRef.current);
    setShowResults(true);
  };

  const getCurrentLevel = () => {
    const totalScore = Object.keys(answers).reduce((score, questionId) => {
      const question = quizQuestions.find((q) => q.id === parseInt(questionId));
      if (!question) return score;

      const answer = answers[questionId];
      if (question.type === "multiple" && Array.isArray(answer)) {
        return (
          score +
          answer.reduce((sum, ansId) => {
            const option = question.options.find((opt) => opt.id === ansId);
            return sum + (option?.score || 0);
          }, 0)
        );
      } else {
        const option = question.options.find((opt) => opt.id === answer);
        return score + (option?.score || 0);
      }
    }, 0);

    return (
      Object.entries(resultLevels).find(
        ([_, level]) =>
          totalScore >= level.minScore && totalScore <= level.maxScore
      )?.[0] || "beginner"
    );
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / quizQuestions.length) * 100;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentLevel = showResults ? getCurrentLevel() : "beginner";
  const levelInfo = resultLevels[currentLevel];
  const LevelIcon = levelInfo?.icon || BookOpen;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Find Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Writing Level
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Take our 2-minute assessment to discover personalized learning
            recommendations
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Quiz Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BarChart3 size={24} />
                <h3 className="text-xl font-semibold">
                  Writing Skill Assessment
                </h3>
              </div>
              {quizStarted && !showResults && (
                <div className="flex items-center space-x-2 text-blue-100">
                  <Clock size={18} />
                  <span className="font-mono">{formatTime(timeSpent)}</span>
                </div>
              )}
            </div>

            {quizStarted && !showResults && (
              <div className="w-full bg-blue-500/30 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${getProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>

          {/* Quiz Content */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!quizStarted ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <Star
                      className="text-blue-600 dark:text-blue-400"
                      size={40}
                    />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Ready to Discover Your Writing Level?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    This quick assessment will help us recommend the perfect
                    tutorials for your skill level and goals.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <li className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock size={16} />
                      <span>2 minutes</span>
                    </li>
                    <li className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle size={16} />
                      <span>6 questions</span>
                    </li>
                    <li className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Award size={16} />
                      <span>Personalized results</span>
                    </li>
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startQuiz}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Assessment
                  </motion.button>
                </motion.div>
              ) : showResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6"
                >
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${levelInfo.color} rounded-full flex items-center justify-center`}
                  >
                    <LevelIcon className="text-white" size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {levelInfo.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {levelInfo.description}
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
                    <h5 className="font-semibold mb-3 text-gray-900 dark:text-white">
                      Recommended Learning Path
                    </h5>
                    <ul className="space-y-2 text-left">
                      {levelInfo.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle
                            size={16}
                            className="text-green-500 flex-shrink-0"
                          />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startQuiz}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Retake Assessment
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const element = document.getElementById("tutorials");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      View Recommended Tutorials
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </div>
                  <h4 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                    {quizQuestions[currentQuestion].question}
                  </h4>

                  <div className="space-y-3 mb-8">
                    {quizQuestions[currentQuestion].options.map((option) => {
                      const isSelected =
                        quizQuestions[currentQuestion].type === "multiple"
                          ? answers[
                              quizQuestions[currentQuestion].id
                            ]?.includes(option.id)
                          : answers[quizQuestions[currentQuestion].id] ===
                            option.id;

                      return (
                        <motion.label
                          key={option.id}
                          whileHover={{
                            scale: 1.04,
                            boxShadow: "0 4px 24px #6366f133",
                          }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
    ${
      isSelected
        ? "border-transparent bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg"
        : "border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-purple-400"
    }`}
                          style={{
                            borderImage: isSelected
                              ? "linear-gradient(90deg, #3b82f6 0%, #a78bfa 100%) 1"
                              : undefined,
                          }}
                        >
                          <input
                            type={
                              quizQuestions[currentQuestion].type === "multiple"
                                ? "checkbox"
                                : "radio"
                            }
                            name={`question-${quizQuestions[currentQuestion].id}`}
                            checked={!!isSelected} // <-- always boolean
                            onChange={() =>
                              handleAnswer(
                                quizQuestions[currentQuestion].id,
                                option.id,
                                quizQuestions[currentQuestion].type ===
                                  "multiple"
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mr-4 flex-shrink-0 transition-all duration-200
    ${
      isSelected
        ? "border-blue-500 bg-gradient-to-br from-blue-500 to-purple-500 shadow"
        : "border-gray-400 bg-white dark:bg-gray-800"
    }`}
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.7 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.7 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <CheckCircle
                                    size={16}
                                    className="text-white"
                                  />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          <span
                            className={`transition-all duration-200 text-base
    ${
      isSelected
        ? "font-semibold text-blue-700 dark:text-purple-300"
        : "text-gray-700 dark:text-gray-300"
    }`}
                          >
                            {option.text}
                          </span>
                        </motion.label>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                        currentQuestion === 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <ArrowLeft size={16} />
                      <span>Previous</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextQuestion}
                      disabled={
                        !answers[quizQuestions[currentQuestion].id] ||
                        (quizQuestions[currentQuestion].type === "multiple" &&
                          answers[quizQuestions[currentQuestion].id]?.length ===
                            0)
                      }
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-300 ${
                        !answers[quizQuestions[currentQuestion].id] ||
                        (quizQuestions[currentQuestion].type === "multiple" &&
                          answers[quizQuestions[currentQuestion].id]?.length ===
                            0)
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl"
                      }`}
                    >
                      <span>
                        {currentQuestion === quizQuestions.length - 1
                          ? "See Results"
                          : "Next"}
                      </span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your assessment results help us recommend the most effective
            learning path for your writing journey
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillAssessmentQuiz;
