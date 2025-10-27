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
  let pageCount = pdf.numPages;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  // Clean unwanted characters
  text = text.replace(/[\r\n]+/g, " "); // Remove extra newlines
  text = text.replace(/[^\x20-\x7E]+/g, ""); // Remove non-ASCII
  text = text.replace(/\s{2,}/g, " "); // Collapse multiple spaces

  return { text: text.trim(), pageCount };
}

export default function PdfSummarizePage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      setFile(null);
      setFileName("");
      setPageCount(0);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      setFile(null);
      setFileName("");
      setPageCount(0);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
    setSummary("");
    setCopied(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    try {
      const pdf = await pdfjsLib.getDocument({ data: await selectedFile.arrayBuffer() }).promise;
      setPageCount(pdf.numPages);
    } catch (err) {
      console.error("Error getting page count:", err);
      setPageCount(0);
    }
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
      const { text: extractedText } = await extractTextFromPDF(file);

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
    setPageCount(0);
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

  const handleClearAll = () => {
    handleClear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold pb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PDF Summarizer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload a PDF file to generate an AI-powered summary
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-xl p-8 text-center transition-colors hover:border-indigo-400 dark:hover:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20">
              <Upload className="h-10 w-10 text-indigo-400 mb-4" />
              <p className="text-sm text-indigo-600 dark:text-indigo-300 mb-2">
                {fileName || "Drag & drop your PDF here or click to browse"}
              </p>
              <label htmlFor="file-upload" className="cursor-pointer my-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-600 transition duration-300 shadow-md hover:shadow-lg cursor-pointer">
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
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-2">
                PDF files up to 10MB
              </p>
            </div>

            {fileName && (
              <div className="flex items-center justify-between bg-blue-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-indigo-400 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 18a.969.969 0 0 0 .933 1h12.134A.97.97 0 0 0 15 18M1 7V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2v5M6 1v4a1 1 0 0 1-1 1H1m14 6h-6m6 0-3-3m3 3-3 3" />
                  </svg>
                  <span className="text-blue-700 dark:text-indigo-300 font-medium truncate max-w-xs">{fileName}</span>
                  {pageCount > 0 && (
                    <span className="ml-3 px-2 py-1 bg-blue-100 dark:bg-indigo-800/30 text-blue-800 dark:text-indigo-300 text-xs font-semibold rounded-full">
                      {pageCount} page{pageCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                >
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 5 8 8m0-8-8 8" />
                  </svg>
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors font-medium"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={!file || loading}
                className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold cursor-pointer"
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
            <div className="mt-8 p-6 border border-indigo-100 dark:border-indigo-500/20 rounded-xl bg-indigo-50/30 dark:bg-indigo-900/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  AI Summary
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    title="Copy summary"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    title="Download summary"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSpeak}
                    className={`p-2 rounded-lg transition-colors ${isSpeaking
                      ? "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30"
                      : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                      }`}
                    title={isSpeaking ? "Pause summary" : "Speak summary"}
                    disabled={!summary || !selectedVoice}
                  >
                    {isSpeaking ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={handleStopSpeech}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Stop speech"
                    disabled={!isSpeaking}
                  >
                    <Square className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="voice-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Select Voice:
                </label>
                <select
                  id="voice-select"
                  value={voices.findIndex((voice) => voice === selectedVoice)}
                  onChange={handleVoiceChange}
                  className="block w-full px-3 py-2 border border-indigo-200 dark:border-indigo-500/30 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
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

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-100 dark:border-indigo-500/20">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {summary}
                </p>
              </div>

              {copied && (
                <div className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 flex items-center">
                  <Copy className="h-4 w-4 mr-1" />
                  Copied to clipboard!
                </div>
              )}

              <div className="mt-4 flex justify-between text-sm text-indigo-600 dark:text-indigo-400">
                <span>{summary.length} characters</span>
                <span>{summary.split(/\s+/).length} words</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-indigo-600 dark:text-indigo-400">
          <p>Powered by Google Gemini AI • Maximum file size: 10MB</p>
        </div>
      </div>
    </div>
  );
}