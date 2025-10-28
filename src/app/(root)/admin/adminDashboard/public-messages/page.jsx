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

export default function AdminMessagesBoardPage() {
    const auth = useSelector((s) => s?.authStore?.auth);
    const router = useRouter();
    const searchParams = useSearchParams();

    // state
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
    const [q, setQ] = useState(searchParams.get("q") || "");
    const [selected, setSelected] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);

    // Reply popup state
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
                (typeof window !== "undefined" ? window.location.origin : "") + "/api/public-messages"
            );
            url.searchParams.set("page", String(page));
            url.searchParams.set("limit", "20");
            if (statusFilter) url.searchParams.set("status", statusFilter);

            const res = await fetch(url.toString(), { cache: "no-store", signal: sig });
            const data = await res.json();
            if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to fetch messages.");
            setItems(Array.isArray(data.data.items) ? data.data.items : []);
            setMeta({
                page: data.data.page,
                limit: data.data.limit,
                total: data.data.total,
                pages: data.data.pages,
            });
        } catch (err) {
            if (err.name !== "AbortError") setError(err.message || "Something went wrong.");
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
            const res = await fetch(`/api/public-messages/${m._id}`, { cache: "no-store" });
            const data = await res.json();
            if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to load message.");
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
        setReplyingToMessage(null);
        setReplyText("");
        setReplyError(null);
        setReplySuccess(null);
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
            const res = await fetch(`/api/public-messages/${replyingToMessage._id}/reply`, {
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
            });
            const data = await res.json();
            if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to send reply.");

            const newReply = {
                _id: data?.data?.replyId || String(Math.random()),
                from: "admin",
                text: replyText.trim(),
                by: { id: auth?._id || null, name: auth?.name || "Admin", email: auth?.email || null },
                createdAt: new Date().toISOString(),
            };

            // Update selected message if it's the same one
            if (selected && selected._id === replyingToMessage._id) {
                setSelected((prev) =>
                    prev
                        ? {
                            ...prev,
                            replies: Array.isArray(prev.replies) ? [...prev.replies, newReply] : [newReply],
                            status: "answered",
                            updatedAt: new Date().toISOString(),
                        }
                        : prev
                );
            }

            // Update items list
            setItems((prev) => prev.map((it) => (it._id === replyingToMessage._id ? { ...it, status: "answered" } : it)));

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
                String(m.subject || "").toLowerCase().includes(needle) ||
                String(m.email || "").toLowerCase().includes(needle) ||
                String(m.name || "").toLowerCase().includes(needle) ||
                String(m.message || "").toLowerCase().includes(needle)
            );
        });
    }, [q, items]);

    function statusPill(status) {
        const s = status === "answered" ? "answered" : status === "closed" ? "closed" : "new";
        const base = "text-xs rounded-full px-2.5 py-1 border inline-flex items-center gap-1 capitalize";
        if (s === "answered")
            return (
                <span className={`${base} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800`}>
                    <Send className="h-3.5 w-3.5" /> {s}
                </span>
            );
        if (s === "closed")
            return (
                <span className={`${base} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600`}>
                    {s}
                </span>
            );
        return (
            <span className={`${base} bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800`}>
                <Inbox className="h-3.5 w-3.5" /> {s}
            </span>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] max-h-screen">
            {/* Reply Popup Modal */}
            {showReplyPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="text-lg font-semibold">Reply to Message</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Replying to: {replyingToMessage?.subject || "No subject"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    From: {replyingToMessage?.name} ({replyingToMessage?.email})
                                </p>
                            </div>
                            <button
                                onClick={closeReplyPopup}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Original Message Preview */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 max-h-32 overflow-y-auto">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original Message:</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line line-clamp-3">
                                {replyingToMessage?.message}
                            </div>
                        </div>

                        {/* Reply Form */}
                        <div className="p-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Reply
                            </label>
                            <textarea
                                ref={replyTextareaRef}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply here..."
                                className="w-full min-h-[200px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm resize-none"
                                disabled={replySending}
                            />

                            {/* Status Messages */}
                            {replyError && (
                                <div className="mt-2 text-sm text-rose-600 dark:text-rose-300">{replyError}</div>
                            )}
                            {replySuccess && (
                                <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">
                                    {replySuccess}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button
                                    onClick={closeReplyPopup}
                                    disabled={replySending}
                                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendReply}
                                    disabled={replySending || !replyText.trim()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-60"
                                >
                                    <Reply className="h-4 w-4" />
                                    {replySending ? "Sending..." : "Send Reply"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top bar */}
            <div className="border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
                <div className="text-lg font-semibold">Contact Messages (Admin)</div>

                {/* Search + Filters */}
                <div className="ml-auto flex items-center gap-3">
                    <div className="relative">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search subject, email, message…"
                            className="w-64 sm:w-80 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm"
                        />
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 pr-8 text-sm"
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
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
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
                        <div className="p-6 text-gray-600 dark:text-gray-300">No messages.</div>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {list.map((m) => {
                                const created = m.createdAt ? new Date(m.createdAt) : null;
                                const isActive = selected?._id === m._id;
                                return (
                                    <li
                                        key={m._id}
                                        className={`cursor-pointer px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/40 ${isActive ? "bg-gray-50 dark:bg-gray-900/40" : ""
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div onClick={() => openDetail(m)} className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium truncate">{m.subject || "No subject"}</div>
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
                                                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
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
                        <div className="p-6 text-rose-600 dark:text-rose-300">{detailError}</div>
                    ) : (
                        <div className="p-6">
                            {/* Header with reply button */}
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-xl font-semibold">{selected.subject || "Message"}</div>
                                    <div className="text-xs text-gray-500">
                                        {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}
                                    </div>
                                </div>
                                <button
                                    onClick={() => openReplyPopup(selected)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <Reply className="h-4 w-4" />
                                    Reply
                                </button>
                            </div>

                            <div className="mt-4 grid gap-4 text-sm">
                                <div className="flex flex-wrap gap-6">
                                    <div>
                                        <div className="text-gray-500 text-xs uppercase">From</div>
                                        <div className="font-medium">{selected.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-500">{selected.email}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs uppercase">Topic</div>
                                        <div>{selected.topic || "-"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs uppercase">Status</div>
                                        {statusPill(selected.status)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-gray-500 text-xs uppercase mb-1">Message</div>
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/30 whitespace-pre-line">
                                        {selected.message}
                                    </div>
                                </div>

                                {/* Replies */}
                                {Array.isArray(selected.replies) && selected.replies.length > 0 && (
                                    <div>
                                        <div className="text-gray-500 text-xs uppercase mb-1">Replies</div>
                                        <div className="space-y-3">
                                            {selected.replies.map((r) => (
                                                <div
                                                    key={r._id}
                                                    className="rounded-lg bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 p-3"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="text-sm font-medium">
                                                            {r.by?.name || "Admin"}
                                                            {r.by?.email ? (
                                                                <span className="text-xs text-gray-500"> ({r.by.email})</span>
                                                            ) : null}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm whitespace-pre-line">{r.text}</div>
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