"use client";

import { useState, useEffect, useRef } from "react";
import { 
  StickyNote, 
  X, 
  Copy, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2,
  ClipboardPaste,
  Share2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link,
  Heading1,
  Heading2,
  Code,
  Search,
  ZoomIn,
  ZoomOut,
  Type,
  Undo,
  Redo,
  Eye,
  Edit3,
  Check,
  FileText,
  Moon,
  Sun,
  Info,
  Menu,
  MoreVertical
} from "lucide-react";

export default function EnhancedNotepad() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState("edit"); // "edit", "preview", "split"
  const [fontSize, setFontSize] = useState(14);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const editorRef = useRef(null);
  const isInitialized = useRef(false);
  const saveTimeoutRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      const saved = {
        note: "",
        fontSize: 14,
        darkMode: false,
        viewMode: "edit"
      };
      
      if (saved.note) setNote(saved.note);
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.darkMode) setDarkMode(saved.darkMode);
      if (saved.viewMode) setViewMode(saved.viewMode);
      
      setHistory([saved.note || ""]);
    }
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (isInitialized.current) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(() => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }, 1000);
    }
  }, [note, fontSize, darkMode, viewMode]);

  // Update history for undo/redo
  const updateHistory = (newNote) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNote);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setNote(newNote);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNote(history[newIndex]);
      if (editorRef.current) editorRef.current.value = history[newIndex];
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNote(history[newIndex]);
      if (editorRef.current) editorRef.current.value = history[newIndex];
    }
  };

  // Enhanced formatting with better UX
  const insertFormatting = (prefix, suffix = "", placeholder = "") => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = 
      textarea.value.substring(0, start) + 
      prefix + textToInsert + suffix + 
      textarea.value.substring(end);
    
    updateHistory(newText);
    
    setTimeout(() => {
      const newCursorPos = selectedText 
        ? start + prefix.length + textToInsert.length + suffix.length
        : start + prefix.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatBold = () => insertFormatting("**", "**", "bold text");
  const formatItalic = () => insertFormatting("*", "*", "italic text");
  const formatCode = () => insertFormatting("`", "`", "code");
  const formatHeading1 = () => insertFormatting("# ", "", "Heading 1");
  const formatHeading2 = () => insertFormatting("## ", "", "Heading 2");
  const formatList = () => insertFormatting("- ", "", "list item");
  const formatNumbered = () => insertFormatting("1. ", "", "list item");
  const formatQuote = () => insertFormatting("> ", "", "quote");
  
  const formatLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      insertFormatting("[", `](${url})`, "link text");
    }
  };

  // Markdown rendering
  const renderMarkdown = (text) => {
    if (!text.trim()) {
      return '<div class="text-gray-400 dark:text-gray-500 italic text-center py-8">Start typing or use the toolbar to format your notes...</div>';
    }

    let html = text
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg my-3 overflow-x-auto"><code class="text-sm">$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>')
      .replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 my-3 italic">$1</blockquote>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank">$1</a>')
      .replace(/^\s*---\s*$/gm, '<hr class="my-4 border-gray-300 dark:border-gray-600">')
      .replace(/^\s*[-*]\s+(.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

    // Wrap list items
    html = html.replace(/(<li class="ml-4">.*?<\/li>\n?)+/g, '<ul class="list-disc my-2">$&</ul>');
    html = html.replace(/(<li class="ml-4 list-decimal">.*?<\/li>\n?)+/g, '<ol class="list-decimal my-2">$&</ol>');

    // Highlight search terms
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      html = html.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600">$1</mark>');
    }

    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.trim() && !para.includes('<h') && !para.includes('<blockquote') && 
          !para.includes('<ul') && !para.includes('<ol') && !para.includes('<hr') && 
          !para.includes('<pre')) {
        return `<p class="mb-3 leading-relaxed">${para.replace(/\n/g, '<br>')}</p>`;
      }
      return para;
    }).join('');

    return html;
  };

  const handleCopy = async () => {
    if (!note.trim()) return;
    try {
      await navigator.clipboard.writeText(note);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("Copy failed");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      insertFormatting("", "", text);
    } catch (err) {
      alert("Paste permission denied");
    }
  };

  const handleClear = () => {
    if (note.trim() && confirm("Clear all notes? This cannot be undone.")) {
      updateHistory("");
    }
  };

  const handleExport = () => {
    if (!note.trim()) return;
    const blob = new Blob([note], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!note.trim()) return;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Notes", text: note });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;
  const charCount = note.length;
  const lineCount = note.split('\n').length;
  const readTime = Math.ceil(wordCount / 200);

  const containerClass = darkMode ? 'dark' : '';

  // Mobile-specific toolbar component
  const MobileToolbar = () => (
    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
        >
          <Menu className="h-4 w-4" />
        </button>
        
        {/* View Mode Toggle - Mobile */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setViewMode("edit")}
            className={`p-1.5 rounded-l-lg transition-colors ${viewMode === "edit" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            title="Edit Mode"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`p-1.5 transition-colors ${viewMode === "preview" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            title="Preview Mode"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all disabled:opacity-30" title="Undo">
          <Undo className="h-4 w-4" />
        </button>
        <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all disabled:opacity-30" title="Redo">
          <Redo className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  // Mobile formatting menu
  const MobileFormatMenu = () => (
    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-x-auto">
      <div className="flex items-center space-x-2 min-w-max">
        <button onClick={formatBold} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Bold">
          <Bold className="h-4 w-4" />
        </button>
        <button onClick={formatItalic} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Italic">
          <Italic className="h-4 w-4" />
        </button>
        <button onClick={formatHeading1} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </button>
        <button onClick={formatList} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Bullet List">
          <List className="h-4 w-4" />
        </button>
        <button onClick={formatNumbered} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </button>
        <button onClick={formatLink} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Insert Link">
          <Link className="h-4 w-4" />
        </button>
        <button onClick={formatCode} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Code">
          <Code className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={containerClass}>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ${
          isOpen ? 'rotate-180' : 'rotate-0'
        } ${
          isMobile 
            ? 'bottom-6 right-6 p-4' 
            : 'bottom-6 right-6 p-4'
        }`}
        aria-label="Toggle Notepad"
      >
        {isOpen ? <X className="h-6 w-6" /> : <StickyNote className="h-6 w-6" />}
      </button>

      {/* Main Panel */}
      {isOpen && (
        <div className={`fixed z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 flex flex-col ${
          isMobile 
            ? isExpanded 
              ? 'ins-2 bottom-2 left-2 right-2 top-2' 
              : 'bottom-20 right-4 left-4 h-[70vh]'
            : isExpanded 
              ? 'inset-4' 
              : 'bottom-20 right-6 w-[480px] h-[600px]'
        }`}>
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <StickyNote className="h-5 w-5 text-white" />
              <h3 className="text-white font-semibold text-sm md:text-base">Smart Notepad</h3>
              {isSaved && (
                <span className="flex items-center text-xs text-white bg-white/20 px-2 py-1 rounded-full">
                  <Check className="h-3 w-3 mr-1" /> Saved
                </span>
              )}
              {copySuccess && (
                <span className="flex items-center text-xs text-white bg-white/20 px-2 py-1 rounded-full">
                  <Check className="h-3 w-3 mr-1" /> Copied
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-white/80 hover:text-white transition-colors p-1"
                title="Help"
              >
                <Info className="h-4 w-4" />
              </button>
              {!isMobile && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title={isExpanded ? "Minimize" : "Maximize"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Help Panel */}
          {showHelp && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 border-b border-indigo-200 dark:border-indigo-800 text-sm">
              <div className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Keyboard Shortcuts</div>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2 text-gray-700 dark:text-gray-300`}>
                <div><kbd className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded border text-xs">Ctrl+Z</kbd> Undo</div>
                <div><kbd className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded border text-xs">Ctrl+Y</kbd> Redo</div>
                <div><kbd className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded border text-xs">Ctrl+B</kbd> Bold</div>
                <div><kbd className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded border text-xs">Ctrl+I</kbd> Italic</div>
              </div>
            </div>
          )}

          {/* Toolbar - Conditional based on device */}
          {isMobile ? (
            <>
              <MobileToolbar />
              {(showMobileMenu || isMobile) && <MobileFormatMenu />}
            </>
          ) : (
            /* Desktop Toolbar */
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-wrap gap-2 flex-shrink-0">
              <div className="flex items-center space-x-1 flex-wrap">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 mr-2">
                  <button
                    onClick={() => setViewMode("edit")}
                    className={`p-1.5 rounded-l-lg transition-colors ${viewMode === "edit" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    title="Edit Mode"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`p-1.5 transition-colors ${viewMode === "preview" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    title="Preview Mode"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("split")}
                    className={`p-1.5 rounded-r-lg transition-colors ${viewMode === "split" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    title="Split View"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </div>

                {/* Formatting Buttons */}
                <button onClick={formatBold} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Bold (Ctrl+B)">
                  <Bold className="h-4 w-4" />
                </button>
                <button onClick={formatItalic} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Italic (Ctrl+I)">
                  <Italic className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <button onClick={formatHeading1} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Heading 1">
                  <Heading1 className="h-4 w-4" />
                </button>
                <button onClick={formatHeading2} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Heading 2">
                  <Heading2 className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <button onClick={formatList} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Bullet List">
                  <List className="h-4 w-4" />
                </button>
                <button onClick={formatNumbered} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Numbered List">
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button onClick={formatQuote} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Quote">
                  <Quote className="h-4 w-4" />
                </button>
                <button onClick={formatLink} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Insert Link">
                  <Link className="h-4 w-4" />
                </button>
                <button onClick={formatCode} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" title="Code">
                  <Code className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all disabled:opacity-30" title="Undo (Ctrl+Z)">
                  <Undo className="h-4 w-4" />
                </button>
                <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all disabled:opacity-30" title="Redo (Ctrl+Y)">
                  <Redo className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <button onClick={() => setShowSearch(!showSearch)} className={`p-1.5 rounded transition-all ${showSearch ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Search">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Search Bar */}
          {showSearch && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in notes..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Edit View */}
            {(viewMode === "edit" || viewMode === "split") && (
              <div className={`${isMobile || viewMode === "edit" ? "w-full" : "w-1/2"} ${viewMode === "split" && !isMobile ? "border-r border-gray-200 dark:border-gray-700" : ""} overflow-auto`}>
                <textarea
                  ref={editorRef}
                  value={note}
                  onChange={(e) => updateHistory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      if (e.key === 'z') { e.preventDefault(); handleUndo(); }
                      if (e.key === 'y') { e.preventDefault(); handleRedo(); }
                      if (e.key === 'b') { e.preventDefault(); formatBold(); }
                      if (e.key === 'i') { e.preventDefault(); formatItalic(); }
                    }
                  }}
                  placeholder="Start writing your notes here..."
                  className="w-full h-auto p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono"
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                />
              </div>
            )}

            {/* Preview View */}
            {(viewMode === "preview" || viewMode === "split") && (
              <div className={`${isMobile || viewMode === "preview" ? "w-full" : "w-1/2"} overflow-auto p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(note) }}
                />
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
            <div className={`flex items-center ${isMobile ? 'space-x-2 overflow-x-auto' : 'space-x-4'}`}>
              <span className="whitespace-nowrap">{charCount} chars</span>
              <span className="whitespace-nowrap">{wordCount} words</span>
              <span className="whitespace-nowrap">{lineCount} lines</span>
              <span className="whitespace-nowrap">{readTime} min read</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="hover:text-indigo-600 dark:hover:text-indigo-400" title="Decrease font">
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs whitespace-nowrap">{fontSize}px</span>
              <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="hover:text-indigo-600 dark:hover:text-indigo-400" title="Increase font">
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-1 overflow-x-auto">
              <button onClick={handleCopy} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-lg transition-all whitespace-nowrap" title="Copy">
                <Copy className="h-4 w-4" />
              </button>
              <button onClick={handlePaste} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-lg transition-all whitespace-nowrap" title="Paste">
                <ClipboardPaste className="h-4 w-4" />
              </button>
              <button onClick={handleShare} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50 rounded-lg transition-all whitespace-nowrap" title="Share">
                <Share2 className="h-4 w-4" />
              </button>
              <button onClick={handleExport} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-all whitespace-nowrap" title="Export">
                <Download className="h-4 w-4" />
              </button>
            </div>
            
            <button onClick={handleClear} className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-all whitespace-nowrap" title="Clear all">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}