"use client";
import { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setHashtags([]);

    try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title }),
      });

      const data = await res.json();

      if (data.success) {
        setHashtags(data.tags);
      } else {
        setError(data.error || "Failed to generate hashtags");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md dark:bg-gray-700/80 border-2 dark:border-gray-600 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Hashtag Generator
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Technology, Travel, Health"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md p-2 "
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium ">
              Blog Title (optional)
            </label>
            <input
              type="text"
              placeholder="Enter your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-2 dark:text-gray-400"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !category.trim()}
            className="w-full bg-indigo-600 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate Hashtags"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        {hashtags.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Suggested Hashtags:
            </h2>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
