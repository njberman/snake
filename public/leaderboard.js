let leaderBoardShowing = false;
const strokeWidth = 10;

let leaderboard = [];
let cachedLeaderboard = [];

async function drawLeaderboard() {
  // draw the leaderboard

  rectMode(CENTER);

  const xDim = width / 3;
  const yDim = width / 3 - 4 * strokeWidth;
  stroke(0);
  fill(17);
  rect(width / 2, height / 2, xDim, yDim);

  // Dummy leaderboard data:
  // const leaderboard = JSON.parse(
  //   `[
  //   {
  //     "name": "nay nay",
  //     "score": 4765,
  //     "date": "2024-05-14T18:47:54.654Z"
  //   },
  //   {
  //     "name": "jom jom",
  //     "score": 476,
  //     "date": "2024-05-14T18:47:52.433Z"
  //   }
  // ]`
  // )
  // .map(({ name, score, date }) => ({
  //   name,
  //   score,
  //   date: new Date(date),
  // }))
  // .slice(0, 5);
  const x = width / 2;
  const spacing = width / 3 / 5;
  for (const i in leaderboard) {
    fill(255, 100);
    noStroke();
    const entry = leaderboard[i];
    const y =
      0.5 * (height - yDim) +
      spacing / 2 +
      spacing * i -
      Math.max(i, 0) * strokeWidth;
    rect(x, y, width / 3 - 20, spacing - 20);

    noStroke();
    fill(255);
    textSize(16);
    text(entry.name, x - xDim / 4, y);
    text(entry.date.toLocaleString(), x + xDim / 4, y);
    fill(0, 255, 0);
    text(entry.score, x, y);
  }
  rectMode(CORNER);
}
