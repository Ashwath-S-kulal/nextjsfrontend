# 🚀 Premium Motion-Animated Developer Portfolio

A futuristic, dark-mode, motion-animated personal portfolio website built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **Framer Motion**.

---

## ✨ Features & Architecture

* **Framework**: Next.js 15 (App Router) + React 19 (JavaScript `.js` / `.jsx` only)
* **Design Language**: Dark, Minimal, Futuristic, Clean, and Interactive
* **Typography**: Syne (Headings), Space Grotesk (Body), JetBrains Mono (Tech/Code)
* **Color System**: Deep Black/Charcoal (`#03040a`), Neon Cyan (`#00f5ff`), Velvet Purple (`#a855f7`), Gold Accent (`#f2b632`)
* **Motion & Interactivity**:
  * **Dynamic Canvas Particles**: Constellation node network reacting smoothly to cursor movement.
  * **Interactive Terminal Console**: Real-time simulated typing of deployment and CLI commands.
  * **Holographic ID Card**: Floating 3D-styled identity card with live availability status indicator.
  * **Omnichannel Freelance Blueprint**: Interactive accordion detailing Web & Mobile architecture.
  * **Project Showcase & Deep-Dive Modal**: Category filtering (Full Stack, AI & ML, Frontend) and popup modal for detailed architectures.
  * **Education Timeline**: Vertical glowing track with CGPA and distinction metrics.
  * **Interactive Contact Form & 1-Click Clipboard**: Instant email copying with visual feedback and direct message dispatch.
  * **Desktop Custom Follower Cursor**: Smooth spring physics with hover detection on interactive elements.

---

## 📁 Centralized Data Store

All personal data, projects, skills, education, and social links are centrally managed in:
```
data/portfolio.js
```
Edit this single file to update your personal details, project links, or skill badges without modifying component code.

---

## 🛠️ Development & Running Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```



to host to firebase 
npm run build
firebase deploy --only hosting