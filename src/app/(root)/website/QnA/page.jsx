"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function QnA() {
  const auth = useSelector((store) => store?.authStore?.auth);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  useEffect(() => {
    if (!auth?.email) return;
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(
          (typeof window !== "undefined" ? window.location.origin : "") + "/api/public-messages"
        );
        url.searchParams.set("email", auth.email.toLowerCase());
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", "10");

        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to fetch messages.");
        }

        if (!alive) return;
        setMessages(Array.isArray(data.data.items) ? data.data.items : []);
        setMeta({
          page: data.data.page,
          limit: data.data.limit,
          total: data.data.total,
          pages: data.data.pages,
        });
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Something went wrong.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [auth?.email, page]);

  function gotoPage(p) {
    setLoading(true)
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(p));
    router.push("/website/QnA")
   setTimeout(() => {
    setLoading(false);
   }, 3000); 
  }

  if (!auth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center shadow">
          <h1 className="text-2xl font-semibold mb-2">Please sign in to view your messages</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You must be logged in to see messages you sent via the contact page.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-5 py-2.5 hover:bg-gray-800 transition"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Messages</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Questions and messages you sent via the Contact page.
          </p>
        </div>
        <button
          onClick={() => gotoPage(page)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-300">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"></path>
          </svg>
          Loading…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg border p-4 text-sm text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-900/10">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && messages.length === 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <MessageSquare className="h-6 w-6 mx-auto mb-2 text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You haven’t sent any messages yet.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && !error && messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((item) => {
            const created = item.createdAt ? new Date(item.createdAt) : null;
            const status =
              item.status === "answered"
                ? "answered"
                : item.status === "closed"
                ? "closed"
                : "new";

            return (
              <div
                key={item._id}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-lg">{item.subject || "No subject"}</div>
                  <div className="flex items-center gap-2">
                    {item.topic && (
                      <span className="text-xs rounded-full px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                        {item.topic}
                      </span>
                    )}
                    <span
                      className={`text-xs rounded-full px-2.5 py-1 border ${
                        status === "answered"
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800"
                          : status === "closed"
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                          : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {created ? created.toLocaleString() : ""}
                </div>

                <div className="mt-3 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {item.message}
                </div>

                {/* Replies */}
                {Array.isArray(item.replies) && item.replies.length > 0 && (
                  <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-3 space-y-3">
                    <div className="text-sm font-semibold">Admin replies</div>
                    {item.replies.map((r) => {
                      const rDate = r.createdAt ? new Date(r.createdAt) : null;
                      return (
                        <div key={r._id} className="rounded-lg bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-medium">
                              {r.by?.name || "Admin"}
                              {r.by?.email ? (
                                <span className="text-xs text-gray-500 dark:text-gray-400"> ({r.by.email})</span>
                              ) : null}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {rDate ? rDate.toLocaleString() : ""}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                            {r.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && meta.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => gotoPage(Math.max(1, meta.page - 1))}
            disabled={meta.page <= 1}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            Page {meta.page} of {meta.pages} · {meta.total} total
          </div>

          <button
            onClick={() => gotoPage(Math.min(meta.pages, meta.page + 1))}
            disabled={meta.page >= meta.pages}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
