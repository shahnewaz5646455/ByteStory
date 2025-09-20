'use client';

import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

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
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]); // Default to first voice
      }
    };

    loadVoices(); // Initial load
    window.speechSynthesis.onvoiceschanged = loadVoices; // Handle async voice loading

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel(); // Clean up on unmount
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
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    setIsSpeaking(false);
  };

  const handleSpeak = () => {
    if (!summary || !selectedVoice) return;

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

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.voice = selectedVoice;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setError('Error during speech synthesis');
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
    const voiceIndex = event.target.value;
    setSelectedVoice(voices[voiceIndex]);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">PDF Text Extractor & Summarizer</h1>
          <p className="text-lg text-gray-600">Upload a PDF file to extract its text content and generate a summary</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-center w-full mb-4">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-12 h-12 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-lg text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-sm text-gray-500">PDF (MAX. 10MB)</p>
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
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 18a.969.969 0 0 0 .933 1h12.134A.97.97 0 0 0 15 18M1 7V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2v5M6 1v4a1 1 0 0 1-1 1H1m14 6h-6m6 0-3-3m3 3-3 3"/>
                </svg>
                <span className="text-blue-700 font-medium truncate max-w-xs">{fileName}</span>
                {pageCount > 0 && (
                  <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {pageCount} page{pageCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button 
                onClick={handleClearAll}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 5 8 8m0-8-8 8"/>
                </svg>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600">Processing PDF...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {text && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Extracted Text</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isSummarizing ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16v-5.5C11 9 10 8 8.5 8m3.5 8H5v-5.5C5 9 6 8 7.5 8m3.5 8v4M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 8V7c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v1"/>
                        </svg>
                        Summarize
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCopyText}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                      copied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 9V4a1 1 0 0 0-1-1H1.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1H4a1 1 0 0 0 1-1ZM9 7h6m-6 4h6m-6 4h6M4 5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">{text}</pre>
              </div>
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                Only the first 5 pages are processed for performance reasons.
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">AI Summary</h2>
                {summary && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopySummary}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        summaryCopied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {summaryCopied ? (
                        <>
                          <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 9V4a1 1 0 0 0-1-1H1.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1H4a1 1 0 0 0 1-1ZM9 7h6m-6 4h6m-6 4h6M4 5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSpeak}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isSpeaking ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      disabled={!summary || !selectedVoice}
                    >
                      {isSpeaking ? (
                        <>
                          <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6"/>
                          </svg>
                          Pause
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd"/>
                          </svg>
                          Speak
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleStopSpeech}
                      className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      disabled={!isSpeaking}
                    >
                      <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12v12H6V6Z"/>
                      </svg>
                      Stop
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Voice:
                </label>
                <select
                  id="voice-select"
                  value={voices.findIndex((voice) => voice === selectedVoice)}
                  onChange={handleVoiceChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-80 overflow-y-auto">
                {isSummarizing ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-purple-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Generating summary...</p>
                  </div>
                ) : summary ? (
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{summary}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg className="w-16 h-16 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16v-5.5C11 9 10 8 8.5 8m3.5 8H5v-5.5C5 9 6 8 7.5 8m3.5 8v4M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 8V7c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v1"/>
                    </svg>
                    <p className="text-center">Click the Summarize button to generate an AI-powered summary of your PDF content.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}