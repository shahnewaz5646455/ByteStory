"use client";

import { useState } from "react";

export default function ContactPage() {
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

  const MAX = 2000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "note", text: "Sending…" });
    try {
      // Replace this with your backend endpoint
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] to-[#121931] text-white p-6 flex justify-center items-center">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6">
        {/* Header */}
        <header className="bg-[#121931]/70 border border-white/10 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-400">We'd love to hear from you. Send us a message and we'll get back soon.</p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#121931]/70 border border-white/10 rounded-2xl p-6 shadow-lg space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                className="w-full p-3 rounded-xl bg-[#0f1530] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                required
                className="w-full p-3 rounded-xl bg-[#0f1530] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
                className="w-full p-3 rounded-xl bg-[#0f1530] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" htmlFor="phone">
                Phone <span className="text-gray-400 text-sm">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full p-3 rounded-xl bg-[#0f1530] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="topic">
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-[#0f1530] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none"
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
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
              className="w-full p-3 rounded-xl bg-[#0f1530] border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none min-h-[140px]"
            />
            <div className="text-sm text-gray-400 mt-1">{charCount}/{MAX}</div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 font-semibold shadow-lg hover:brightness-110 active:translate-y-[1px]"
            >
              Send message
            </button>
            <button
              type="reset"
              onClick={() => {
                setFormData({ name: "", email: "", subject: "", phone: "", topic: "", message: "" });
                setCharCount(0);
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 font-semibold shadow-lg hover:brightness-110"
            >
              Reset
            </button>
          </div>

          {status && (
            <div
              className={`mt-3 p-3 rounded-xl text-sm border ${
                status.type === "success"
                  ? "bg-green-600/20 border-green-500 text-green-100"
                  : status.type === "error"
                  ? "bg-red-600/20 border-red-500 text-red-100"
                  : "bg-blue-600/20 border-blue-500 text-blue-100"
              }`}
            >
              {status.text}
            </div>
          )}
        </form>

        {/* Side Contact Info */}
        <aside className="bg-[#121931]/70 border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-semibold">Other ways to reach us</h2>
          <div className="space-y-3 text-gray-300">
            <div>📞 Phone: +880-2-1234-5678</div>
            <div>✉️ Email: support@byteStory.com</div>
            <div>📍 Address: Level 5, Example Tower, Dhaka 1212</div>
            <div>⏰ Hours: Sun–Thu: 10:00–18:00 BST</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
