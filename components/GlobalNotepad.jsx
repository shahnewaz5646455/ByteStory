"use client";

import { useState, useEffect } from "react";
import { StickyNote, X, Copy, Trash2, Save, Share, Download, Upload, Maximize2, Minimize2 } from "lucide-react";

export default function GlobalNotepad() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load note from localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem("bytestory_notepad");
    if (savedNote) setNote(savedNote);
  }, []);

  // Auto-save when note changes
  useEffect(() => {
    if (note) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("bytestory_notepad", note);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [note]);

  const handleSave = () => {
    localStorage.setItem("bytestory_notepad", note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = async () => {
    if (!note.trim()) return;
    try {
      await navigator.clipboard.writeText(note);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("Copy failed. Please try again.");
    }
  };

  const handleClear = () => {
    if (note.trim() && confirm("Are you sure you want to clear all notes?")) {
      setNote("");
      localStorage.removeItem("bytestory_notepad");
    }
  };

  const handleExport = () => {
    if (!note.trim()) return;
    const blob = new Blob([note], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bytestory-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setNote(e.target.result);
    };
    reader.readAsText(file);
    event.target.value = ""; 
  };

  const handleShare = async () => {
    if (!note.trim()) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My ByteStory Notes",
          text: note,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setNote(prev => prev + (prev ? "\n\n" : "") + text);
    } catch (err) {
      alert("Cannot access clipboard. Please paste manually.");
    }
  };

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;
  const lineCount = note.trim() ? note.split('\n').length : 0;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
        title="Smart Notepad"
      >
        {isOpen ? <X className="h-6 w-6" /> : <StickyNote className="h-6 w-6" />}
      </button>

      {/* Notepad Panel */}
      {isOpen && (
        <div className={`fixed z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
          isExpanded 
            ? 'bottom-4 right-4 top-4 left-4' 
            : 'bottom-20 right-6 w-80 h-96'
        }`}>
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
            <div className="flex items-center space-x-2">
              <StickyNote className="h-4 w-4 text-white" />
              <h3 className="text-white font-semibold text-sm">Smart Notepad</h3>
              {isSaved && (
                <span className="text-xs text-green-300 bg-green-800 bg-opacity-30 px-2 py-1 rounded">
                  Saved
                </span>
              )}
              {copySuccess && (
                <span className="text-xs text-green-300 bg-green-800 bg-opacity-30 px-2 py-1 rounded">
                  Copied!
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:text-gray-200 transition-colors"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Write or paste your content here...\n\n💡 Tip: Use this notepad to combine content from different tools like Blog Generator, Hashtag Generator, etc.`}
            className={`w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none outline-none p-4 ${
              isExpanded ? 'h-[calc(100%-8rem)]' : 'h-64'
            }`}
          />

          {/* Stats Bar */}
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span>{note.length} chars</span>
              <span>{wordCount} words</span>
              <span>{lineCount} lines</span>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleImport}
                className="hidden"
                id="file-import"
              />
              <label
                htmlFor="file-import"
                className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                title="Import from file"
              >
                <Upload className="h-4 w-4" />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2">
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition-all"
                title="Save (Auto-saves)"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition-all"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={handlePasteFromClipboard}
                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition-all"
                title="Paste from clipboard"
              >
                📋
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-all"
                title="Share content"
              >
                <Share className="h-4 w-4" />
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleExport}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-all"
                title="Export as file"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all"
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}