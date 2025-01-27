document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("yourButtonId")
    .addEventListener("click", async function () {
      const selectedText = getSelectedText();
      if (selectedText) {
        const response = await callAIAPI(selectedText);
        console.log(response);
      } else {
        console.log("No text selected");
      }
    });
});

function getSelectedText() {
  return window.getSelection().toString();
}

async function callAIAPI(selectedText) {
  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_API_KEY",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: selectedText },
          ],
          model: "deepseek-chat",
        }),
      }
    );

    const data = await response.json();
    console.log(data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
  }
}
