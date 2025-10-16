// Phase 5.2 — UI polish + DnD + context menu + icons + animated folders

// Delete Mode Variables
let deleteMode = false;
let selectedNodes = new Set();

// Panels
const panels = {
  navBookmarks: document.getElementById("bookmarksPanel"),
  navTheme: document.getElementById("themePanel"),
  navAI: document.getElementById("aiPanel"),
  navSupport: document.getElementById("supportPanel"),
};
document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".nav-item").forEach(i=>i.classList.remove("active"));
    btn.classList.add("active");
    for(const k in panels) panels[k].classList.remove("visible");
    const target = btn.id==="navBookmarks" ? "bookmarksPanel" : 
                   btn.id==="navTheme" ? "themePanel" : 
                   btn.id==="navSupport" ? "supportPanel" : "aiPanel";
    document.getElementById(target).classList.add("visible");
  };
});

// ---- Context-aware greeting ----
const greetingEl = document.createElement("div");
greetingEl.className = "greeting";
const hours = new Date().getHours();
const greet = hours < 12 ? "Good morning" :
              hours < 18 ? "Good afternoon" : "Good evening";
greetingEl.textContent = `${greet}, welcome to Lava Library`;
document.querySelector(".tab-header").after(greetingEl);

// Theme (light/dark only)
(()=>{
  const toggle=document.getElementById("themeToggle");
  const apply=m=>{document.body.classList.remove("light","dark");document.body.classList.add(m);
    if (toggle) toggle.checked=m==="dark"; chrome.storage.local.set({theme:m});};
  chrome.storage.local.get(["theme"],({theme="light"})=>apply(theme));
  toggle?.addEventListener("change",()=>apply(toggle.checked?"dark":"light"));
})();

// Stats
async function refreshStats(){
  const res = await chrome.runtime.sendMessage({ action:"getStats" });
  const el = document.getElementById("statsRow");
  if (!el) return;
  const s = res?.lastRunStats;
  el.textContent = s ? `Last run: moved ${s.moved}, duplicates ${s.duplicates||0}, skipped roots ${s.skippedRoot||0}, duration ${s.durationSec||0}s`
                     : "No recent runs yet.";
}
refreshStats();

// Progress UI
const progressContainer=document.getElementById("progressContainer");
const progressText=document.getElementById("progressText");
const progressBarInner=document.getElementById("progressBarInner");
chrome.runtime.onMessage.addListener(msg=>{
  if(msg.action==="progressUpdate"){
    const pct=Math.max(5,Math.floor((msg.current/msg.total)*100));
    progressContainer.style.display="block";
    progressText.textContent=`Sorting ${msg.current} of ${msg.total} (${pct}%)`;
    progressBarInner.style.width=`${pct}%`;
  }
  if(msg.action==="progressDone"){
    progressText.textContent="✅ Sorting complete!";
    progressBarInner.style.width="100%";
    setTimeout(()=>{progressContainer.style.display="none";progressBarInner.style.width="0%";refreshStats();renderTree();},800);
  }
});
document.getElementById("sortNow").onclick=()=>chrome.runtime.sendMessage({action:"sortAll"});

// ------- Icons for top categories -------
const CAT_ICONS = {
  "Music":"🎵","Social Media":"🌐","Blogs":"✍️","News":"📰","Health":"❤","Finance":"💰","Work Flow":"🧐","Entertainment":"🎬",
  "Games":"🎮","Forums":"💬","Other":"📁"
};

// ------- Tree Rendering -------
async function fetchTree(){return (await chrome.runtime.sendMessage({action:"getOrganizedTree"}))?.tree||[];}
function el(tag, props={}, ...kids){const e=document.createElement(tag);Object.assign(e,props);kids.forEach(k=>e.append(k));return e;}

