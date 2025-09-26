"use client";
import { useEffect, useState } from "react";
import { Sparkles, Hash, Copy, CheckCircle, RotateCw, Settings, TrendingUp, BarChart3, Download, Plus, Minus, Wifi, WifiOff, AlertTriangle } from "lucide-react";

export default function Home() {
   const [isOnline, setIsOnline] = useState(navigator.onLine); // Initialize with current status
     const [showWaitingButton, setShowWaitingButton] = useState(false);

const [showNetStatus, setShowNetStatus] = useState(false);
const [showOffNetStatus, setShowOffNetStatus] = useState(false);
const [hasNetworkChanged, setHasNetworkChanged] = useState(false); 
const [pendingRequest,setPendingRequest]= useState({})
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [hashtagLimit, setHashtagLimit] = useState(15);
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState(new Set());

  const platforms = [
    { id: "instagram", name: "Instagram", maxHashtags: 30 },
    { id: "twitter", name: "Twitter/X", maxHashtags: 5 },
    { id: "tiktok", name: "TikTok", maxHashtags: 10 },
    { id: "linkedin", name: "LinkedIn", maxHashtags: 5 },
    { id: "facebook", name: "Facebook", maxHashtags: 10 },
    { id: "general", name: "General", maxHashtags: 15 }
  ];
// Handle network status display
useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    setHasNetworkChanged(true); // Mark that network state has changed
  };
  
  const handleOffline = () => {
    setIsOnline(false);
    setHasNetworkChanged(true); // Mark that network state has changed
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);

// Handle network status display
useEffect(() => {
  // Only show status if network has actually changed (not on initial load)
  if (!hasNetworkChanged) {
    return;
  }

  if (isOnline) {

    // Network came back online
    setShowOffNetStatus(false);
    setShowNetStatus(true);
    if(pendingRequest){
      executeGenerate(pendingRequest.title,pendingRequest.category,pendingRequest.hashtagLimit,pendingRequest.platform)

    }
    const timeout = setTimeout(() => setShowNetStatus(false), 4000);
    return () => clearTimeout(timeout);
  } else {
    // Network went offline
    setShowNetStatus(false);
    setShowOffNetStatus(true);
  }
}, [isOnline, hasNetworkChanged]);
const executeGenerate =async (title,category,hashtagLimit,platform)=>{
   try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category, 
          title, 
          limit: hashtagLimit,
          platform 
        }),
      });

      const data = await res.json();

      if (data.success) {
        setHashtags(data.tags);
      } else {
        setError(data.error || "Failed to generate hashtags");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }

}



  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setHashtags([]);
    setCopied(false);
    setSelectedHashtags(new Set());
    if(!isOnline){
      setPendingRequest(title,category,hashtagLimit,platform)
    }
