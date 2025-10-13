document.addEventListener("DOMContentLoaded", () => {
  const autoSort = document.getElementById("autoSort");
  const sortAll = document.getElementById("sortAll");

  chrome.storage.local.get(["autoSortEnabled"], ({ autoSortEnabled }) => {
    autoSort.checked = !!autoSortEnabled;
  });

  autoSort.addEventListener("change", () => {
    chrome.storage.local.set({ autoSortEnabled: autoSort.checked });
  });

  sortAll.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "sortAll" });
  });
});
