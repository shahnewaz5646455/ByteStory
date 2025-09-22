'use client';

import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Upload, AlertCircle, RotateCw, Sparkles, Copy, Download, Pause, Volume2, Square, File, X } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PdfConverter() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef(null);
  const utteranceRef = useRef(null);

  // Fetch voices for speech synthesis
  useEffect(() => {
    if (!window.speechSynthesis) {
      setError('Web Speech API not supported in this browser. Try Chrome, Firefox, or Edge.');
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log(`Loaded ${availableVoices.length} voices`);
      setVoices(availableVoices);
      
      if (availableVoices.length > 0) {
        const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en'));
        setSelectedVoice(englishVoice || availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleFileUpload = async (event) => {
    setError('');
    setText('');
    setSummary('');
    setIsLoading(true);
    setFileName('');
    setPageCount(0);
    setCopied(false);
    setSummaryCopied(false);

    const file = event.target.files?.[0];
    if (!file || !file.type.includes('pdf')) {
      setError('Please upload a valid PDF file.');
      setIsLoading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      setIsLoading(false);
      return;
    }

    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise.catch((err) => {
        if (err.name === 'PasswordException') {
          throw new Error('PDF is password-protected. Please provide an unlocked PDF.');
        }
        throw err;
      });

      setPageCount(pdf.numPages);
      let extractedText = '';

      const maxPages = 5;
      for (let i = 1; i <= Math.min(pdf.numPages, maxPages); i++) {
        const page = await Promise.race([
          pdf.getPage(i),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Page processing timeout')), 10000))
        ]);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        extractedText += pageText + (i < Math.min(pdf.numPages, maxPages) ? ' ' : '');
      }

      setText(extractedText || 'No text extracted from the PDF.');
    } catch (err) {
      console.error('Error:', err);
      setError(`Error processing PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!text) return;

    setIsSummarizing(true);
    setError('');
    setSummary('');

    try {
      const formData = new FormData();
      formData.append('text', text);

      const response = await fetch('/api/pdf-summarize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.summary);
    } catch (err) {
      console.error('Error:', err);
      setError(`Error generating summary: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2000);
  };

  const handleClearAll = () => {
    setText('');
    setSummary('');
    setError('');
    setFileName('');
    setPageCount(0);
    setCopied(false);
    setSummaryCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSpeak = () => {
    if (!summary || !selectedVoice || !window.speechSynthesis) {
      setError('No summary or voice selected. Please generate a summary and choose a voice.');
      return;
    }

    const cleanSummary = summary.trim();
    if (!cleanSummary) {
      setError('Summary text is empty. Cannot speak.');
      return;
    }

    const maxLength = 5000;
    const textToSpeak = cleanSummary.length > maxLength ? cleanSummary.substring(0, maxLength) + '...' : cleanSummary;

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      let errorMsg = 'Error during speech synthesis';
      if (event.error) {
        errorMsg += `: ${event.error}`;
      }
      setError(errorMsg);
      setIsSpeaking(false);
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleVoiceChange = (event) => {
    const voiceIndex = event.target.value;
    setSelectedVoice(voices[voiceIndex]);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            PDF Text Extractor & Summarizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload a PDF file to extract its text content and generate an AI-powered summary
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center w-full mb-4">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl cursor-pointer bg-indigo-50/30 dark:bg-indigo-900/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-400">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-16 h-16 mb-4 text-indigo-400 dark:text-indigo-500" />
                <p className="mb-2 text-lg font-medium text-indigo-600 dark:text-indigo-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-indigo-500 dark:text-indigo-400">PDF files up to 10MB</p>
              </div>
              <input 
                id="dropzone-file" 
                type="file" 
                accept=".pdf" 
                onChange={handleFileUpload} 
                className="hidden" 
                ref={fileInputRef}
              />
            </label>
          </div>

          {fileName && (
            <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-4 border border-indigo-100 dark:border-indigo-800/30">
              <div className="flex items-center">
                <File className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
                <div>
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium truncate max-w-xs block">{fileName}</span>
                  {pageCount > 0 && (
                    <span className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
                      {pageCount} page{pageCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleClearAll}
                className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-md"
                title="Clear file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-indigo-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Processing PDF...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {text && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Extracted Text Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Extracted Text
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 font-medium"
                  >
                    {isSummarizing ? (
                      <>
                        <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Summarize
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCopyText}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      copied 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                        : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                  {text}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
                Only the first 5 pages are processed for performance reasons.
              </div>
            </div>

            {/* AI Summary Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  AI Summary
                </h2>
                {summary && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopySummary}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                        summaryCopied 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                          : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      {summaryCopied ? (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSpeak}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                        isSpeaking 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800' 
                          : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800'
                      }`}
                      disabled={!summary || !selectedVoice || !window.speechSynthesis}
                    >
                      {isSpeaking ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Speak
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleStopSpeech}
                      className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 font-medium border border-red-200 dark:border-red-800"
                      disabled={!isSpeaking}
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Voice:
                </label>
                <select
                  id="voice-select"
                  value={voices.findIndex((voice) => voice === selectedVoice)}
                  onChange={handleVoiceChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                  disabled={voices.length === 0}
                >
                  {voices.length === 0 ? (
                    <option value="">Loading voices...</option>
                  ) : (
                    voices.map((voice, index) => (
                      <option key={index} value={index}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 h-80 overflow-y-auto">
                {isSummarizing ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-indigo-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Generating AI summary...</p>
                  </div>
                ) : summary ? (
                  <div className="space-y-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {summary}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>{summary.length} characters</span>
                      <span>{summary.split(/\s+/).length} words</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center">
                    <Sparkles className="w-16 h-16 mb-4 text-indigo-300 dark:text-indigo-600" />
                    <p>Click the Summarize button to generate an AI-powered summary of your PDF content.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-indigo-600 dark:text-indigo-400">
          <p>Powered by AI • Maximum file size: 10MB • Processes first 5 pages</p>
        </div>
      </div>
    </div>
  );
}