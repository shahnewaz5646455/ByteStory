"use client";

import { summarizeText } from "@/lib/ai";
import { useState } from "react";


export default function Home() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    const result = await summarizeText(input);
    setSummary(result);
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
      />

      <button
        onClick={handleSummarize}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Summarize
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
