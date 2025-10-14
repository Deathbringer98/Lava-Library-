🔥 Lava Library — Full Developer Context
📘 Project Summary

Lava Library is a Chrome extension that automatically organizes bookmarks into nested folders using intelligent filters such as domain name, category, topic, and sub-topic.

It starts with a static mapping of popular sites (social media, news, streaming, shopping, etc.), but the final goal is to evolve into an AI-powered smart bookmark system that categorizes any website automatically based on page metadata, title, keywords, and content context.

The extension runs fully locally for the free version and adds cloud-AI functionality only for the paid “Pro” tier.

🧠 Current Build State
Area	Status	Notes
Manifest & Permissions	✅	Manifest v3 verified (bookmarks + storage)
Background sorting	✅	Fully functional category map + folder creation
Popup UI	✅	Modern 2025 design with tabbed layout (Bookmarks / Theme / AI)
Theme logic	✅	Dark/light toggle with storage persistence
Folder icons	✅	Present in project
Auto-sort new bookmarks	🔜	Next feature — toggle switch + listener
Smart filters (category/topic/sub-topic)	🔜	To implement in the AI phase
AI integration (Pro)	🚧	Planned with OpenAI/Cohere
Chrome Store prep	🕐	Needs screenshots, promo copy, privacy policy
🧩 Architecture Overview
lava-library/
├── manifest.json          # Chrome permissions & service worker
├── background.js          # Sorting logic + filter hooks
├── popup.html             # User interface
├── popup.js               # UI logic (tabs, theme, events)
├── styles.css             # Modern gradient / responsive design
├── icons/                 # Chrome Web Store icons (16/48/128)
└── assets/ (future)       # Branding, promo shots, AI model configs


APIs Used

chrome.bookmarks → read/write/move bookmarks

chrome.storage.local → persist user preferences (theme, autosort, filters)

chrome.runtime → message passing popup ↔ background

🎯 Primary Development Goals
Phase 1 — MVP Launch

Goal: working local extension that organizes bookmarks automatically by predefined rules.

✅ Features

Detect domain name

Categorize by domain (Twitter → Social Media → Twitter)

Auto-create nested folders

Manual “Sort Now” button

Dark/light theme persistence

Optional auto-sort toggle

Deliverable: Chrome Web Store submission (free tier)

Phase 2 — Smart Filtering Engine

Goal: add logic that categorizes any site, even those not in the hard-coded map.

Filters:

Name / Domain — e.g., nytimes.com → “News”

Category — inferred from keywords (news, tech, gaming, etc.)

Topic — e.g., “Politics”, “Science”, “Cryptocurrency”

Sub-topic — deeper specialization (e.g., “Blockchain Security”)

Miscellaneous — fallback for unmatched or unusual sites

Approach:

Use title and meta-tag parsing for free tier

For Pro tier, send page metadata to an AI classifier (OpenAI GPT-3.5 / Cohere text-classification model)

Update folder mapping dynamically via background script

Example:

Article URL: https://www.coindesk.com/policy/bitcoin-mining-regulations
→ /News/Cryptocurrency/Policy/

Phase 3 — AI Pro Tier

Goal: introduce premium tier with advanced automation.

Features:

AI-driven categorization (semantic analysis of title/keywords)

Smart folder suggestions

Auto-tagging and summarization

Export options (Markdown / Notion / CSV)

Cloud sync of preferences

Monetization via Stripe / Lemon Squeezy

Phase 4 — Future Updates (Quality-of-Life)

Goal: periodic small updates to keep free and paid users engaged.

Examples:

Folder preview inside popup

“Undo last sort” option

Custom accent colors and themes

Animated transitions

Bookmark deduplication

🧱 Developer Checklist
✅ Phase 1 (MVP)

 Add Auto-Sort toggle (popup + storage)

 Ensure background listener respects setting

 Verify all bookmark movement logic

 Run manual QA (multiple bookmark types)

 Finalize privacy policy + store listing

🚧 Phase 2 (Smart Filtering)

 Implement keyword-based domain classifier

 Add category/topic/sub-topic inference

 Build mapping table (JSON-driven, editable)

 Add visual indicators in popup for detected filters

💡 Phase 3 (AI Pro)

 Integrate OpenAI / Cohere API

 Add “AI Categorization” switch + Pro tab UI

 Implement API throttling and error handling

 Build payment + license check system

🔄 Phase 4 (QoL Updates)

 Folder preview panel

 Success toast notifications

 Theme customization

 Periodic maintenance & small feature drops

💡 Guiding Principles

Lightweight: all logic client-side unless Pro AI enabled

Privacy-first: free version never transmits user data

Extendable: easy JSON configuration for new category filters

Versioned: semantic versioning (1.0 → 1.1 → 2.0)

Upgradable: smooth path from free → Pro

🧩 Notes for Claude 4 in VS Code

Keep compatibility with Chrome Manifest V3.

Avoid frameworks until AI dashboard phase (then consider React + Vite).

When implementing smart filters, design as modular JSON rules (so users can edit later).

Maintain clear separation of Free vs Pro code paths.

Document all new feature toggles in README_DEV.md.

📅 Roadmap Summary
Milestone	Outcome
v1.0	Launch MVP on Chrome Store
v1.1	Add auto-sort toggle + QoL fixes
v1.2	Implement local keyword filtering
v2.0	Release AI Pro tier
v2.1+	Periodic updates & Pro enhancements

Final Vision

Lava Library becomes the first intelligent, privacy-respecting bookmark manager that thinks for the user — starting with static categorization and evolving into a personalized AI librarian that organizes the web automatically.