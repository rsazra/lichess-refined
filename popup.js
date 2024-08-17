document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const statusElement = document.getElementById("status");

  // Load any saved API key from localStorage
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result) {
      apiKeyInput.value = result.apiKey; // Pre-fill the input with the saved key
      statusElement.textContent = "Your saved API key is loaded.";
    }
  });

  // Handle form submission
  document
    .getElementById("submit")
    .addEventListener("click", function (event) {
      const apiKey = apiKeyInput.value.trim();

      if (apiKey) {
        // Save the API key to localStorage
        chrome.storage.local.set({ apiKey: apiKey });
        statusElement.textContent = "API key saved successfully!";
      } else {
        statusElement.textContent = "Please enter a valid API key.";
        statusElement.style.color = "red";
      }
    });
});
