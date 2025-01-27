const BASE_URL = "https://api.deepseek.com";
const API_KEY = "sk-c6387f8ffb7b4c8980b318c83b6f73e5";

document.addEventListener("DOMContentLoaded", function () {
  const buttons = [
    { id: "TranslateTextButton", handler: call_translate_to_Vietnamese },
    { id: "RewriteTextButton", handler: call_rewrite_text },
    { id: "TranslateToEnglishButton", handler: call_translate_to_English },
    { id: "SummarizeTextButton", handler: call_summarize_text },
    { id: "AnswerQuestionButton", handler: call_answer_question },
  ];

  buttons.forEach(({ id, handler }) => {
    document.getElementById(id).addEventListener("click", async function () {
      const selectedText = await getSelectedText();
      if (selectedText) {
        const response = await handler(selectedText);
        if (response) {
          showResult(response);
        } else {
          showResult("Error calling DeepSeek API: No response");
        }
      } else {
        // console.log("No text selected");
        // alert("No text selected");
        showResult("No text selected");
      }
    });
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

// =========================================== Các hàm gọi API ===========================================
async function callDeepSeekAPI(systemContent, userContent) {
  const API_KEY = "sk-c6387f8ffb7b4c8980b318c83b6f73e5";

  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userContent },
          ],
          stream: false,
        }),
      }
    );

    if (response.status === 402) {
      throw new Error(
        "Payment required. Please check your API credits or billing status."
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API Error (${response.status}): ${
          errorData?.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    // console.error("Error calling DeepSeek API:", error);
    // alert(error.message);
    showResult("Error calling DeepSeek API: ", error.message);
    return null;
  }
}

// hiển thị kết quả vào result popup
function showResult(text) {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.textContent = text;

  // Adjust the position to ensure the popup is within the visible area
  const rect = resultDiv.getBoundingClientRect();
  const offset = 10; // Offset from the selected text

  let top = window.scrollY + rect.top - resultDiv.offsetHeight - offset;
  let left = window.scrollX + rect.left;

  // Ensure the popup is within the viewport
  if (top < 0) {
    top = window.scrollY + rect.bottom + offset;
  }
  if (left + resultDiv.offsetWidth > window.innerWidth) {
    left = window.innerWidth - resultDiv.offsetWidth - offset;
  }

  resultDiv.style.top = `${top}px`;
  resultDiv.style.left = `${left}px`;
}

// Các prompts
async function call_translate_to_Vietnamese(selectedText) {
  const systemContent =
    "You are a helpful assistant that translates text to Vietnamese. The user will provide you with text in English, and you should respond with the Vietnamese translation.";
  const userContent = `Translate this text to Vietnamese: ${selectedText}`;
  return await callDeepSeekAPI(systemContent, userContent);
}

async function call_translate_to_English(selectedText) {
  const systemContent =
    "You are a helpful assistant that translates text to English. The user will provide you with text, and you should respond with the English translation.";
  const userContent = `Translate this text to English: ${selectedText}`;
  return await callDeepSeekAPI(systemContent, userContent);
}

async function call_rewrite_text(selectedText) {
  const systemContent =
    "You are a helpful assistant that can rewrite text. The user will provide you with text in any language, and you should respond with a rewritten version of the text in the same language.";
  const userContent = `Help me rewrite the text in a different way: ${selectedText}`;
  return await callDeepSeekAPI(systemContent, userContent);
}

async function call_summarize_text(selectedText) {
  const systemContent =
    "You are a helpful assistant that can summarize text. The user will provide you with a long text, and you should respond with a short summary of the text.";
  const userContent = `Can you summarize this text for me? ${selectedText}`;
  return await callDeepSeekAPI(systemContent, userContent);
}

async function call_answer_question(selectedText) {
  const systemContent =
    "You are a helpful assistant that can answer questions. The user will provide you with a question, and you should respond with the answer.";
  const userContent = `Can you answer this question for me? ${selectedText}`;
  return await callDeepSeekAPI(systemContent, userContent);
}

