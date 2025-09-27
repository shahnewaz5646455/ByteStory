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
    <div className="max-w-xl space-y-3 p-4 border rounded-xl">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Language</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="en-US">English (US)</option>
          {/* add more as needed */}
        </select>
      </div>

      {!supported ? (
        <p className="text-sm text-red-600">
          This browser doesn’t support the Web Speech API. Try Chrome/Edge, or add
          an offline/hosted fallback.
        </p>
      ) : (
        <div className="flex gap-2">
          {!listening ? (
            <button
              onClick={start}
              className="px-3 py-2 rounded bg-black text-white"
            >
              🎙️ Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-3 py-2 rounded bg-gray-800 text-white"
            >
              ⏹ Stop
            </button>
          )}
          <button onClick={reset} className="px-3 py-2 rounded border">
            Reset
          </button>
        </div>
      )}

      <div className="text-sm">
        <div className="mb-1 text-gray-500">Live:</div>
        <div className="min-h-[2.5rem] p-2 rounded border bg-white">
          <span className="opacity-70">{interim}</span>
        </div>
      </div>

      <div className="text-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-500">Final transcript:</span>
          <button
            onClick={handleCopy}
            disabled={!transcript}
            className="bg-black text-white px-2 py-1 rounded-sm text-xs hover:bg-gray-700 disabled:opacity-50"
          >
            Copy
          </button>
        </div>

        {copyStatus === "success" && (
          <p className="text-green-600 text-xs mb-1">Copied to clipboard ✅</p>
        )}
        {copyStatus === "error" && (
          <p className="text-red-600 text-xs mb-1">Failed to copy ❌</p>
        )}

        <textarea
          className="w-full h-32 p-2 rounded border"
          value={transcript}
          readOnly
        />
      </div>
    </div>
  );
}
