const userTag = document.querySelector('#user_tag');
const username = userTag?.textContent;

// new sidebar component with ratings and streaks (linking to profile page)
if (username) {
  const lobbyRatings = document.querySelector('.lobby__spotlights, .lobby__ratings');
  if (lobbyRatings.classList.contains("lobby__spotlights")) {
    lobbyRatings.classList.remove('lobby__spotlights');
    lobbyRatings.classList.add('lobby__ratings');
  }
  // need to watch for new tournaments and such being added
  const ratingsObserver = new MutationObserver((mutations, obs) => {
    const lobbyRatingsChildren = lobbyRatings.childNodes;
    lobbyRatingsChildren.forEach(child => { if (!child.classList.contains('rating-display')) child.remove() });
  });
  ratingsObserver.observe(lobbyRatings, { childList: true });
  // getting sidebar data
  async function getRating(username, format) {
    const url = `https://lichess.org/api/user/${username}/perf/${format}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.perf) {
        return [
          data.perf.glicko.rating, data.stat.resultStreak.win.cur.v,
          data.stat.resultStreak.loss.cur.v, data.perf.glicko.provisional,
          data.stat.playStreak.nb.cur.v,
        ];
      } else {
        console.log(`No rating found for ${username} in ${format}`);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch rating:', error);
      return null;
    }
  }
  const formats = ['bullet', 'blitz', 'rapid', 'classical'];
  const dataIcons = ['', '', '', ''];
  const perfs = ['1', '2', '6', '3'];
  const toAdd = [];

  async function makeRatingDisplay() {
    for (const i in formats) {
      const ratingData = await getRating(username, formats[i]);
      if (ratingData) {
        const ratingDisplay = document.createElement("a");
        ratingDisplay.href = `https://lichess.org/@/${username}/search?perf=${perfs[i]}`;
        ratingDisplay.classList.add('little', 'tour-spotlight', 'rating-display');
        const streak = ratingData[1] == 0 ? -ratingData[2] : ratingData[1];
        const winStreak = streak > 0;
        const lossStreak = streak < 0;
        const provisional = ratingData[3];
        const playStreak = ratingData[4];
        ratingDisplay.innerHTML = `
        <i data-icon="${dataIcons[i]}" class="img"></i>\
        <span class="content">
          <span class="name">
            <strong>${Math.round(ratingData[0])}${provisional ? '?' : ''}</strong>
          </span>
          <span class="more">
            ${streak == 0 ? '-' : streak} ${winStreak ? ' win streak' : ''} ${lossStreak ? '  loss streak' : ''} \
            ${playStreak ? '• ' + playStreak + ' play streak' : ''}
          </span>
        </span>
        `;
        toAdd.push(ratingDisplay);
      }
    };
  }
  makeRatingDisplay().then(() => {
    toAdd.forEach(child => lobbyRatings.appendChild(child));
  });
}