"use client";

import { useTextToSpeech } from "@/app/hooks/useTextToSpeech";
import { useState } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Reader({ text }) {
  const { speak, pause, resume, stop, status, voiceOptions } = useTextToSpeech();
  const [voiceName, setVoiceName] = useState("");

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 border border-indigo-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Text-to-Speech</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === "speaking" 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
            : status === "paused" 
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <motion.button
          className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex-1"
          onClick={() => speak(text, { voiceName, rate: 1, pitch: 1 })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={status === "speaking"}
        >
          <Play size={16} />
          <span>Play</span>
        </motion.button>
        
        <motion.button 
          className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          onClick={pause} 
          disabled={status !== "speaking"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Pause"
        >
          <Pause size={16} />
        </motion.button>
        
        <motion.button 
          className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          onClick={resume} 
          disabled={status !== "paused"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Resume"
        >
          <Play size={16} />
        </motion.button>
        
        <motion.button 
          className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          onClick={stop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Stop"
        >
          <Square size={16} />
        </motion.button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600 dark:text-gray-400">Voice:</label>
        <select
          className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={voiceName}
          onChange={e => setVoiceName(e.target.value)}
        >
          <option value="">Default</option>
          {voiceOptions.map(v => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang}) {v.default ? "• default" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}