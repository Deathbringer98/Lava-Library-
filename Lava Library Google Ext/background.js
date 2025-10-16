// Phase 5.2 — background APIs for DnD + context menu + ID-rich tree
// (keeps Phase 5.1 sorting, categories, and learning logic)

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg.action) {
        case "sortAll":
        case "sortAllBookmarks":
          await sortAllBookmarks();
          sendResponse({ success: true });
          break;

        case "getStats": {
          const { lastRunStats = null } = await chrome.storage.local.get("lastRunStats");
          sendResponse({ success: true, lastRunStats });
          break;
        }

        case "getOrganizedTree": {
          const tree = await buildOrganizedTree(true);
          sendResponse({ success: true, tree });
          break;
        }

        // 🟢 NEW ACTIONS
        case "createFolderInLavaRoot": {
          const lava = await getLavaRoot();
          const title = String(msg.name || "New Folder");
          await chrome.bookmarks.create({ parentId: lava.id, title });
          sendResponse({ success: true });
          break;
        }

        case "createDefaultFolders": {
          const lava = await getLavaRoot();
          const defaults = msg.defaults || [
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
          const existing = new Set((await chrome.bookmarks.getChildren(lava.id)).map(k => k.title));
          for (const name of defaults) {
            if (!existing.has(name)) {
              await chrome.bookmarks.create({ parentId: lava.id, title: name });
            }
          }
          sendResponse({ success: true });
          break;
        }

        case "createFolder":
          await chrome.bookmarks.create({
            parentId: String(msg.parentId),
            title: String(msg.name || "New Folder")
          });
          sendResponse({ success: true });
          break;

        case "renameNode":
          await chrome.bookmarks.update(String(msg.id), {
            title: String(msg.title || "")
          });
          sendResponse({ success: true });
          break;

        case "deleteNode": {
          const [n] = await chrome.bookmarks.get(String(msg.id));
          if (!n) {
            sendResponse({ success: false });
            break;
          }
          if (n.url) await chrome.bookmarks.remove(n.id);
          else await chrome.bookmarks.removeTree(n.id);
          sendResponse({ success: true });
          break;
        }

        case "moveBookmark":
          await chrome.bookmarks.move(String(msg.id), {
            parentId: String(msg.targetId)
          });
          sendResponse({ success: true });
          break;

        case "toggleAutoSort":
          await chrome.storage.local.set({ autoSortEnabled: !!msg.enabled });
          sendResponse({ success: true });
          break;

        case "toggleAlarm":
          await chrome.storage.local.set({ alarmEnabled: !!msg.enabled });
          configureAlarm(!!msg.enabled);
          sendResponse({ success: true });
          break;

        default:
          console.warn("Unknown message:", msg.action);
          sendResponse({ success: false, error: "Unknown action" });
      }
    } catch (e) {
      console.warn("Background error:", e);
      sendResponse({ success: false, error: String(e?.message || e) });
    }
  })();
  return true;
});

// ---- defaults + alarm ----
(async () => {
  const defaults = { autoSortEnabled:true, alarmEnabled:false, userDomainMap:{} };
  const curr = await chrome.storage.local.get(Object.keys(defaults));
  const setMissing={}; for (const [k,v] of Object.entries(defaults)) if (curr[k]===undefined) setMissing[k]=v;
  if (Object.keys(setMissing).length) await chrome.storage.local.set(setMissing);
  configureAlarm(curr.alarmEnabled ?? defaults.alarmEnabled);
})();
chrome.alarms.onAlarm.addListener(a => { if (a.name==="lavaLibraryAuto") sortAllBookmarks().catch(()=>{}); });
async function configureAlarm(enabled){ await chrome.alarms.clear("lavaLibraryAuto"); if (enabled) chrome.alarms.create("lavaLibraryAuto",{periodInMinutes:30}); }

