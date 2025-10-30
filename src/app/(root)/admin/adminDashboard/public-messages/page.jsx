"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search as SearchIcon,
  RefreshCcw,
  Reply,
  Filter,
  Inbox,
  Send,
  Clock,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMessagesBoardPage() {
  const auth = useSelector((s) => s?.authStore?.auth);
  const router = useRouter();
  const searchParams = useSearchParams();

  // state
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Reply popup state - shadcn dialog
  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [replySuccess, setReplySuccess] = useState(null);
  const replyTextareaRef = useRef(null);

  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  // admin guard
  useEffect(() => {
    if (!auth) return;
    if (auth?.role !== "admin") router.replace("/");
  }, [auth]);

  // load list
  async function loadList(sig) {
    try {
      setLoading(true);
      setError(null);
      const url = new URL(
        (typeof window !== "undefined" ? window.location.origin : "") +
          "/api/public-messages"
      );
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", "20");
      if (statusFilter) url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString(), {
        cache: "no-store",
        signal: sig,
      });
      const data = await res.json();
      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Failed to fetch messages.");
      setItems(Array.isArray(data.data.items) ? data.data.items : []);
      setMeta({
        page: data.data.page,
        limit: data.data.limit,
        total: data.data.total,
        pages: data.data.pages,
      });
    } catch (err) {
      if (err.name !== "AbortError")
        setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Open message detail
  async function openDetail(m) {
    setSelected(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/public-messages/${m._id}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Failed to load message.");
      setSelected(data.data);
    } catch (err) {
      setDetailError(err.message || "Failed to load message.");
    } finally {
      setDetailLoading(false);
    }
  }

  // Open reply popup
  function openReplyPopup(message) {
    setReplyingToMessage(message);
    setReplyText("");
    setReplyError(null);
    setReplySuccess(null);
    setShowReplyPopup(true);

    // Focus textarea after popup opens
    setTimeout(() => {
      replyTextareaRef.current?.focus();
    }, 100);
  }

  // Close reply popup
  function closeReplyPopup() {
    setShowReplyPopup(false);
    setTimeout(() => {
      setReplyingToMessage(null);
      setReplyText("");
      setReplyError(null);
      setReplySuccess(null);
    }, 300);
  }

  // Send reply
  async function sendReply() {
    try {
      setReplyError(null);
      setReplySuccess(null);
      if (!replyingToMessage?._id) return;
      if (!replyText.trim()) {
        setReplyError("Reply text is required.");
        return;
      }

      setReplySending(true);
      const res = await fetch(
        `/api/public-messages/${replyingToMessage._id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: replyText.trim(),
            admin: {
              id: auth?._id || auth?.id || null,
              name: auth?.name || "Admin",
              email: auth?.email || null,
            },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.success)
        throw new Error(data?.message || "Failed to send reply.");

      const newReply = {
        _id: data?.data?.replyId || String(Math.random()),
        from: "admin",
        text: replyText.trim(),
        by: {
          id: auth?._id || null,
          name: auth?.name || "Admin",
          email: auth?.email || null,
        },
        createdAt: new Date().toISOString(),
      };

      // Update selected message if it's the same one
      if (selected && selected._id === replyingToMessage._id) {
        setSelected((prev) =>
          prev
            ? {
                ...prev,
                replies: Array.isArray(prev.replies)
                  ? [...prev.replies, newReply]
                  : [newReply],
                status: "answered",
                updatedAt: new Date().toISOString(),
              }
            : prev
        );
      }

      // Update items list
      setItems((prev) =>
        prev.map((it) =>
          it._id === replyingToMessage._id ? { ...it, status: "answered" } : it
        )
      );

      setReplySuccess("Reply sent successfully!");

      // Close popup after success
      setTimeout(() => {
        closeReplyPopup();
      }, 1500);
    } catch (err) {
      setReplyError(err.message || "Failed to send reply.");
    } finally {
      setReplySending(false);
    }
  }

  // initial load + refetch on filters
  useEffect(() => {
    if (auth?.role !== "admin") return;
    const controller = new AbortController();
    loadList(controller.signal);
    return () => controller.abort();
  }, [auth?.role, page, statusFilter]);

  // auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(() => {
      const controller = new AbortController();
      loadList(controller.signal);
      setTimeout(() => controller.abort(), 25000);
    }, 30000);
    return () => clearInterval(id);
  }, [page, statusFilter]);

  // client-side search
  const list = useMemo(() => {
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    return items.filter((m) => {
      return (
        String(m.subject || "")
          .toLowerCase()
          .includes(needle) ||
        String(m.email || "")
          .toLowerCase()
          .includes(needle) ||
        String(m.name || "")
          .toLowerCase()
          .includes(needle) ||
        String(m.message || "")
          .toLowerCase()
          .includes(needle)
      );
    });
  }, [q, items]);

  function statusPill(status) {
    const s =
      status === "answered"
        ? "answered"
        : status === "closed"
        ? "closed"
        : "new";
    const base =
      "text-xs rounded-full px-2.5 py-1 border inline-flex items-center gap-1 capitalize";
    if (s === "answered")
      return (
        <span
          className={`${base} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800`}
        >
          <Send className="h-3.5 w-3.5" /> {s}
        </span>
      );
    if (s === "closed")
      return (
        <span
          className={`${base} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600`}
        >
          {s}
        </span>
      );
    return (
      <span
        className={`${base} bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800`}
      >
        <Inbox className="h-3.5 w-3.5" /> {s}
      </span>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] max-h-screen">
      {/* Shadcn Dialog for Reply Modal */}
      <Dialog open={showReplyPopup} onOpenChange={setShowReplyPopup}>
        <DialogContent className="w-[95%] sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg sm:text-xl">
              Reply to Message
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm text-start">
              Replying to: {replyingToMessage?.subject || "No subject"}
              <br />
              From: {replyingToMessage?.name} ({replyingToMessage?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 py-4">
            {/* Original Message Preview */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Message:
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line max-h-32 overflow-y-auto">
                {replyingToMessage?.message}
              </div>
            </div>

            {/* Reply Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Your Reply
              </label>
              <textarea
                ref={replyTextareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply here..."
                className="w-full min-h-[200px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={replySending}
              />

              {/* Status Messages */}
              {replyError && (
                <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 text-sm">
                  {replyError}
                </div>
              )}
              {replySuccess && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 text-sm">
                  {replySuccess}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={closeReplyPopup}
                disabled={replySending}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={replySending || !replyText.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm md:text-base px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition duration-150 transform cursor-pointer flex items-center justify-center w-max whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Reply className="h-4 w-4" />
                {replySending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 flex items-center gap-3">
        <div>
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Contact Messages (Admin)
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {items.length} messages •{" "}
            {items.filter((m) => m.status === "new").length} new
          </p>
        </div>

        {/* Search + Filters */}
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search subject, email, message…"
              className="w-64 sm:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
            />
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 pr-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="answered">Answered</option>
              <option value="closed">Closed</option>
            </select>
            <Filter className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <button
            onClick={() => {
              const controller = new AbortController();
              loadList(controller.signal);
              setTimeout(() => controller.abort(), 10000);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100%-49px)]">
        {/* Left: list */}
        <div className="border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-gray-500">Loading…</div>
          ) : error ? (
            <div className="p-6 text-rose-600 dark:text-rose-300">{error}</div>
          ) : list.length === 0 ? (
            <div className="p-6 text-gray-600 dark:text-gray-300">
              No messages.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800 bg-white rounded-sm dark:bg-gray-900 ">
              {list.map((m) => {
                const created = m.createdAt ? new Date(m.createdAt) : null;
                const isActive = selected?._id === m._id;
                return (
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      openReplyPopup(m);
                    }}
                    key={m._id}
                    className={`cursor-pointer px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                      isActive ? "bg-gray-50 dark:bg-gray-900/40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        onClick={() => openDetail(m)}
                        className="min-w-0 flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-medium truncate">
                            {m.subject || "No subject"}
                          </div>
                          {statusPill(m.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {m.name || "Unknown"} · {m.email}
                        </div>
                        <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {m.message}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="h-3.5 w-3.5" />
                          {created ? created.toLocaleString() : ""}
                        </div>
                        {/* Reply button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openReplyPopup(m);
                          }}
                          className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-sm"
                        >
                          <Reply className="h-3.5 w-3.5" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right: detail */}
        <div className="overflow-y-auto">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a message to view details
            </div>
          ) : detailLoading ? (
            <div className="p-6 text-gray-500">Loading…</div>
          ) : detailError ? (
            <div className="p-6 text-rose-600 dark:text-rose-300">
              {detailError}
            </div>
          ) : (
            <div className="p-6">
              {/* Header with reply button */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-semibold">
                    {selected.subject || "Message"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selected.createdAt
                      ? new Date(selected.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>
                <button
                  onClick={() => openReplyPopup(selected)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-sm"
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </button>
              </div>

              <div className="mt-4 grid gap-4 text-sm">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="text-gray-500 text-xs uppercase">From</div>
                    <div className="font-medium">
                      {selected.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selected.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase">Topic</div>
                    <div>{selected.topic || "-"}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase">
                      Status
                    </div>
                    {statusPill(selected.status)}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">
                    Message
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/30 whitespace-pre-line">
                    {selected.message}
                  </div>
                </div>

                {/* Replies */}
                {Array.isArray(selected.replies) &&
                  selected.replies.length > 0 && (
                    <div>
                      <div className="text-gray-500 text-xs uppercase mb-1">
                        Replies
                      </div>
                      <div className="space-y-3">
                        {selected.replies.map((r) => (
                          <div
                            key={r._id}
                            className="rounded-lg bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 p-3 transition-all duration-200 hover:shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium">
                                {r.by?.name || "Admin"}
                                {r.by?.email ? (
                                  <span className="text-xs text-gray-500">
                                    {" "}
                                    ({r.by.email})
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-xs text-gray-500">
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleString()
                                  : ""}
                              </div>
                            </div>
                            <div className="mt-2 text-sm whitespace-pre-line">
                              {r.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
