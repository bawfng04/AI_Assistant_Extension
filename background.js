chrome.contextMenus.create({
  id: "translate",
  title: "Dịch sang tiếng Việt",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate") {
    const selectedText = info.selectionText;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (text) => {
        alert(`Kết quả dịch: ${text}`);
      },
      args: [selectedText],
    });
  }
});
