/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();

// For now leaderboard will be an array in memory
// TODO: Switch to using mongodb
const leaderboard = [];
// Leaderboard type: { name: string, score: int, date: Date }

const sortLeaderboard = () => leaderboard.sort((a, b) => b.score - a.score);

router.get('/', (req, res) => {
  sortLeaderboard();
  res.json(leaderboard);
});

router.post('/', (req, res) => {
  // Check entry
  if (typeof req.body.name === 'string' && typeof req.body.score === 'number') {
    leaderboard.push({
      name: req.body.name,
      score: req.body.score,
      date: new Date(),
    });

    sortLeaderboard();
    return res.status(200).json(leaderboard);
  } else {
    return res.status(400).json({ error: 'Incorrect data' });
  }
});

module.exports = router;