// ---------- Categories ----------
const STATIC_MAP = {
  // Social
  "twitter.com":["Social Media","Twitter"], "facebook.com":["Social Media","Facebook"],
  "instagram.com":["Social Media","Instagram"], "reddit.com":["Social Media","Reddit"],
  "tiktok.com":["Social Media","TikTok"],
  // Blogs
  "medium.com":["Blogs","Medium"], "substack.com":["Blogs","Substack"], "wordpress.com":["Blogs","WordPress"],
  "blogspot.com":["Blogs","Blogspot"], "dev.to":["Blogs","Dev Community"], "hashnode.com":["Blogs","Hashnode"],
  // News
  "bbc.com":["News","World"], "cnn.com":["News","World"], "nytimes.com":["News","World"], "reuters.com":["News","Business"],
  // Finance
  "coinmarketcap.com":["Finance","Crypto"], "coingecko.com":["Finance","Crypto"],
  "binance.com":["Finance","Exchange"], "kraken.com":["Finance","Exchange"],
  // Misc
  "youtube.com":["Entertainment","Video"], "twitch.tv":["Entertainment","Streaming"]
};
function guessCategory(bm){
  const url=(bm.url||"").toLowerCase(), title=(bm.title||"").toLowerCase();
  if (url.includes("blog")||title.includes("blog")) return ["Blogs","General"];
  if (url.includes("news")) return ["News","General"];
  if (url.includes("finance")||url.includes("bank")) return ["Finance","General"];
  if (url.includes("game")) return ["Games","General"];
  if (url.includes("forum")) return ["Forums","General"];
  return ["Other"];
}
function domainOf(url){ try { return new URL(url).hostname.replace(/^www\./,""); } catch { return ""; } }

// ---------- Helpers ----------
async function getLavaRoot(){
  const [root] = await chrome.bookmarks.getTree();
  const other = (root.children||[]).find(c=>!c.url && c.title==="Other bookmarks");
  const parentId = other?.id || "1"; // fallback to Bookmarks Bar
  const kids = await chrome.bookmarks.getChildren(parentId);
  let folder = kids.find(k=>!k.url && k.title==="Lava Library");
  if (!folder) folder = await chrome.bookmarks.create({ parentId, title:"Lava Library" });
  return folder;
}
async function ensureFolder(title, parentId){
  const kids = await chrome.bookmarks.getChildren(parentId);
  let f = kids.find(k=>!k.url && k.title===title);
  if (!f) f = await chrome.bookmarks.create({ parentId, title });
  return f;
}
async function ensurePath(rootId, path){
  let parent = await ensureFolder(path[0], rootId);
  for (let i=1;i<path.length;i++) parent = await ensureFolder(path[i], parent.id);
  return parent;
}
function flatten(nodes, out=[]){ for (const n of nodes){ if (n.url) out.push(n); if (n.children) flatten(n.children,out);} return out; }
async function isDesc(childId, ancestorId){
  let id=childId;
  while(id){
    const [n]=await chrome.bookmarks.get(id); if (!n) return false;
    if (n.parentId===ancestorId) return true;
    id=n.parentId;
  }
  return false;
}
async function learnUserCategories(lavaRootId){
  const map={};
  const top=await chrome.bookmarks.getChildren(lavaRootId);
  for (const cat of top.filter(c=>!c.url)){
    const subs=await chrome.bookmarks.getChildren(cat.id);
    for (const sub of subs.filter(s=>!s.url)){
      const links=await chrome.bookmarks.getChildren(sub.id);
      if (links.some(l=>!!l.url)) map[sub.title]=cat.title;
    }
  }
  return map;
}

