"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, TrendingUp, Target, Zap, BarChart3 } from "lucide-react";

export default function SEOChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInput(text);
    setCharacterCount(text.length);
    if (text.length > 3000) {
      setError("Warning: Content exceeding 3000 characters will be truncated for analysis.");
    } else {
      setError(null);
    }
  };

  const handleCheck = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setError("Request failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getWordCount = () => {
    return input.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 text-gray-900 dark:text-white transition-colors duration-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SEO Score Analyzer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get instant SEO insights and actionable recommendations to improve your content's search engine performance
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-4 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Input Section */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Sparkles className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                Your Content
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {characterCount} characters
              </span>
            </div>

            <textarea
              rows={6}
              className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg outline-0 shadow-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Paste your blog post, article, or any content you want to analyze for SEO..."
              value={input}
              onChange={handleInputChange}
            />

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Minimum 50 characters recommended
              </span>
              <button
                onClick={handleCheck}
                disabled={!input.trim() || isLoading || input.length < 50}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze SEO
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {isLoading && (
            <div className="p-6 text-center">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Processing SEO analysis...</p>
            </div>
          )}
          {result && !isLoading && (
            <div className="p-6">
              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">SEO SCORE</h3>
                  <div className="text-4xl font-bold mb-2">
                    <span className={getScoreColor(result.score)}>
                      {result.score}
                    </span>
                    <span className="text-2xl text-gray-500">/100</span>
                  </div>
                  <p className={`text-sm font-medium ${getScoreColor(result.score)}`}>
                    {getScoreLabel(result.score)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {result.overview || "No overview available."}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score Breakdown</h3>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {result.strengths && result.strengths.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center">
                    <span className="mr-2">✅</span> Content Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, idx) => (
                      <li key={idx} className="text-green-700 dark:text-green-300">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Critical Improvements */}
              {result.improvementAreas?.critical && result.improvementAreas.critical.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4 flex items-center">
                    <span className="mr-2">⚠️</span> Critical Improvements Needed
                  </h3>
                  <ul className="space-y-2">
                    {result.improvementAreas.critical.map((item, idx) => (
                      <li key={idx} className="text-red-700 dark:text-red-300">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Zap className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">Actionable SEO Tips</h3>
                </div>
                <ul className="space-y-3">
                  {(result.actionableTips || []).map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {idx + 1}
                        </span>
                      </div>
                      <span className="text-blue-700 dark:text-blue-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keyword Analysis */}
              {result.keywordAnalysis && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4">Keyword Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Primary Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.keywordAnalysis.primaryKeywords?.length > 0 ? (
                          result.keywordAnalysis.primaryKeywords.map((keyword, idx) => (
                            <span key={idx} className="bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-purple-600 dark:text-purple-300 text-sm">No primary keywords identified</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Opportunities</h4>
                      <ul className="space-y-1">
                        {result.keywordAnalysis.keywordOpportunities?.length > 0 ? (
                          result.keywordAnalysis.keywordOpportunities.slice(0, 3).map((opp, idx) => (
                            <li key={idx} className="text-purple-600 dark:text-purple-300 text-sm">• {opp}</li>
                          ))
                        ) : (
                          <li className="text-purple-600 dark:text-purple-300 text-sm">No keyword opportunities identified</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 text-center">
                  <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{getWordCount()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Words</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 text-center">
                  <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{characterCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Characters</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 text-center">
                  <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.score}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">SEO Score</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4 text-center">
                  <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.actionableTips?.length || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Suggestions</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}