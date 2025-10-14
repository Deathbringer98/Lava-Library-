// Lava Library Bookmark Organizer
let categoryMap = {
  "Social Media": {
    "Twitter": ["twitter.com"],
    "Reddit": ["reddit.com"],
    "Facebook": ["facebook.com"],
    "Instagram": ["instagram.com"],
    "TikTok": ["tiktok.com"],
    "Threads": ["threads.net"],
    "Truth Social": ["truthsocial.com"]
  },
  "Streaming": {
    "YouTube": ["youtube.com"],
    "Netflix": ["netflix.com"],
    "Twitch": ["twitch.tv"],
    "Kick": ["kick.com"]
  },
  "News": {
    "BBC": ["bbc.com"],
    "CNN": ["cnn.com"],
    "Yahoo News": ["news.yahoo.com"]
  },
  "Shopping": {
    "Amazon": ["amazon.com"],
    "eBay": ["ebay.com"],
    "Etsy": ["etsy.com"],
    "Temu": ["temu.com"],
    "Shein": ["shein.com"],
    "Alibaba": ["alibaba.com"]
  },
  "Crypto": {
    "CoinMarketCap": ["coinmarketcap.com"],
    "CoinGecko": ["coingecko.com"],
    "Binance": ["binance.com"]
  }
};

// Utility: Create or get folder by name
async function getOrCreateFolder(title, parentId = "1") {
  return new Promise((resolve) => {
    chrome.bookmarks.search({ title }, (results) => {
      const existing = results.find(b => b.title === title && b.parentId === parentId);
      if (existing) return resolve(existing.id);
      chrome.bookmarks.create({ parentId, title }, (newFolder) => resolve(newFolder.id));
    });
  });
}

// Main sorting function
async function sortAllBookmarks() {
  const rootFolder = await getOrCreateFolder("Lava Library");

  chrome.bookmarks.getTree(async (tree) => {
    const bookmarks = extractBookmarks(tree);

    for (const bm of bookmarks) {
      const domain = bm.url.match(/:\/\/(www\.)?([^/]+)/);
      if (!domain) continue;

      const domainName = domain[2].toLowerCase();
      let targetCategory = null;
      let targetSubfolder = null;

      for (const [cat, subs] of Object.entries(categoryMap)) {
        for (const [sub, domains] of Object.entries(subs)) {
          if (domains.some(d => domainName.includes(d))) {
            targetCategory = cat;
            targetSubfolder = sub;
            break;
          }
        }
        if (targetCategory) break;
      }

      if (targetCategory && targetSubfolder) {
        const catFolder = await getOrCreateFolder(targetCategory, rootFolder);
        const subFolder = await getOrCreateFolder(targetSubfolder, catFolder);
        chrome.bookmarks.move(bm.id, { parentId: subFolder });
      } else {
        // Uncategorized → Misc
        const miscFolder = await getOrCreateFolder("Miscellaneous", rootFolder);
        chrome.bookmarks.move(bm.id, { parentId: miscFolder });
      }
    }

    console.log("✅ Bookmarks sorted successfully!");
  });
}

// Helper: recursively extract bookmarks
function extractBookmarks(nodes) {
  let list = [];
  for (const node of nodes) {
    if (node.url) list.push(node);
    if (node.children) list = list.concat(extractBookmarks(node.children));
  }
  return list;
}

// Listen for popup action
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "sortAllBookmarks") {
    sortAllBookmarks().then(() => sendResponse({ success: true }));
    return true;
  }
});
