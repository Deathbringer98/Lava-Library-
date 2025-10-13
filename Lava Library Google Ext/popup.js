// Panel handling
const panels = {
  navBookmarks: document.getElementById("bookmarksPanel"),
  navTheme: document.getElementById("themePanel"),
  navAI: document.getElementById("aiPanel"),
};

// Navbar tab switching
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    for (const panel in panels) panels[panel].classList.remove("visible");
    const target =
      item.id === "navBookmarks" ? "bookmarksPanel" :
      item.id === "navTheme" ? "themePanel" :
      "aiPanel";
    document.getElementById(target).classList.add("visible");
  });
});

// Bookmark sort button
document.getElementById("sortNow").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "sortAll" });
  alert("All bookmarks have been organized!");
});

// Theme toggle setup
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  // Apply theme and optionally save it
  function applyTheme(mode, save = true) {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(mode);
    themeToggle.checked = mode === "dark";
    if (save) chrome.storage.local.set({ theme: mode });
  }

  // On toggle click
  themeToggle.addEventListener("change", () => {
    const mode = themeToggle.checked ? "dark" : "light";
    applyTheme(mode);
  });

  // Load saved preference (or default to light)
  chrome.storage.local.get("theme", ({ theme }) => {
    const saved = theme || "light";
    applyTheme(saved, false);
  });
});
