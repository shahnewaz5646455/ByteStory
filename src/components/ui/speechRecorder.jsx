"use client";

import { useSpeechToText } from "@/app/hooks/useSpeechToText";
import { useState } from "react";

export default function SpeechRecorder() {
  const [lang, setLang] = useState("en-US");
  const [copyStatus, setCopyStatus] = useState(""); // success | error | ""
  const { supported, listening, transcript, interim, start, stop, reset } =
    useSpeechToText({ lang });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopyStatus("success");
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyStatus("error");
    } finally {
      setTimeout(() => setCopyStatus(""), 2000); // auto-clear
    }
  };

  return (
    <div className="max-w-xl space-y-3 p-4 border rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-600">
      {/* Language Selector */}
      <div className="flex flex-row flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Language
        </label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white w-auto"
        >
          <option value="en-US">English (US)</option>
          {/* add more as needed */}
        </select>
      </div>

      {!supported ? (
        <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          This browser doesn't support the Web Speech API. Try Chrome/Edge, or
          add an offline/hosted fallback.
        </p>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-row flex-wrap gap-2">
            {!listening ? (
              <button
                onClick={start}
                className="px-4 py-3 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 w-auto"
              >
                🎙️ Start Recording
              </button>
            ) : (
              <button
                onClick={stop}
                className="px-4 py-3 sm:py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 w-auto"
              >
                ⏹ Stop Recording
              </button>
            )}
            <button
              onClick={reset}
              className="px-4 py-3 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 w-auto"
            >
              Reset
            </button>
          </div>

          {/* Live Transcript */}
          <div className="text-sm">
            <div className="mb-2 text-gray-600 dark:text-gray-400 font-medium">
              Live Transcript:
            </div>
            <div className="min-h-[3rem] p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50">
              <span className="opacity-70 dark:opacity-80">
                {interim ||
                  (listening
                    ? "Listening..."
                    : "Speak to see live transcript here")}
              </span>
            </div>
          </div>

          {/* Final Transcript */}
          <div className="text-sm">
            <div className="flex flex-row flex-wrap justify-between items-center gap-2 mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Final Transcript:
              </span>
              <button
                onClick={handleCopy}
                disabled={!transcript}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-auto"
              >
                Copy to Clipboard
              </button>
            </div>

            {/* Copy Status Messages */}
            {copyStatus === "success" && (
              <p className="text-green-600 dark:text-green-400 text-sm mb-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                ✅ Copied to clipboard successfully!
              </p>
            )}
            {copyStatus === "error" && (
              <p className="text-red-600 dark:text-red-400 text-sm mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                ❌ Failed to copy to clipboard
              </p>
            )}

            <textarea
              className="w-full h-32 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20"
              value={transcript}
              readOnly
              placeholder="Your transcribed text will appear here..."
            />
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 p-2">
            <div
              className={`w-3 h-3 rounded-full ${
                listening ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {listening ? "Recording in progress..." : "Ready to record"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