function folderRow(title, folderId){
  const row = el("div",{className:"tree-row", draggable:false});
  const twist = el("div",{className:"twisty"}, document.createTextNode("–"));
  const label = el("div",{className:"folder-title"});
  label.dataset.folderId = folderId; // ✅ correct way to set dataset
  const emoji = el("span",{className:"emoji"}, CAT_ICONS[title] || "📂");
  label.append(emoji, document.createTextNode(" " + title));
  row.append(twist, label);
  return {row, twist, label};
}

function renderFolder(folder, state){
  const card = el("div",{className:"tree-card"});
  const {row, twist, label} = folderRow(folder.title, folder.id);
  
  // Add checkbox in delete mode
  if (deleteMode) {
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "tree-checkbox";
    cb.dataset.id = folder.id;
    cb.addEventListener("change", e => {
      e.target.checked ? selectedNodes.add(folder.id) : selectedNodes.delete(folder.id);
    });
    row.insertBefore(cb, row.firstChild);
  }
  
  card.append(row);

  const wrap = el("div",{className:"folder-children"});
  const idKey = String(folder.id);
  let open = state[idKey] !== false;
  wrap.classList.toggle("expanded", open);
  wrap.classList.toggle("collapsed", !open);
  twist.textContent = open ? "–" : "+";

  // Links
  for(const l of (folder.links||[])){
    const linkRow = el("div",{className:"tree-row"});
    
    // Add checkbox for links in delete mode
    if (deleteMode) {
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "tree-checkbox";
      cb.dataset.id = l.id;
      cb.addEventListener("change", e => {
        e.target.checked ? selectedNodes.add(l.id) : selectedNodes.delete(l.id);
      });
      linkRow.append(cb);
    }
    
    const a = el("a",{className:"bookmark", href:l.url, target:"_blank", rel:"noopener"});
    a.textContent = l.title || l.url;
    if (!deleteMode) {
      a.draggable = true;
      a.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", l.id || "");
        e.dataTransfer.effectAllowed = "move";
      });
    }
    linkRow.append(a);
    wrap.append(linkRow);
  }
  // Subfolders
  for(const sub of (folder.children||[])){
    wrap.append(renderFolder(sub,state));
  }

  // Expand/collapse
  function toggleOpen(){
    open = !open;
    state[idKey] = open;
    chrome.storage.local.set({folderState: state});
    twist.textContent = open ? "–" : "+";
    wrap.classList.toggle("expanded", open);
    wrap.classList.toggle("collapsed", !open);
  }
  twist.addEventListener("click", toggleOpen);
  label.addEventListener("click", toggleOpen);

  // Drag-over / drop target (disabled in delete mode)
  if (!deleteMode) {
    card.addEventListener("dragover", e => { e.preventDefault(); card.classList.add("folder-drop"); });
    card.addEventListener("dragleave", () => card.classList.remove("folder-drop"));
    card.addEventListener("drop", async e => {
      e.preventDefault(); card.classList.remove("folder-drop");
      const id = e.dataTransfer.getData("text/plain");
      if (!id) return;
      await chrome.runtime.sendMessage({ action:"moveBookmark", id, targetId: folder.id });
      renderTree();
    });

    // Right-click context menu
    label.addEventListener("contextmenu", e => {
      e.preventDefault();
      openContextMenu(e.pageX, e.pageY, folder.id, folder.title);
    });

    // ---- Inline rename on double-click ----
    label.addEventListener("dblclick", () => {
      if (deleteMode) return; // skip if delete mode active
      const currentTitle = folder.title;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentTitle;
      input.className = "rename-input";
      label.replaceWith(input);
      input.focus();
      input.select();

      // ✅ Finish + animate rename confirmation
      const finish = async (save) => {
        const newName = save ? input.value.trim() : currentTitle;
        if (save && newName && newName !== currentTitle) {
          try {
            const response = await chrome.runtime.sendMessage({ action: "renameNode", id: folder.id, title: newName });
            if (response?.success) {
              // Update the folder object's title for immediate feedback
              folder.title = newName;
              await renderTree();

              // highlight renamed folder briefly
              setTimeout(() => {
                const allTitles = document.querySelectorAll(".folder-title");
                for (const el of allTitles) {
                  const titleText = el.textContent.replace(/^📁\s*/, ''); // Remove folder emoji
                  if (titleText === newName) {
                    el.classList.add("folder-renamed");
                    setTimeout(() => el.classList.remove("folder-renamed"), 900);
                    break;
                  }
                }
              }, 100); // Small delay to ensure DOM update
            } else {
              console.error("Failed to rename folder");
              renderTree(); // revert on failure
            }
          } catch (error) {
            console.error("Error renaming folder:", error);
            renderTree(); // revert on error
          }
        } else {
          renderTree(); // no change or cancelled
        }
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
      });
      input.addEventListener("blur", () => finish(true));
    });
  }

  card.append(wrap);
  return card;
}

