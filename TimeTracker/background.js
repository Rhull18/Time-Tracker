let activeTabUrl = null;
let startTime = Date.now();

// Helper to extract domain name
function getDomain(url) {
  try {
    let domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (e) {
    return null;
  }
}

// Save accumulated time for the previous site
function saveTime() {
  if (!activeTabUrl) return;

  const domain = getDomain(activeTabUrl);
  if (!domain) return;

  const elapsed = Math.round((Date.now() - startTime) / 1000); // in seconds
  if (elapsed <= 0) return;

  chrome.storage.local.get([domain], (result) => {
    const currentTotal = result[domain] || 0;
    chrome.storage.local.set({ [domain]: currentTotal + elapsed });
  });

  startTime = Date.now();
}

// Track when active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  saveTime();
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      activeTabUrl = tab.url;
    }
  });
});

// Track when a tab updates its URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    saveTime();
    activeTabUrl = changeInfo.url;
  }
});
