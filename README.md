<div align="center">
  
# 🌌 Eyrae Code Studios
**The Ultimate Cloud Development Core.**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-7B52AB?style=for-the-badge&logo=visualstudiocode&logoColor=white)](#)

### 🟢 [Live Demo: Experience Eyrae Studios Here](https://eyrae-code-studios.netlify.app)

*Write, compile, and execute code instantly in your browser with zero setup.*

</div>

---

## ⚡ Overview

Welcome to **Eyrae Code Studios**, a production-grade, serverless Cloud IDE built for developers who want friction-free execution. 

Tired of setting up local environments just to test a quick C++ script or verify some Python logic? Eyrae Studios gives you a beautiful, distraction-free Monaco editor paired with a **custom Next.js backend proxy** that perfectly bridges your browser to a massive global execution cluster.

No CORS errors. No rate-limit lockouts. Just pure, instant compilation.

---

## ✨ Features

* 🚀 **Universal Cloud Compiler:** Executes 10+ languages asynchronously via the Paiza Global Cluster.
* 🛡️ **Bulletproof API Proxy:** Built-in Next.js server route (`/api/compile`) natively bypasses browser CORS blocks.
* 🌐 **Interactive Web Canvas:** Real-time dual-tab DOM rendering engine explicitly for HTML/CSS interface building.
* 💾 **Persistent Memory Auto-Save:** Silently caches your entire workspace state to `localStorage` on every keystroke. Never lose your code to an accidental refresh again!
* ⌨️ **Pro-Dev Shortcuts:** Instantly trigger cloud execution using `Ctrl + Enter` straight from the editor.
* 🎨 **Dynamic Aesthetic Theming:** Choose from *Deep Dark*, *Midnight*, *Ocean*, or *Hacker* mode—complete with animated, breathing radial background glows.
* 🖥️ **Focus Mode:** Expand your workspace to cover the entire screen, hiding the sidebar and navigation for deep-work sessions.

---

## 🛠️ The Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript
* **Editor Core:** `@monaco-editor/react` (The exact same engine powering VS Code)
* **Styling:** Vanilla CSS Modules with advanced backdrop-filters and keyframe animations
* **Icons:** `lucide-react`
* **Backend Proxy:** Next.js Serverless API Route
* **Compilation Engine:** Paiza.IO Universal Executer

---

## 🌍 Supported Environments

Eyrae Studios natively supports standard input (`stdin`) parsing and real-time execution for:

| Language | Engine Version | Language | Engine Version |
| :--- | :--- | :--- | :--- |
| 🐍 **Python** | `v3.10` | 🐹 **Go** | `v1.22` |
| ⚡ **JavaScript** | `ES2026` | 🦀 **Rust** | `v1.76` |
| 🛡️ **TypeScript** | `v5.4` | 🐘 **PHP** | `v8.3` |
| ☕ **Java** | `JDK 21` | 🍎 **Swift** | `v5.10` |
| 🎯 **C / C++** | `GCC 11/14` | 💠 **C#** | `v12.0` |

*(Plus an isolated iframe DOM engine for **HTML5** and **CSS3**!)*

---

## 🚀 Getting Started (Local Development)

Want to run the studio locally on your own machine? It takes less than 60 seconds.

### 1. Clone the Repository
```bash
git clone [https://github.com/Eyrae/eyrae-code-studios.git](https://github.com/Eyrae/eyrae-code-studios.git)
cd eyrae-code-studios

```
### 2. Install Dependencies
```bash
npm install

```
### 3. Ignite the Core
```bash
npm run dev

```
Open http://localhost:3000 in your browser to see the result!
## 💡 The Architecture (How it works)
Most open-source web compilers fail because modern browsers block direct communication with compilation APIs (CORS).
Eyrae Studios solves this by utilizing **Next.js Full-Stack capabilities**.
 1. The Frontend Monaco Editor collects your code and standard inputs.
 2. It sends a secure JSON payload to our own Internal Server Route (/api/compile).
 3. The Server Route creates a secure, server-to-server handshake with the Paiza Docker Cluster.
 4. Paiza spins up a container, executes the code, and passes the terminal output back down the chain.
<div align="center">
<i>Designed and engineered with 💜 by Eyrae.</i>
</div>
```

```
