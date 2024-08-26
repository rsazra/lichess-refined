function waitForElement(selector) {
  return new Promise((resolve) => {
    // Check if the element already exists
    const element = selector();
    if (element) {
      resolve(element);
      return;
    }

    // Create a MutationObserver to listen for changes in the DOM
    const observer = new MutationObserver((mutations, obs) => {
      const element = selector();
      if (element) {
        resolve(element);
        obs.disconnect(); // Stop observing once the element is found
      }
    });

    // Start observing the entire document for changes
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  });
}


// HTML changes
const toDelete = document.querySelectorAll('.lobby__tv, .lobby__blog,\
  .lobby__leaderboard, .lobby__winners, .lobby__tournaments-simuls, \
  .lobby__support, .lobby__counters, .lobby__streams, .lobby__timeline');
toDelete.forEach(element => { element.remove() });
//move puzzle into a div
// kind of bugged. should check if this has already been done.
const puzzleAnchor = document.querySelector('.lobby__puzzle');
if (puzzleAnchor.tagName == "A") {
  const puzzleDiv = document.createElement('div');
  puzzleAnchor.parentNode.insertBefore(puzzleDiv, puzzleAnchor);
  puzzleDiv.appendChild(puzzleAnchor);
  puzzleAnchor.classList.add('puzzle__anchor');
  puzzleAnchor.classList.remove('lobby__puzzle');
  puzzleDiv.classList.add('lobby__puzzle');
}

(async () => {
  const table = await waitForElement(() => { return document.querySelector(".lobby__table") });
  const playFriend = document.querySelector('.config_friend');
  playFriend.textContent = 'Play a friend';
  const playComputer = document.querySelector('.config_ai');
  playComputer.textContent = 'Play scomputer';
})();

(async () => {
  const counters = await waitForElement(() => { return document.querySelector(".lobby__counters") });
  counters.remove();
})();

const publicData = new Promise((resolve, reject) => {
  chrome.storage.local.get(['apiKey']).then((result) => {
    const apiKey = result.apiKey;

    if (apiKey) {
      const headers = {
        Authorization: 'Bearer ' + apiKey,
      };

      fetch('https://lichess.org/api/account', { headers })
        .then(res => res.json())
        .then((data) => {
          resolve(data);
        });
    }
    else {
      reject()
    }
  });
});

// add puzzle rating
(async () => {
  const puzzleRating = await waitForElement(() => {
    const spans = document.querySelectorAll("span");
    for (const span of spans) {
      if (span.textContent.includes("Puzzle of the day")) return span;
    }
  });
  publicData.then((data) => puzzleRating.innerHTML = `Current rating: ${data.perfs.puzzle.rating}`)
    .catch(puzzleRating.innerHTML = `Add your API Key to see your puzzle rating!`);
})();

// flair stuff
publicData.then((data) => {
  if (data.flair) {
    const userTag = document.querySelector('#user_tag');
    const userIcon = document.createElement('img');
    userIcon.src = `https://lichess1.org/assets/______2/flair/img/${data.flair}.webp`;
    userIcon.classList.add('nobg', 'flair__pic');
    userTag?.appendChild(userIcon);
    const style = document.createElement('style');
    style.textContent = `
      #user_tag::after {
          content: none;
      }
    `;
    document.head.appendChild(style);
  }
});