async function renderTree(){
  const root = document.getElementById("bookmarkTree");
  root.textContent = "Loading…";
  const [tree, st] = await Promise.all([fetchTree(), chrome.storage.local.get("folderState")]);
  const state = st.folderState || {};
  root.textContent = "";
  for(const f of tree){
    if (f.title === "Unsorted") f.title = "Other";
    root.append(renderFolder(f, state));
  }
}

// ------- Context menu helpers -------
const menu = document.getElementById("contextMenu");
let menuFolderId = null;

function openContextMenu(x, y, folderId, folderTitle){
  menuFolderId = folderId;
  menu.style.top = `${y}px`;
  menu.style.left = `${x}px`;
  menu.classList.remove("hidden");
}
document.addEventListener("click", () => menu.classList.add("hidden"));

menu.addEventListener("click", async (e) => {
  const item = e.target.closest(".menu-item");
  if (!item) return;
  const action = item.dataset.action;
  if (!menuFolderId) return;

  if (action === "new-folder") {
    const name = prompt("New folder name:");
    if (name) await chrome.runtime.sendMessage({ action:"createFolder", parentId: menuFolderId, name });
  } else if (action === "rename") {
    const name = prompt("New name:");
    if (name && name.trim()) {
      try {
        const response = await chrome.runtime.sendMessage({ action:"renameNode", id: menuFolderId, title: name.trim() });
        if (!response?.success) {
          console.error("Failed to rename folder");
        }
      } catch (error) {
        console.error("Error renaming folder:", error);
      }
    }
  } else if (action === "delete") {
    if (confirm("Delete this folder and all of its contents?")) {
      await chrome.runtime.sendMessage({ action:"deleteNode", id: menuFolderId });
    }
  }
  menu.classList.add("hidden");
  renderTree();
});

// Initial render
renderTree();

// ---- Info toggle button ----
document.getElementById("toggleInfo")?.addEventListener("click", () => {
  const headerSection = document.querySelector(".header-section");
  const isHidden = headerSection.classList.contains("hidden");
  
  if (isHidden) {
    headerSection.classList.remove("hidden");
  } else {
    headerSection.classList.add("hidden");
  }
  
  // Save preference to storage
  chrome.storage.local.set({ headerHidden: !isHidden });
});

// Load header visibility preference on startup
chrome.storage.local.get(['headerHidden'], (result) => {
  if (result.headerHidden) {
    document.querySelector(".header-section")?.classList.add("hidden");
  }
});

// ---- Library control buttons ----
document.getElementById("btnNewFolder")?.addEventListener("click", async () => {
  const name = prompt("Enter new folder name:");
  if (!name) return;
  await chrome.runtime.sendMessage({ action: "createFolderInLavaRoot", name });
  renderTree();
});

document.getElementById("btnDefaults")?.addEventListener("click", async () => {
  const defaults = [
    "Music",
    "Social Media",
    "Forums",
    "News",
    "Health",
    "Finance",
    "Work Flow",
    "Blogs",
    "Entertainment",
    "Games",
    "Other"
  ];
  await chrome.runtime.sendMessage({ action: "createDefaultFolders", defaults });
  renderTree();
});

