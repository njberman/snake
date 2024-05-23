const { error } = require('console');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 8080;
const uri = process.env.URI;

const client = new MongoClient(uri);

let changeStream;

const main = async () => {
  await client.connect();
  console.log('Connected successfuly to MongoDB');

  const db = client.db('gameStuff');
  const leaderboardColl = db.collection('leaderboard');

  changeStream = leaderboardColl.watch();

  const getLeaderBoard = async () => {
    const res = await client
      .db('gameStuff')
      .collection('leaderboard')
      .find({})
      .toArray();
    return res;
  };

  const updateLeaderboard = async () => {
    leaderboard = await getLeaderBoard();
    leaderboard.sort((a, b) => b.score - a.score);
    io.emit('update leaderboard', JSON.stringify(leaderboard));
  };

  let leaderboard = await getLeaderBoard();

  setTimeout(async () => {
    client.conn;
  }, 2000);

  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  io.on('connection', async (socket) => {
    console.log('User connected, sending leaderboard');
    socket.emit('update leaderboard', JSON.stringify(leaderboard));
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on('new entry', async (JSONstring) => {
      const { name, score } = JSON.parse(JSONstring);
      // Check entry, do nothing if it's bad
      if (typeof name === 'string' && typeof score === 'number') {
        await client
          .db('gameStuff')
          .collection('leaderboard')
          .insertOne({ name, score, date: new Date() });
        updateLeaderboard();
      }
    });
  });

  server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

  for await (const change of changeStream) {
    updateLeaderboard();
  }
};
main().catch(console.dir);
