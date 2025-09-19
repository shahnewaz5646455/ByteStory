// "use client";
import { useEffect, useRef, useState } from "react";

export function useSpeechToText({ lang = "en-US", continuous = true } = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    setSupported(true);
    const rec = new SR();
    rec.continuous = continuous;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += chunk;
        else interimText += chunk;
      }
      if (finalText) setTranscript((prev) => (prev ? prev + " " : "") + finalText.trim());
      setInterim(interimText);
    };

    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setListening(false);
    };

    recognitionRef.current = rec;
    return () => {
      try { rec.abort(); } catch {}
      recognitionRef.current = null;
    };
  }, [lang, continuous]);

  const start = () => {
    if (!supported || !recognitionRef.current) return;
    if (listening) return;
    setInterim("");
    recognitionRef.current.start();
    setListening(true);
  };

  const stop = () => {
    if (!supported || !recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const reset = () => {
    setTranscript("");
    setInterim("");
  };

  return { supported, listening, transcript, interim, start, stop, reset };
}
