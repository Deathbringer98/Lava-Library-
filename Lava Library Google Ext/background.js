// Lava Library Bookmark Organizer
const categoryMap = {
  // 🔹 Social Media
  "twitter.com": ["Social Media", "Twitter", "Posts"],
  "reddit.com": ["Social Media", "Reddit", "Threads"],
  "facebook.com": ["Social Media", "Facebook", "Posts"],
  "instagram.com": ["Social Media", "Instagram", "Photos"],
  "threads.net": ["Social Media", "Threads", "Posts"],
  "tiktok.com": ["Social Media", "TikTok", "Videos"],
  "truthsocial.com": ["Social Media", "Truth Social", "Posts"],

  // 🔹 Streaming & Media
  "youtube.com": ["Media", "YouTube", "Videos"],
  "rumble.com": ["Media", "Rumble", "Videos"],
  "bitchute.com": ["Media", "BitChute", "Videos"],
  "kick.com": ["Media", "Kick", "Streams"],
  "twitch.tv": ["Media", "Twitch", "Streams"],
  "netflix.com": ["Media", "Netflix", "Movies"],
  "hulu.com": ["Media", "Hulu", "Shows"],
  "disneyplus.com": ["Media", "Disney+", "Movies"],
  "hbomax.com": ["Media", "HBO Max", "Movies"],
  "primevideo.com": ["Media", "Prime Video", "Movies"],
  "paramountplus.com": ["Media", "Paramount+", "Shows"],
  "peacocktv.com": ["Media", "Peacock", "Shows"],
  "apple.com": ["Media", "Apple TV+", "Shows"],
  "crunchyroll.com": ["Media", "Crunchyroll", "Anime"],
  "funimation.com": ["Media", "Funimation", "Anime"],
  "spotify.com": ["Media", "Spotify", "Music"],
  "soundcloud.com": ["Media", "SoundCloud", "Music"],
  "pandora.com": ["Media", "Pandora", "Music"],

  // 🔹 Tools & Utilities
  "chat.openai.com": ["Tools", "AI Tools", "ChatGPT"],
  "perplexity.ai": ["Tools", "AI Tools", "Perplexity"],
  "canva.com": ["Tools", "Design Tools", "Canva"],
  "remove.bg": ["Tools", "Design Tools", "RemoveBG"],
  "tinyurl.com": ["Tools", "Utilities", "Shorteners"],
  "bitly.com": ["Tools", "Utilities", "Shorteners"],
  "notion.so": ["Tools", "Productivity", "Notion"],
  "trello.com": ["Tools", "Productivity", "Trello"],
  "dropbox.com": ["Tools", "Storage", "Dropbox"],
  "drive.google.com": ["Tools", "Storage", "Google Drive"],
  "wetransfer.com": ["Tools", "Storage", "WeTransfer"],

  // 🔹 Business / Work / Finance
  "linkedin.com": ["Business", "Networking", "LinkedIn"],
  "indeed.com": ["Business", "Job Search", "Indeed"],
  "glassdoor.com": ["Business", "Job Search", "Glassdoor"],
  "quickbooks.intuit.com": ["Business", "Finance Tools", "QuickBooks"],
  "paypal.com": ["Business", "Payments", "PayPal"],
  "stripe.com": ["Business", "Payments", "Stripe"],
  "wise.com": ["Business", "Payments", "Wise"],
  "xero.com": ["Business", "Finance Tools", "Xero"],
  "shopify.com": ["Business", "E-Commerce", "Shopify"],
  "squarespace.com": ["Business", "E-Commerce", "Squarespace"],

  // 🔹 Gaming
  "store.steampowered.com": ["Gaming", "Stores", "Steam"],
  "epicgames.com": ["Gaming", "Stores", "Epic Games"],
  "gog.com": ["Gaming", "Stores", "GOG"],
  "origin.com": ["Gaming", "Stores", "Origin"],
  "ea.com": ["Gaming", "Publishers", "Electronic Arts"],
  "blizzard.com": ["Gaming", "Publishers", "Blizzard"],
  "playstation.com": ["Gaming", "Consoles", "PlayStation"],
  "xbox.com": ["Gaming", "Consoles", "Xbox"],
  "nintendo.com": ["Gaming", "Consoles", "Nintendo"],
  "itch.io": ["Gaming", "Indie", "itch.io"],

  // 🔹 Education / Learning
  "coursera.org": ["Education", "Courses", "Coursera"],
  "udemy.com": ["Education", "Courses", "Udemy"],
  "edx.org": ["Education", "Courses", "edX"],
  "khanacademy.org": ["Education", "Academic", "Khan Academy"],
  "brilliant.org": ["Education", "STEM", "Brilliant"],
  "skillshare.com": ["Education", "Creative", "Skillshare"],
  "duolingo.com": ["Education", "Languages", "Duolingo"],

  // 🔹 Classic Web Games
  "newgrounds.com": ["Classic Web Games", "Newgrounds", "Flash/Indie"],
  "addictinggames.com": ["Classic Web Games", "Addicting Games", "Arcade"],
  "andkon.com": ["Classic Web Games", "Andkon", "Arcade"],
  "armorgames.com": ["Classic Web Games", "Armor Games", "Browser"],
  "kongregate.com": ["Classic Web Games", "Kongregate", "Browser"],

  // 🔹 Forums
  "4chan.org": ["Forums", "4chan", "Boards"],
  "neogaf.com": ["Forums", "NeoGAF", "Gaming"],
  "resetera.com": ["Forums", "ResetEra", "Gaming"],
  "linustechtips.com": ["Forums", "LTT", "Tech"],
  "tomshardware.com": ["Forums", "TomsHardware", "Tech"],

  // 🔹 Encyclopedia / Wiki
  "wikipedia.org": ["Encyclopedia", "Wikipedia", "General"],
  "fandom.com": ["Encyclopedia", "Fandom", "Gaming"],
  "wiki.archlinux.org": ["Encyclopedia", "ArchWiki", "Linux/Tech"],

  // 🔹 Shopping
  "amazon.com": ["Shopping", "Amazon", "Online Store"],
  "ebay.com": ["Shopping", "eBay", "Auctions"],
  "etsy.com": ["Shopping", "Etsy", "Handmade"],
  "alibaba.com": ["Shopping", "Alibaba", "Wholesale"],
  "shein.com": ["Shopping", "Shein", "Fashion"],
  "temu.com": ["Shopping", "Temu", "Discount Retail"],

  // 🔹 Crypto
  "coinmarketcap.com": ["Crypto", "Trackers", "CoinMarketCap"],
  "coingecko.com": ["Crypto", "Trackers", "CoinGecko"],
  "coinbase.com": ["Crypto", "Exchanges", "Coinbase"],
  "binance.com": ["Crypto", "Exchanges", "Binance"],
  "kraken.com": ["Crypto", "Exchanges", "Kraken"],
  "metamask.io": ["Crypto", "Wallets", "MetaMask"],
  "ledger.com": ["Crypto", "Wallets", "Ledger"],
  "etherscan.io": ["Crypto", "Explorers", "Etherscan"],

  // 🔹 Privacy / Burner Tools
  "guerrillamail.com": ["Privacy", "Burner Email", "Guerrilla Mail"],
  "mailinator.com": ["Privacy", "Burner Email", "Mailinator"],
  "10minutemail.com": ["Privacy", "Burner Email", "10MinuteMail"],
  "hushed.com": ["Privacy", "Burner Phone", "Hushed"],

  // 🔹 Privacy / VPNs
  "nordvpn.com": ["Privacy", "VPN", "NordVPN"],
  "expressvpn.com": ["Privacy", "VPN", "ExpressVPN"],
  "surfshark.com": ["Privacy", "VPN", "Surfshark"],
  "protonvpn.com": ["Privacy", "VPN", "ProtonVPN"],
  "windscribe.com": ["Privacy", "VPN", "Windscribe"],
  "tunnelbear.com": ["Privacy", "VPN", "TunnelBear"],
  "cyberghost.com": ["Privacy", "VPN", "CyberGhost"],
  "privateinternetaccess.com": ["Privacy", "VPN", "Private Internet Access"],
  "ipvanish.com": ["Privacy", "VPN", "IPVanish"],
  "vyprvpn.com": ["Privacy", "VPN", "VyprVPN"]
};

