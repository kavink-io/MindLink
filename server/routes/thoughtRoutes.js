const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const router = express.Router();

// GET /api/thoughts - Get thought feed
router.get('/', (req, res) => {
  const { topic } = req.query;
  let thoughts = [...store.thoughts].reverse();
  if (topic) thoughts = thoughts.filter(t => t.topic === topic);
  res.json({ thoughts });
});

// POST /api/thoughts - Create thought
router.post('/', (req, res) => {
  const { text, topic, author, authorEmoji } = req.body;
  const thought = {
    id: uuidv4(), text, topic: topic || 'General',
    author: author || 'Anonymous', authorEmoji: authorEmoji || '👤',
    upvotes: 0, answers: [], createdAt: new Date().toISOString(),
  };
  store.thoughts.push(thought);
  res.status(201).json({ thought });
});

// POST /api/thoughts/:id/answer - Answer a thought
router.post('/:id/answer', (req, res) => {
  const { text, author } = req.body;
  const thought = store.thoughts.find(t => t.id === req.params.id);
  if (!thought) return res.status(404).json({ message: 'Thought not found' });
  const answer = { id: uuidv4(), text, author: author || 'Anonymous', upvotes: 0 };
  thought.answers.push(answer);
  res.status(201).json({ answer });
});

// POST /api/thoughts/:id/upvote
router.post('/:id/upvote', (req, res) => {
  const thought = store.thoughts.find(t => t.id === req.params.id);
  if (!thought) return res.status(404).json({ message: 'Thought not found' });
  thought.upvotes += 1;
  res.json({ upvotes: thought.upvotes });
});

module.exports = router;
