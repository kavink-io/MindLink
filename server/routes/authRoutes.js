const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const router = express.Router();

const ADJECTIVES = ['Cosmic', 'Quantum', 'Mystic', 'Silent', 'Shadow', 'Neon', 'Crystal', 'Lunar', 'Solar', 'Astral', 'Clever', 'Swift', 'Bright', 'Bold', 'Calm', 'Keen'];
const NOUNS = ['Phoenix', 'Panda', 'Tiger', 'Eagle', 'Wolf', 'Fox', 'Owl', 'Hawk', 'Dolphin', 'Falcon', 'Lynx', 'Raven', 'Coder', 'Wizard', 'Knight', 'Ninja'];
const EMOJIS = ['🦊', '🐼', '🦉', '🐺', '🦅', '🐬', '🦁', '🐯', '🦋', '🌟', '🔥', '⚡', '🌙', '🎯', '💎', '🧠'];
const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#ec4899', '#f59e0b', '#6366f1', '#14b8a6', '#f43f5e'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// POST /api/auth/anonymous - Create anonymous session
router.post('/anonymous', (req, res) => {
  const id = uuidv4();
  const nickname = `${randomFrom(ADJECTIVES)}${randomFrom(NOUNS)}${Math.floor(Math.random() * 100)}`;
  const avatar = { emoji: randomFrom(EMOJIS), color: randomFrom(COLORS) };

  const session = {
    id, nickname, avatar, mood: null, interests: [], mentalState: null,
    reputation: 0, isAnonymous: true, studyStreak: 0, totalFocusMinutes: 0,
    doubtsResolved: 0, battlesWon: 0, createdAt: new Date().toISOString(),
  };

  store.sessions.set(id, session);
  const token = jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

  res.json({ token, user: session });
});

// POST /api/auth/set-vibe - Set mood/interests/mental state
router.post('/set-vibe', (req, res) => {
  const { userId, mood, interests, mentalState } = req.body;
  const session = store.sessions.get(userId);
  if (!session) return res.status(404).json({ message: 'Session not found' });

  session.mood = mood;
  session.interests = interests;
  session.mentalState = mentalState;
  store.sessions.set(userId, session);

  res.json({ user: session });
});

// GET /api/auth/match - Find matching students
router.get('/match', (req, res) => {
  const { mood, interests } = req.query;
  const interestList = interests ? interests.split(',') : [];
  const matches = [];

  store.sessions.forEach((session) => {
    let score = 0;
    if (session.mood === mood) score += 3;
    const overlap = session.interests.filter(i => interestList.includes(i)).length;
    score += overlap * 2;
    if (score > 0) matches.push({ ...session, matchScore: score });
  });

  matches.sort((a, b) => b.matchScore - a.matchScore);
  res.json({ matches: matches.slice(0, 20) });
});

module.exports = router;