// --- Core functions ---

async function ensureFolderPath(pathParts, parentId = "1") {
  let currentParent = parentId;
  for (const part of pathParts) {
    const existing = await chrome.bookmarks.search({ title: part });
    let folder = existing.find(f => f.parentId === currentParent && !f.url);
    if (!folder) folder = await chrome.bookmarks.create({ parentId: currentParent, title: part });
    currentParent = folder.id;
  }
  return currentParent;
}

async function sortBookmark(bookmark) {
  if (!bookmark.url) return;
  try {
    const url = new URL(bookmark.url);
    const host = url.hostname.replace(/^www\\./, "");
    const mapping = categoryMap[host];
    if (mapping) {
      const folderId = await ensureFolderPath(mapping);
      await chrome.bookmarks.move(bookmark.id, { parentId: folderId });
    }
  } catch (err) {
    console.error("Sort error:", err);
  }
}

chrome.bookmarks.onCreated.addListener((_id, bookmark) => {
  chrome.storage.local.get(["autoSortEnabled"], ({ autoSortEnabled }) => {
    if (autoSortEnabled) sortBookmark(bookmark);
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "sortAll") {
    chrome.bookmarks.getTree(async (tree) => {
      const traverse = async (nodes) => {
        for (const n of nodes) {
          if (n.url) await sortBookmark(n);
          if (n.children) await traverse(n.children);
        }
      };
      await traverse(tree);
    });
  }
});