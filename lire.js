document.body.style.border = "5px solid blue";

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

// add puzzle rating
// requires authorized request. will handle that later.
const puzzleRating = puzzleAnchor.firstElementChild.firstElementChild;
// why is this null at first?
if (puzzleRating) {
  console.log("firstchild", puzzleRating);
  puzzleRating.innerHTML = `Puzzle rating: ${2000}`;
}


// new sidebar component with ratings and streaks (linking to profile page)
const lobbyRatings = document.querySelector('.lobby__spotlights, .lobby__ratings');
if (lobbyRatings.classList.contains("lobby__spotlights")) {
  lobbyRatings.classList.remove('lobby__spotlights');
  lobbyRatings.classList.add('lobby__ratings');
}
lobbyRatings.childNodes.forEach(element => { element.remove() })
// getting sidebar data
async function getRating(username, format) {
  const url = `https://lichess.org/api/user/${username}/perf/${format}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    console.log(data);

    if (data.perf) {
      const rating = data.perf.glicko.rating;
      console.log(`${username}'s ${format} rating is: ${rating}`);
      return rating;
    } else {
      console.log(`No rating found for ${username} in ${format}`);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch rating:', error);
    return null;
  }
}
const username = 'daphnebridgerton';
const formats = ['bullet', 'blitz', 'rapid', 'classical'];
// corresponding numbers for search: 1, 2, 6, 3. dict or list?
getRating(username, formats[1]);
// add to widget
const bulletRating = document.createElement("a");
bulletRating.href = `https://lichess.org/@/${username}/perf/bullet`
bulletRating.classList.add("little", "tour-spotlight")
bulletRating.innerHTML = `<i data-icon="" class="img"></i><span class="content"><span class="name">Current rating</span><span class="more">Current streak</span></span>`
lobbyRatings.appendChild(bulletRating);