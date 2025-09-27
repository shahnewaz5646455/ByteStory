"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function useTextToSpeech() {
  const [voices, setVoices] = useState([]);
  const [status, setStatus] = useState("idle"); // "idle" | "speaking" | "paused"
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const currentUtterances = useRef([]);

  useEffect(() => {
    if (!synthRef.current) return;

    const loadVoices = () => setVoices(synthRef.current.getVoices());
    loadVoices();
    // Some browsers load voices async
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = (text, opts = {}) => {
    if (!synthRef.current) return;
    stop(); // clear any existing

    const voice =
      voices.find(v => v.name === opts.voiceName) ||
      voices.find(v => opts.lang && v.lang?.startsWith(opts.lang)) ||
      voices[0];

    const chunks = chunkText(text, 180);
    function chunkText(text, maxLen) {
  const safeText = (text || "").toString();
  const sentences = safeText.match(/[^.!?]+[.!?]*/g) || [safeText];
  const chunks = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > maxLen && cur.length > 0) {
      chunks.push(cur.trim());
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}
 // ~180–220 chars per chunk is safe
    const utts = chunks.map(chunk => {
      const u = new SpeechSynthesisUtterance(chunk);
      if (voice) u.voice = voice;
      if (opts.rate) u.rate = opts.rate;     // 0.1–10 (1 = normal)
      if (opts.pitch) u.pitch = opts.pitch;  // 0–2   (1 = normal)
      if (opts.lang) u.lang = opts.lang;

      u.onstart = () => setStatus("speaking");
      u.onend = () => {
        // if this was the last chunk, mark idle
        if (currentUtterances.current[currentUtterances.current.length - 1] === u) {
          setStatus("idle");
        }
      };
      u.onerror = () => setStatus("idle");
      return u;
    });

    currentUtterances.current = utts;
    utts.forEach(u => synthRef.current.speak(u));
  };

  const pause = () => {
    if (synthRef.current?.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setStatus("paused");
    }
  };

  const resume = () => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
      setStatus("speaking");
    }
  };

  const stop = () => {
    if (synthRef.current?.speaking || synthRef.current?.paused) {
      synthRef.current.cancel();
      setStatus("idle");
      currentUtterances.current = [];
    }
  };

  const voiceOptions = useMemo(
    () =>
      voices.map(v => ({
        name: v.name,
        lang: v.lang,
        default: v.default,
      })),
    [voices]
  );

  return { speak, pause, resume, stop, status, voiceOptions };
}

function chunkText(text, maxLen) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > maxLen && cur.length > 0) {
      chunks.push(cur.trim());
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}