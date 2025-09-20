"use client";

import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
import {
  FileText,
  Upload,
  AlertCircle,
  RotateCw,
  Sparkles,
  Copy,
  Download,
  Pause,
  Volume2,
  Square,
} from "lucide-react";

// Helper to extract and clean text from PDF
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }

  // Clean unwanted characters
  text = text.replace(/[\r\n]+/g, " "); // Remove extra newlines
  text = text.replace(/[^\x20-\x7E]+/g, ""); // Remove non-ASCII
  text = text.replace(/\s{2,}/g, " "); // Collapse multiple spaces

  return text.trim();
}

export default function PdfSummarizePage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef(null);
  const utteranceRef = useRef(null);

  // Fetch voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (!selectedVoice && availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      setFile(null);
      setFileName("");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      setFile(null);
      setFileName("");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
    setSummary("");
    setCopied(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF file first!");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      // Extract and clean text from PDF
      const extractedText = await extractTextFromPDF(file);

      if (extractedText.length < 50) {
        throw new Error("PDF text is too short to summarize. Minimum 50 characters required.");
      }

      const formData = new FormData();
      formData.append("text", extractedText);

      const res = await fetch("/api/pdf-summarize", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize PDF.");
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "Something went wrong while summarizing PDF.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setFileName("");
    setSummary("");
    setError("");
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setError("Failed to copy summary.");
    }
  };

  const handleDownload = () => {
    if (!summary) return;
    const element = document.createElement("a");
    const fileBlob = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${fileName.replace(".pdf", "")}-summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSpeak = () => {
    if (!summary || !selectedVoice) return;

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.voice = selectedVoice;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      setError("Speech synthesis error.");
      setIsSpeaking(false);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleVoiceChange = (event) => {
    const index = parseInt(event.target.value, 10);
    setSelectedVoice(voices[index]);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Summarizer
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Upload a PDF file to generate an AI-powered summary
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-500">
              <Upload className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {fileName || "Drag & drop your PDF here or click to browse"}
              </p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Browse Files
                </span>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                PDF files up to 10MB
              </p>
            </div>

            {error && (
              <div className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={!file || loading}
                className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Summarize PDF
                  </>
                )}
              </button>
            </div>
          </form>

          {summary && (
            <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  Summary
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Copy summary"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Download summary"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSpeak}
                    className={`p-2 ${isSpeaking ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
                    title={isSpeaking ? "Pause summary" : "Speak summary"}
                    disabled={!summary || !selectedVoice}
                  >
                    {isSpeaking ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={handleStopSpeech}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Stop speech"
                    disabled={!isSpeaking}
                  >
                    <Square className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Voice:
                </label>
                <select
                  id="voice-select"
                  value={voices.findIndex((voice) => voice === selectedVoice)}
                  onChange={handleVoiceChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  disabled={voices.length === 0}
                >
                  {voices.length === 0 ? (
                    <option value="">No voices available</option>
                  ) : (
                    voices.map((voice, index) => (
                      <option key={index} value={index}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {summary}
                </p>
              </div>

              {copied && (
                <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 flex items-center">
                  <Copy className="h-4 w-4 mr-1" />
                  Copied to clipboard!
                </div>
              )}

              <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{summary.length} characters</span>
                <span>{summary.split(/\s+/).length} words</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Google Gemini AI • Maximum file size: 10MB</p>
        </div>
      </div>
    </div>
  );
}