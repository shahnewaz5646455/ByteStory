"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();

      // Handle error from API
      if (data.error) {
        setSummary(`⚠️ Could not generate summary. ${data.error}`);
      } else if (Array.isArray(data) && data[0]?.summary_text) {
        setSummary(data[0].summary_text);
      } else {
        setSummary("⚠️ Could not generate summary.");
      }
    } catch (error) {
      setSummary("⚠️ Could not generate summary.");
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Free AI Summarizer</h1>

      <textarea
        className="w-full border p-2 rounded mb-3"
        rows="5"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to summarize..."
        disabled={loading}
      />

      <button
        onClick={handleSummarize}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        disabled={loading || !input.trim()}
      >
        {loading && (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-blue-400 rounded-full animate-spin"></span>
        )}
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold">AI Summary:</h2>
          <p className="text-black">{summary}</p>
        </div>
      )}
    </main>
  );
}