// ---- Add Link Button ----
const addLinkBtn = document.getElementById("addLinkBtn");
const addLinkModal = document.getElementById("addLinkModal");
const saveLinkBtn = document.getElementById("saveLinkBtn");
const cancelLinkBtn = document.getElementById("cancelLinkBtn");
const linkFolderSelect = document.getElementById("linkFolder");

addLinkBtn?.addEventListener("click", async () => {
  // populate dropdown with folders
  const tree = await chrome.bookmarks.getTree();
  const folders = [];
  const traverse = (nodes) => {
    for (const node of nodes) {
      if (node.url === undefined) folders.push(node);
      if (node.children) traverse(node.children);
    }
  };
  traverse(tree);
  
  linkFolderSelect.innerHTML = "";
  folders.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.title || "(Unnamed Folder)";
    linkFolderSelect.appendChild(opt);
  });

  addLinkModal.classList.remove("hidden");
});

// Cancel adding link
cancelLinkBtn?.addEventListener("click", () => {
  addLinkModal.classList.add("hidden");
  document.getElementById("linkUrl").value = "";
  document.getElementById("linkTitle").value = "";
});

// Save link to selected folder
saveLinkBtn?.addEventListener("click", async () => {
  const url = document.getElementById("linkUrl").value.trim();
  let title = document.getElementById("linkTitle").value.trim();
  const folderId = linkFolderSelect.value;

  if (!url) {
    alert("Please enter a valid URL.");
    return;
  }

  if (!title) title = url.replace(/^https?:\/\//, "").split("/")[0]; // fallback title

  try {
    await chrome.bookmarks.create({ parentId: folderId, title, url });
    alert(`Added "${title}" to folder successfully!`);
    addLinkModal.classList.add("hidden");
    document.getElementById("linkUrl").value = "";
    document.getElementById("linkTitle").value = "";
    renderTree(); // refresh view
  } catch (err) {
    console.error("Failed to add link:", err);
    alert("Error adding bookmark.");
  }
});

// ---- Delete Mode ----
document.getElementById("btnDeleteMode")?.addEventListener("click", () => {
  deleteMode = !deleteMode;
  document.getElementById("deleteBar").style.display = deleteMode ? "block" : "none";
  selectedNodes.clear();
  renderTree();
});

document.getElementById("btnConfirmDelete")?.addEventListener("click", async () => {
  if (selectedNodes.size === 0) return alert("No items selected.");
  if (!confirm(`Delete ${selectedNodes.size} selected item(s)?`)) return;
  for (const id of selectedNodes) {
    await chrome.runtime.sendMessage({ action: "deleteNode", id });
  }
  selectedNodes.clear();
  deleteMode = false;
  document.getElementById("deleteBar").style.display = "none";
  renderTree();
});

/* Toggles (kept same behavior) */
(async function initToggles(){
  const auto = document.getElementById("autoSortToggle");
  const alarm = document.getElementById("alarmToggle");
  const st = await chrome.storage.local.get(["autoSortEnabled","alarmEnabled"]);
  if (auto) auto.checked = !!st.autoSortEnabled;
  if (alarm) alarm.checked = !!st.alarmEnabled;
  auto?.addEventListener("change", async ()=> chrome.runtime.sendMessage({action:"toggleAutoSort",enabled:auto.checked}));
  alarm?.addEventListener("change", async ()=> chrome.runtime.sendMessage({action:"toggleAlarm",enabled:alarm.checked}));
})();

// ---- Donation copy buttons ----
document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const text = document.getElementById(targetId).innerText;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = "Copy", 1500);
    });
  });
});

// ---- Version display ----
const version = chrome.runtime.getManifest().version;
document.getElementById("versionDisplay").textContent = `Lava Library v${version}`;
