"use client";

import { useTextToSpeech } from "@/app/hooks/useTextToSpeech";
import { useState } from "react";
// import { useTextToSpeech } from "@/app/hooks/useTextToSpeech";

export default function Reader({ text }) {
  const { speak, pause, resume, stop, status, voiceOptions } = useTextToSpeech();
  const [voiceName, setVoiceName] = useState("");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-4">
      {/* <div className="flex items-center gap-2">
        <label className="text-sm">Voice:</label>
        <select
          className="border rounded px-2 py-1"
          value={voiceName}
          onChange={e => setVoiceName(e.target.value)}
        >
          <option value="">Auto</option>
          {voiceOptions.map(v => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang}) {v.default ? "• default" : ""}
            </option>
          ))}
        </select>
      </div> */}

      <div className="flex gap-2">
        <button
          className="rounded text-black px-3 py-2"
          onClick={() => speak(text, { voiceName, rate: 1, pitch: 1 })}
        >
          ▶️ Play
        </button>
        <button className="rounded border px-3 py-2" onClick={pause} disabled={status !== "speaking"}>
          ⏸ Pause
        </button>
        <button className="rounded border px-3 py-2" onClick={resume} disabled={status !== "paused"}>
          ⏯ Resume
        </button>
        <button className="rounded border px-3 py-2" onClick={stop}>
          ⏹ Stop
        </button>
      </div>

      <div className="text-sm text-gray-600">Status: {status}</div>
    </div>
  );
}
