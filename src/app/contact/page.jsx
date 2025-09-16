"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

function InputField({ id, label, type = "text", value, onChange, placeholder, required, autoComplete }) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        autoComplete={autoComplete}
        className="peer w-full p-3 rounded-2xl bg-[#0d1330]/70 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-3 px-1 text-sm text-gray-400 bg-transparent transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-300 peer-focus:bg-[#0d1330]"
      >
        {label}
      </label>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const MAX = 2000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "note", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus({ type: "success", text: "Thank you! Your message has been sent." });
      setFormData({ name: "", email: "", subject: "", phone: "", topic: "", message: "" });
      setCharCount(0);
    } catch (err) {
      setStatus({ type: "error", text: "Could not send your message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1020] text-white">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-200">
            Let’s talk
          </span>
          <h1 className="mt-4 bg-gradient-to-r from-indigo-300 via-white to-cyan-200 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
            Get in touch with our team
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300 md:text-base">
            Send us a message and we’ll get back to you within one business day.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Left: Form */}
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InputField id="name" label="Full name" value={formData.name} onChange={handleChange} required autoComplete="name" />
              <InputField id="email" label="Email address" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InputField id="subject" label="Subject" value={formData.subject} onChange={handleChange} required />
              <InputField id="phone" label="Phone (optional)" type="tel" value={formData.phone} onChange={handleChange} autoComplete="tel" />
            </div>

            <div className="mt-4">
              <div className="relative">
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-2xl bg-[#0d1330]/70 p-3 pr-10 text-white border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="support">Product Support</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="careers">Careers</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message…"
                  required
                  className="w-full min-h-[160px] rounded-2xl bg-[#0d1330]/70 p-3 text-white border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-400">{charCount}/{MAX}</div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 font-semibold shadow-lg transition hover:brightness-110 active:translate-y-[1px] disabled:opacity-60"
              >
                <Send className="h-5 w-5" /> {loading ? "Sending…" : "Send message"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ name: "", email: "", subject: "", phone: "", topic: "", message: "" });
                  setCharCount(0);
                  setStatus(null);
                }}
                className="rounded-2xl bg-white/10 px-5 py-3 font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                Reset
              </button>
            </div>

            {status && (
              <div
                className={`mt-4 rounded-2xl border p-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                    : status.type === "error"
                    ? "border-rose-400/40 bg-rose-500/15 text-rose-100"
                    : "border-indigo-400/40 bg-indigo-500/15 text-indigo-100"
                }`}
              >
                {status.text}
              </div>
            )}
          </motion.form>

          {/* Right: Contact Card */}
          <motion.aside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          >
            <h2 className="text-xl font-semibold">Other ways to reach us</h2>
            <p className="mt-1 text-sm text-gray-300">Prefer a different channel? We're available here too.</p>
            <div className="mt-5 space-y-4 text-gray-200">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-indigo-300" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-400">+880-2-1234-5678</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-indigo-300" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-400">support@byteStory.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-indigo-300" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-400">Level 5, Example Tower, Dhaka 1212</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-indigo-300" />
                <div>
                  <div className="font-medium">Hours</div>
                  <div className="text-gray-400">Sun–Thu: 10:00–18:00 BST</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1330]/60 p-4">
              <p className="text-sm text-gray-300">
                Looking for enterprise support? <span className="text-white/90">Call our priority line</span> and mention your company name for faster routing.
              </p>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}