const socket = io();

function sendEntry(entry) {
  if (typeof entry.name === 'string' && typeof entry.score === 'number')
    socket.emit('new entry', JSON.stringify(entry));
  else console.error('Incorrect data');
}

socket.on('update leaderboard', (JSONstring) => {
  leaderboard = JSON.parse(JSONstring)
    .slice(0, 5)
    .map(({ name, score, date }) => ({
      name,
      score,
      date: new Date(date),
    }));
});