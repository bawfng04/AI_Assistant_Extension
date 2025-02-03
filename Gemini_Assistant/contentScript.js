let translateButton = null;

let debugging = true;

document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection().toString().trim();
  if (debugging) console.log("mouseup", selection);

  if (
    selection
    // && isEnglish(selection)
  ) {
    if (debugging) console.log("selection", selection);
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    showTranslateButton(selection, rect);
  }
});

function isEnglish(text) {
  return /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(text);
}

function showTranslateButton(text, rect) {
  if (debugging) {
    console.log("called showTranslateButton");
    console.log("text", text, "rect", rect);
  }
  removeTranslateButton();

  translateButton = document.createElement("div");
  translateButton.className = "translate-button";
  translateButton.innerHTML = `
    <button class="gemini-translate-btn">Dịch</button>
    <div class="translation-result"></div>
  `;

  if (debugging) console.log("translateButton --", translateButton);

  const button = translateButton.querySelector("button");
  const resultDiv = translateButton.querySelector(".translation-result");

  if (debugging) console.log("button", button, "resultDiv", resultDiv);

  translateButton.style.left = `${rect.left + window.scrollX}px`;
  translateButton.style.top = `${rect.bottom + window.scrollY + 5}px`;

  button.onclick = () => {
    if (debugging) console.log("button onclick");
    try {
      button.disabled = true;
      if (debugging) console.log("button clicked");
      button.textContent = "Đang dịch...";

      chrome.runtime.sendMessage(
        { action: "translate", text: text },
        (response) => {
          if (response.error) {
            resultDiv.innerHTML = `<div class="error">${response.error}</div>`;
          } else {
            resultDiv.innerHTML = `<div class="translation-text">${response.translation}</div>`;
          }
          button.remove();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  document.body.appendChild(translateButton);
}

function removeTranslateButton() {
  if (debugging) console.log("called removeTranslateButton");
  if (translateButton) {
    if (debugging) console.log("translateButton", translateButton);
    translateButton.remove();
    translateButton = null;
  }
}

document.addEventListener("mousedown", (e) => {
  if (debugging) console.log("mousedown addeventlistener", e.target);
  if (
    !e.target.closest(".translate-button") // This checks for any element inside the translate-button div
  ) {
    removeTranslateButton();
  }
});
