document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("save");
  const statusDiv = document.getElementById("status");

  // Load saved API Key
  chrome.storage.local.get(["apiKey"], (result) => {
    apiKeyInput.value = result.apiKey || "";
  });

  // Save settings
  saveButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      showStatus("Vui lòng nhập API Key", "error");
      return;
    }

    chrome.storage.local.set({ apiKey }, () => {
      showStatus("Đã lưu thành công!", "success");
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status-${type}`;
    setTimeout(() => (statusDiv.textContent = ""), 3000);
  }
});
