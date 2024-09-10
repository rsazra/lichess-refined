document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const statusElement = document.getElementById("status");

  // load saved
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey; // pre-fill the input with the saved key
      statusElement.textContent = "Your saved API key is loaded.";
    }
    else {
      statusElement.innerHTML = "Generate an API key <a href='https://lichess.org/account/oauth/token'>here</a>"
      statusElement.style.color = "black";
    }
  });

  // form submission
  document
    .getElementById("submit")
    .addEventListener("click", function (event) {
      const apiKey = apiKeyInput.value.trim();

      // not gonna do any validation for now
      if (apiKey) {
        chrome.storage.local.set({ apiKey: apiKey });
        statusElement.textContent = "API key saved successfully!";
        statusElement.style.color = "green";
      } else {
        statusElement.textContent = "Please enter a valid API key.";
        statusElement.style.color = "red";
      }
    });

  document
    .getElementById("delete")
    .addEventListener("click", function (event) {
      apiKeyInput.value = '';
      chrome.storage.local.clear();
      statusElement.textContent = "API key deleted successfully.";
      statusElement.style.color = "red";
    });
});
