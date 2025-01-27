const BASE_URL = "https://api.deepseek.com";
const API_KEY = "sk-c6387f8ffb7b4c8980b318c83b6f73e5";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("TranslateTextButton")
    .addEventListener("click", async function () {
      console.log("Button clicked");
      alert("Button clicked");
      const selectedText = await getSelectedText();
      if (selectedText) {
        alert("selectedText: " + selectedText);
        const response = await callAIAPI(selectedText);

        if (response) {
          alert("response: " + response);
          document.getElementById("result").innerText = response;
        } else {
          alert("No response from API");
          document.getElementById("result").innerText = "No response from API";
        }
      } else {
        console.log("No text selected");
        alert("No text selected");
      }
    });
});

// lấy text được chọn
async function getSelectedText() {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript(
      {
        code: "window.getSelection().toString();",
      },
      (selection) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(selection[0]);
        }
      }
    );
  });
}

async function callAIAPI(selectedText) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: selectedText },
        ],
        model: "deepseek-chat",
      }),
    });

    const data = await response.json();
    console.log(data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return null;
  }
}
