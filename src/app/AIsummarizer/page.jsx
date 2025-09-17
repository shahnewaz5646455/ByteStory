"use client";

import { useState } from "react";
import { Sparkles, FileText, Copy, RotateCw } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setSummary("");
    setCopied(false);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (data.success) {
        setSummary(data.summary);
      } else {
        alert(data.error || "Failed to summarize text");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setSummary("");
    setCopied(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI Text <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Summarizer</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform long texts into concise summaries with our powerful AI technology
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Input Section */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                Your Text
              </label>
              {input && (
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all"
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your article, document, or any text you want to summarize..."
            />

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {input.length} characters
              </span>
              <button
                onClick={handleSummarize}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Summarize
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          {summary && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mr-2">
                    AI Summary
                  </span>
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{summary.length} characters</span>
                <span>{summary.split(/\s+/).length} words</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}