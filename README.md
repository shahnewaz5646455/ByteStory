# 🧠 ByteStory — AI Powered Blogging Platform  

![ByteStory Preview](https://res.cloudinary.com/djslk8o50/image/upload/v1762187869/Screenshot_2_bbw3a6.png)

---

## 🚀 Live Demo
🔗 [Live Website](https://byte-story.vercel.app/) 

---

## ✨ Overview

**ByteStory** is a modern **AI-powered blogging platform** built with **Next.js** that allows users to generate, optimize, and manage blogs effortlessly.  
It integrates advanced AI models, real-time collaboration, offline accessibility, and secure payment systems — all in one place.

---

## 🧩 Key Features

- 🧠 **AI Blog Creator:** Generate structured, high-quality articles using guided AI prompts.  
- 🔍 **SEO Checker & Score:** Real-time SEO analysis and optimization suggestions.  
- ✍️ **Grammar & Spell Checker:** Detect and correct errors instantly.  
- 🏷️ **AI Hashtag Generator:** Auto-generate relevant, high-impact hashtags.  
- 📚 **PDF Summarizer & Text Extractor:** Upload PDFs to get summaries and key insights.  
- 📄 **AI Text Summarizer:** Condense long-form text into meaningful summaries.  
- 📧 **AI Email Writer:** Generate professional emails using context-aware AI.  
- 🎙 **Speech-to-Text / Text-to-Speech:** Voice typing and audio playback for articles.  
- 💾 **Offline Mode:** Auto-detects disconnection, saves pending data, and syncs upon reconnection.  
- 💳 **Stripe Payments:** Token-based AI usage system with secure payments.  
- 💬 **Feed Page:** Real-time post sharing, comments, and reactions via Socket.io.  
- 🗞 **Newsletter Integration:** Built with Mailchimp API for campaigns and subscriptions.  
- 🧭 **Admin Dashboard:** Analytics, feedback, and user management.  
- 🌓 **Theme Toggle:** Light, dark, and system-adaptive themes.  

---

## 🏗️ System Architecture & Technologies

ByteStory is a fullstack **Next.js** web application with built-in API routes, AI integrations, and MongoDB backend — designed for scalability and performance.

### 🖥️ Frontend
- **Next.js 15 (React 19)** – Server-side rendering & API routes  
- **Tailwind CSS** – Utility-first responsive design  
- **Framer Motion & Motion** – High-performance animations  
- **Radix UI + Shadcn/UI** – Accessible, reusable UI components  
- **Lucide Icons, Swiper.js, Slick Carousel** – Interactive UI elements  
- **Redux Toolkit + Redux Persist** – Global state and offline persistence  
- **React Hook Form + Zod + @hookform/resolvers** – Form validation and schema control  
- **Recharts** – Interactive data visualizations  
- **React Markdown** – Safe markdown rendering  
- **React Toastify + Sonner** – Notifications and alerts  
- **Next Themes** – System-based theme switching  

### ⚙️ Backend & Integrations
- **Next.js API Routes (Node.js)** – Handles server-side logic  
- **MongoDB + Mongoose** – Document-based database  
- **NextAuth.js + Google OAuth** – Secure authentication  
- **Stripe API** – Payment gateway for AI usage key purchase  
- **Socket.io** – Real-time posts, comments, and notifications  
- **Cloudinary** – Media upload, optimization, and delivery  
- **Nodemailer** – Email system for contact, feedback, and alerts  
- **Mailchimp API** – Newsletter management and campaigns  
- **Google Generative AI & Gemini API** – Content generation, summarization, and hashtags  
- **pdf-parse / pdfjs-dist** – Extract and summarize PDF content  
- **Axios** – API requests and backend communication  

---

## 🔒 Environment Variables

Create a `.env` file in the project root and include the following variables:

```env
NODEMAILER_HOST=your_host
NODEMAILER_PORT=your_port
NODEMAILER_EMAIL=your_email
NODEMAILER_PASSWORD=your_password

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

RUBAID_GEMINI_API_KEY=your_key
GEMINI_API_KEY=your_key
NEWAZ_GEMINI_API_KEY=your_key

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_secret
```
---

⚙️ Installation & Setup
```bash
Copy code
# Clone repository
git clone https://github.com/shahnewaz5646455/ByteStory.git
cd bytestory
npm install
```
# Run development server
```npm run dev
Then open 👉 http://localhost:3000
```