// ---------- Sorting ----------
async function sortAllBookmarks(){
  const started=Date.now();
  const [root] = await chrome.bookmarks.getTree();
  const lavaRoot = await getLavaRoot();
  const learned = await learnUserCategories(lavaRoot.id);
  const { userDomainMap={} } = await chrome.storage.local.get("userDomainMap");
  const userMap = { ...userDomainMap, ...learned };

  const all=[]; for (const n of root.children||[]) if (n.children) flatten(n.children,all);
  const total=all.length||1; const seen=new Set();
  let moved=0, dupes=0, skippedRoot=0;

  for (let i=0;i<all.length;i++){
    const bm = all[i];
    if (!bm.url) continue;
    chrome.runtime.sendMessage({ action:"progressUpdate", current:i+1, total }).catch(()=>{});

    if (await isDesc(bm.id, "0")) { skippedRoot++; continue; }               // never touch virtual root
    if (await isDesc(bm.parentId, lavaRoot.id)) continue;                    // already inside Lava
    if (seen.has(bm.url)) { dupes++; continue; } seen.add(bm.url);

    const domain = domainOf(bm.url);
    const cat = STATIC_MAP[domain] || (userMap[domain] ? [userMap[domain], domain] : guessCategory(bm));
    const target = await ensurePath(lavaRoot.id, Array.isArray(cat) ? cat : [cat]);

    const kids = await chrome.bookmarks.getChildren(target.id);
    if (kids.some(k=>k.url===bm.url)) { dupes++; continue; }

    try { await chrome.bookmarks.move(bm.id, { parentId: target.id }); moved++; }
    catch(e){ if(!String(e?.message||"").includes("root")) console.warn("move fail",e); }
  }

  await sortAlpha(lavaRoot.id);

  const stats = { moved, duplicates:dupes, skippedRoot, totalSeen:all.length, durationSec:Math.round((Date.now()-started)/1000), ranAt:new Date().toISOString() };
  await chrome.storage.local.set({ lastRunStats: stats, userDomainMap: userMap });
  chrome.runtime.sendMessage({ action:"progressDone" }).catch(()=>{});
  console.log("✅ Sorting complete — stats:", stats);
}

async function sortAlpha(folderId){
  const kids = await chrome.bookmarks.getChildren(folderId);
  const folders = kids.filter(k=>!k.url).sort((a,b)=>(a.title||"").localeCompare(b.title||""));
  const links = kids.filter(k=>k.url).sort((a,b)=>(a.title||"").localeCompare(b.title||""));
  let idx=0;
  for (const f of folders){ try { await chrome.bookmarks.move(f.id,{ parentId:folderId, index:idx++ }); await sortAlpha(f.id); } catch{} }
  for (const l of links){ try { await chrome.bookmarks.move(l.id,{ parentId:folderId, index:idx++ }); } catch{} }
}

// ---------- Tree for popup (include IDs for DnD / context menu) ----------
async function buildOrganizedTree(includeIds=false){
  const lava = await getLavaRoot();

  async function build(nodeId){
    const kids = await chrome.bookmarks.getChildren(nodeId);
    const folders = kids.filter(k=>!k.url).sort((a,b)=>(a.title||"").localeCompare(b.title||""));
    const links = kids.filter(k=>k.url)
                      .sort((a,b)=>(a.title||"").localeCompare(b.title||""))
                      .map(k => includeIds ? ({ id:k.id, title:k.title, url:k.url }) : ({ title:k.title, url:k.url }));
    const out=[];
    for (const f of folders){
      const sublinks = (await chrome.bookmarks.getChildren(f.id))
                        .filter(k=>k.url)
                        .sort((a,b)=>(a.title||"").localeCompare(b.title||""))
                        .map(k => includeIds ? ({ id:k.id, title:k.title, url:k.url }) : ({ title:k.title, url:k.url }));
      out.push({
        id: includeIds ? f.id : undefined,
        title: f.title,
        links: sublinks,
        children: await build(f.id)
      });
    }
    return out;
  }

  const cats = await build(lava.id);
  const roots = (await chrome.bookmarks.getChildren(lava.id)).filter(k=>k.url);
  if (roots.length) cats.push({
    id: includeIds ? lava.id + ":root-links" : undefined,
    title:"Other",
    links: roots.sort((a,b)=>(a.title||"").localeCompare(b.title||"")).map(k => includeIds ? ({ id:k.id, title:k.title, url:k.url }) : ({ title:k.title, url:k.url })),
    children:[]
  });
  return cats;
}
