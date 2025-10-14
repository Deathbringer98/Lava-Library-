# 🌋 Lava Library — Smart Bookmark Organizer

**Lava Library** is a next-generation Chrome extension that automatically organizes your bookmarks into clean, logical folder structures.  
It’s fast, privacy-first, and designed to evolve into a fully AI-powered personal librarian for your browser.

---

## 🧭 Vision

> “A personal librarian for your browser bookmarks.”

Lava Library intelligently detects what kind of site you’re saving (social, media, news, tools, crypto, etc.)  
and auto-sorts your bookmarks into organized folders — all **locally**, with **no data collection**.

---

## 🧱 Current Status (v1.0 Development)

| Component | Status | Description |
|------------|--------|-------------|
| Manifest V3 | ✅ | Configured with bookmarks + storage permissions |
| Popup UI | ✅ | 3-tab modern interface (Bookmarks / Theme / AI placeholder) |
| Theme toggle | ✅ | Dark / light mode with persistent storage |
| Icons | ✅ | icon in 16/48/128 px |
| Sorting engine | ⚙️ | Working on full bookmark tree sort |
| Auto-sort toggle | 🔜 | Planned for next phase |
| AI categorization | 🚧 | Future Pro tier feature |

---

## 🚀 Build Phases (Roadmap)

### **Phase 1 — Core MVP Completion**
**Goal:** Finish the working foundation and ship internal beta.

✅ UI + Icons + Theme  
✅ “Sort Now” button (manual sorting)  
⚙️ Build full-tree sorting algorithm  
⚙️ Add real-time logging (for debugging)  
🧱 Externalize `categoryMap` → `categories.json`  
🧱 Add toast notification feedback (success / fail)

---

### **Phase 2 — Smart Automation & QoL**
**Goal:** Make Lava Library self-operating and pleasant to use.

🔹 Auto-sort new bookmarks (toggle in popup)  
🔹 Inactivity delay (e.g., sort 30 s after adding a bookmark)  
🔹 Scope selector — choose which folders Lava Library can touch  
🔹 Folder preview panel in popup  
🔹 Undo / restore last sort (local backup before moves)  
🔹 Smooth animations + polished UI feedback  

---

### **Phase 3 — Cleanup & Control Tools**
**Goal:** Turn Lava Library into a serious productivity tool.

🧹 Duplicate / dead link detection  
🧹 Redirect & broken URL cleanup  
⚙️ Exclusion zones (user-protected folders)  
⚙️ Custom sorting rules (A–Z, date added, etc.)  
📦 Export / import bookmarks & user settings  
📊 Sorting reports (number moved, time taken)

---

### **Phase 4 — AI Intelligence (Pro Tier)**
**Goal:** Introduce smart semantic categorization.

🧠 Heuristic classifier (title / meta keyword analysis) — *Free*  
🧠 AI categorization via OpenAI / Cohere — *Pro tier*  
🧠 Smart “Move to X folder” suggestions  
🧠 Batch “AI organize all bookmarks” button  
🧠 Explainable AI tags (“Detected as Tech → AI → Research”)  
☁️ Optional cloud sync for Pro users  

---

### **Phase 5 — Growth & Marketing**
**Goal:** Stand out in the Chrome Web Store and retain users.

💡 Onboarding walkthrough for new users  
💡 Ratings / feedback prompts after use  
💡 SEO-optimized store description + screenshots  
💡 Blog / social posts highlighting privacy focus  
💡 Referral incentives for Pro users  
💡 Regular “quality of life” updates for retention  

---

## 🔒 Core Principles

1. **Privacy-First** — No cloud sync or data collection for free users.  
2. **Local-First AI** — Heuristics before APIs.  
3. **User Control** — No forced automation; everything toggleable.  
4. **Performance-Safe** — Lightweight, non-intrusive service worker.  
5. **Transparency** — Show what’s happening when sorting.  

---

## 🧠 Long-Term Differentiators

✅ Full-tree sorting (most competitors only handle toolbar folders)  
✅ Smart semantic grouping, not just A–Z  
✅ AI-powered topic classification  
✅ Local privacy with optional AI upgrades  
✅ Visual folder preview + undo system  

---
