const express = require('express');
const store = require('../config/db');
const router = express.Router();

// GET /api/progress - Get user progress
router.get('/', (req, res) => {
  const { userId } = req.query;
  const progress = store.progress.get(userId) || {
    focusMinutes: [45, 90, 60, 120, 75, 150, 30],
    battlesWon: 26,
    battlesLost: 8,
    doubtsResolved: 14,
    studyStreak: 7,
    topicsStudied: ['DSA', 'React', 'Python', 'System Design', 'AI/ML', 'Databases', 'JavaScript', 'Networks'],
    weeklyGrowth: [
      { week: 'W1', knowledge: 20, focus: 30, collaboration: 15 },
      { week: 'W2', knowledge: 35, focus: 45, collaboration: 25 },
      { week: 'W3', knowledge: 45, focus: 55, collaboration: 40 },
      { week: 'W4', knowledge: 60, focus: 70, collaboration: 55 },
      { week: 'W5', knowledge: 72, focus: 68, collaboration: 65 },
      { week: 'W6', knowledge: 85, focus: 82, collaboration: 78 },
    ],
    skills: [
      { skill: 'DSA', level: 75 }, { skill: 'React', level: 60 }, { skill: 'Python', level: 45 },
      { skill: 'System Design', level: 30 }, { skill: 'AI/ML', level: 50 }, { skill: 'Databases', level: 55 },
    ],
    dailyChallengesCompleted: 15,
    reputation: 42,
  };
  res.json({ progress });
});

// POST /api/progress/update
router.post('/update', (req, res) => {
  const { userId, focusMinutes, battlesWon, doubtsResolved } = req.body;
  let progress = store.progress.get(userId) || {};
  if (focusMinutes) progress.focusMinutes = (progress.focusMinutes || 0) + focusMinutes;
  if (battlesWon) progress.battlesWon = (progress.battlesWon || 0) + 1;
  if (doubtsResolved) progress.doubtsResolved = (progress.doubtsResolved || 0) + 1;
  store.progress.set(userId, progress);
  res.json({ progress });
});

// GET /api/progress/daily-challenge
router.get('/daily-challenge', (req, res) => {
  const challenges = [
    { id: 'dc1', question: 'Time complexity of binary search?', topic: 'DSA', difficulty: 'Easy', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1, points: 10 },
    { id: 'dc2', question: 'Space complexity of recursive fibonacci?', topic: 'DSA', difficulty: 'Medium', options: ['O(1)', 'O(n)', 'O(2^n)', 'O(log n)'], answer: 1, points: 20 },
    { id: 'dc3', question: 'Singleton pattern ensures...?', topic: 'System Design', difficulty: 'Easy', options: ['Multiple instances', 'Single instance', 'No instances', 'Lazy loading'], answer: 1, points: 10 },
  ];
  res.json({ challenges });
});

module.exports = router;
