document.body.style.border = "5px solid blue";

// HTML changes
const toDelete = document.querySelectorAll('.lobby__tv, .lobby__blog, .lobby__leaderboard, .lobby__winners, .lobby__tournaments-simuls, .lobby__support');
toDelete.forEach(element => {
  element.remove();
});


// new sidebar component with ratings and streaks (linking to profile page)

async function getRating(username, perf) {
  const url = `https://lichess.org/api/user/${username}/perf/${perf}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    console.log(data);

    if (data.perf) {
      const rating = data.perf.glicko.rating;
      console.log(`${username}'s ${perf} rating is: ${rating}`);
      return rating;
    } else {
      console.log(`No rating found for ${username} in ${perf}`);
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



// link to (https://lichess.org/) @/${username}/search?perf={index of perf in formats)}
// experiment in adding font manually, but probably not needed
// const font = new FontFace("licon", "url('lichess.ttf')");
// document.fonts.add(font);

// const icon = '';
// const textNode = document.createTextNode('');
// textNode.fontFamily = 'lichess';
// document.body.append(textNode)

