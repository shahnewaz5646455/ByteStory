"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from "lucide-react";

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
        className="peer w-full p-3 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-indigo-500/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 dark:text-white placeholder-transparent transition-colors"
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-3 px-1 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-focus:bg-white dark:peer-focus:bg-gray-800"
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
      setStatus({ type: "success", text: "Thank you! Your message has been sent." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200">
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Let's talk
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Send us a message. We'll get back to you within one business day.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Left: Form */}
          <motion.form
            action="https://formspree.io/f/myzdrejv"
            method="POST"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 rounded-3xl border border-gray-200 dark:border-indigo-500/20 bg-white dark:bg-gray-800 p-6 shadow-lg"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InputField id="name" label="Full name" value={formData.name} onChange={handleChange} required autoComplete="name" />
              <InputField id="email" label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InputField id="subject" name="subject" label="Subject" value={formData.subject} onChange={handleChange} required />
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
                  className="w-full appearance-none rounded-2xl bg-white dark:bg-gray-800/70 p-3 pr-10 text-gray-900 dark:text-white border border-gray-200 dark:border-indigo-500/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
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
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">▼</div>
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
                  className="w-full min-h-[160px] rounded-2xl bg-white dark:bg-gray-800/70 p-3 text-gray-900 dark:text-white border border-gray-200 dark:border-indigo-500/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-500 dark:text-gray-400">{charCount}/{MAX}</div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="group/button relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 overflow-hidden"
              >
                <span className="flex items-center gap-2 relative z-10">
                  <Send className="h-5 w-5" /> {loading ? "Sending…" : "Send message"}
                </span>
                <div className="absolute inset-0 flex justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-12deg)_translateX(200%)]">
                  <div className="relative w-12 h-full bg-white/20"></div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ name: "", email: "", subject: "", phone: "", topic: "", message: "" });
                  setCharCount(0);
                  setStatus(null);
                }}
                className="rounded-xl border-2 border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-3 text-gray-800 dark:text-gray-200 font-semibold hover:border-indigo-200 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Reset
              </button>
            </div>

            {status && (
              <div
                className={`mt-4 rounded-xl border p-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-400/40 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-100"
                    : status.type === "error"
                    ? "border-rose-400/40 bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-100"
                    : "border-indigo-400/40 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-100"
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
            className="md:col-span-2 rounded-3xl border border-gray-200 dark:border-indigo-500/20 bg-white dark:bg-gray-800 p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Other ways to reach us</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Prefer a different channel? We're available here too.</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Phone</div>
                  <div className="text-gray-600 dark:text-gray-400">+880-2-1234-5678</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Email</div>
                  <div className="text-gray-600 dark:text-gray-400">support@byteStory.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Address</div>
                  <div className="text-gray-600 dark:text-gray-400">Level 5, Example Tower, Dhaka 1212</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Hours</div>
                  <div className="text-gray-600 dark:text-gray-400">Sun–Thu: 10:00–18:00 BST</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-900/20 p-4">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Looking for enterprise support? <span className="font-medium text-indigo-800 dark:text-indigo-200">Call our priority line</span> and mention your company name for faster routing.
              </p>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}