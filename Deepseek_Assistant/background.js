// Create context menu items for all available functions
const menuItems = [
  { id: "translate-vi", title: "Dịch sang tiếng Việt" },
  { id: "translate-en", title: "Translate to English" },
  { id: "rewrite", title: "Rewrite Text" },
  { id: "summarize", title: "Summarize Text" },
  { id: "answer", title: "Answer Question" },
];

menuItems.forEach((item) => {
  chrome.contextMenus.create({
    id: item.id,
    title: item.title,
    contexts: ["selection"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["popup.js"],
    },
    async () => {
      let response;

      switch (info.menuItemId) {
        case "translate-vi":
          response = await call_translate_to_Vietnamese(selectedText);
          break;
        case "translate-en":
          response = await call_translate_to_English(selectedText);
          break;
        case "rewrite":
          response = await call_rewrite_text(selectedText);
          break;
        case "summarize":
          response = await call_summarize_text(selectedText);
          break;
        case "answer":
          response = await call_answer_question(selectedText);
          break;
      }

      if (response) {
        alert(response);
      }
    }
  );
});
