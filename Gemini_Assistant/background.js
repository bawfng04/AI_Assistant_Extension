chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    handleTranslation(request.text, sendResponse);
    return true; // Indicate async response
  }
});

async function handleTranslation(text, sendResponse) {
  try {
    const { apiKey } = await chrome.storage.local.get(["apiKey"]);

    if (!apiKey) {
      sendResponse({
        error: "Vui lòng nhập API Key trong phần cài đặt extension",
      });
      return;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Dịch chính xác sang tiếng Việt một cách tự nhiên nhất: "${text}". Chỉ trả về bản dịch, không thêm text nào khác`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const translation = data.candidates[0].content.parts[0].text;
    sendResponse({ translation });
  } catch (error) {
    sendResponse({ error: `Lỗi dịch thuật: ${error.message}` });
  }
}