else{
   try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category, 
          title, 
          limit: hashtagLimit,
          platform 
        }),
      });

      const data = await res.json();

      if (data.success) {
        setHashtags(data.tags);
      } else {
        setError(data.error || "Failed to generate hashtags");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }

}}
   
  

  const copyToClipboard = async (specificTags = null) => {
    const tagsToCopy = specificTags || Array.from(selectedHashtags).length > 0 
      ? Array.from(selectedHashtags) 
      : hashtags;
    
    const text = tagsToCopy.map(tag => `#${tag}`).join(' ');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setCategory("");
    setTitle("");
    setHashtags([]);
    setError("");
    setCopied(false);
    setSelectedHashtags(new Set());
  };

  const toggleHashtagSelection = (tag) => {
    const newSelection = new Set(selectedHashtags);
    if (newSelection.has(tag)) {
      newSelection.delete(tag);
    } else {
      newSelection.add(tag);
    }
    setSelectedHashtags(newSelection);
  };

  const selectAllHashtags = () => {
    setSelectedHashtags(new Set(hashtags));
  };

  const deselectAllHashtags = () => {
    setSelectedHashtags(new Set());
  };

  const downloadHashtags = () => {
    const text = hashtags.map(tag => `#${tag}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hashtags-${category.toLowerCase()}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentPlatform = platforms.find(p => p.id === platform);
  const maxHashtags = currentPlatform?.maxHashtags || 15;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900  px-4">
    {showNetStatus && (
        <div className="sticky top-0 z-50 animate-pulse bg-green-500 py-3 px-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-5 w-5 text-white" />
            <h1 className="text-lg font-semibold text-white">You are back online ✅</h1>
          </div>
        </div>
      )}
      {/* Offline banner */}
      {showOffNetStatus && (
        <div className="sticky top-0 z-50 bg-red-600 py-3 px-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-5 w-5 text-white animate-pulse" />
            <h1 className="text-lg font-semibold text-white">You are currently offline</h1>
          </div>
          <p className="mt-1 text-sm text-red-100">
            Requests will be processed when network is restored
          </p>
        </div>
      )}

<div className="max-w-2xl mx-auto">
       
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
            <Hash className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Hashtag Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate perfect, platform-optimized hashtags for your content
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Social Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name} (max {platform.maxHashtags} hashtags)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <input
                type="text"
                placeholder="e.g. Technology, Travel, Health, Food..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Title (optional)
              </label>
              <textarea
                placeholder="Enter your blog title, post topic, or description..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                disabled={loading}
              />
            </div>

            {/* Advanced Options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <Settings className="h-4 w-4 mr-1" />
                {showAdvanced ? "Hide Advanced" : "Advanced Options"}
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Hashtags (max {maxHashtags})
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setHashtagLimit(Math.max(1, hashtagLimit - 1))}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        disabled={hashtagLimit <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-lg font-medium">{hashtagLimit}</span>
                      <button
                        onClick={() => setHashtagLimit(Math.min(maxHashtags, hashtagLimit + 1))}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        disabled={hashtagLimit >= maxHashtags}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={loading || !category.trim()}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Hashtags
                  </>
                )}
              </button>
              
              {(category || title) && (
                <button
                  onClick={clearForm}
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={loading}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
           {/* Waiting for Network Badge */}
                {showWaitingButton && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 dark:border-yellow-700 dark:from-yellow-900/20 dark:to-orange-900/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                          Waiting for Network Connection
                        </h4>
                        <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-300">
                          Your request is queued and will be processed automatically when
                          internet connection is restored.
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                          </div>
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                            Monitoring network status...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {hashtags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 text-indigo-500 mr-2" />
                Generated Hashtags ({hashtags.length})
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  for {platforms.find(p => p.id === platform)?.name}
                </span>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAllHashtags}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  Select All
                </button>
                <span className="text-gray-400">•</span>
                <button
                  onClick={deselectAllHashtags}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Deselect
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                    selectedHashtags.has(tag)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50 hover:scale-105"
                  }`}
                  onClick={() => toggleHashtagSelection(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard()}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    {selectedHashtags.size > 0 ? `Copy Selected (${selectedHashtags.size})` : "Copy All"}
                  </>
                )}
              </button>
              <button
                onClick={downloadHashtags}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Click on hashtags to select/deselect • Platform: {platforms.find(p => p.id === platform)?.name}
            </p>
          </div>
        )}

        {/* Platform Tips */}
        {hashtags.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
              Platform-Specific Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">Instagram:</span>
                <p className="text-gray-600 dark:text-gray-300">Use 5-15 relevant hashtags. Mix popular and niche tags.</p>
              </div>
              <div>
                <span className="font-medium text-blue-600 dark:text-blue-400">Twitter/X:</span>
                <p className="text-gray-600 dark:text-gray-300">2-3 hashtags maximum. Focus on trending topics.</p>
              </div>
              <div>
                <span className="font-medium text-red-600 dark:text-red-400">TikTok:</span>
                <p className="text-gray-600 dark:text-gray-300">3-5 hashtags. Include viral challenges and sounds.</p>
              </div>
              <div>
                <span className="font-medium text-blue-500 dark:text-blue-300">LinkedIn:</span>
                <p className="text-gray-600 dark:text-gray-300">3-5 professional hashtags. Industry-specific tags work best.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}