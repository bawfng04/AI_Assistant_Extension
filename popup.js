const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

import OpenAI from "openai-api";

const openai = new OpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
});

document.getElementById("translate-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getSelectedText,
    },
    async (results) => {
      const selectedText = results[0].result;
      if (selectedText) {
        const response = await callAIAPI(
          "dịch *selection ra tiếng Việt",
          selectedText
        );
        alert(response.result);
      }
    }
  );
});

document.getElementById("rewrite-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getSelectedText,
    },
    async (results) => {
      const selectedText = results[0].result;
      if (selectedText) {
        const response = await callAIAPI(
          "viết lại *selection theo một văn phong khác",
          selectedText
        );
        alert(response.result);
      }
    }
  );
});

function getSelectedText() {
  return window.getSelection().toString();
}

async function callAIAPI() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}
