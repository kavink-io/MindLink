const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const router = express.Router();

// GET /api/rooms - List all rooms
router.get('/', (req, res) => {
  const { topic, search } = req.query;
  let rooms = Array.from(store.rooms.values());
  if (topic) rooms = rooms.filter(r => r.topic === topic);
  if (search) rooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.topic.toLowerCase().includes(search.toLowerCase()));
  res.json({ rooms });
});

// GET /api/rooms/:id - Get room details
router.get('/:id', (req, res) => {
  const room = store.rooms.get(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json({ room });
});

// POST /api/rooms - Create room
router.post('/', (req, res) => {
  const { name, topic, description, pomDuration, maxParticipants, createdBy } = req.body;
  const id = uuidv4().substring(0, 8).toUpperCase();
  const room = {
    id, name, topic, description: description || '',
    participants: [],
    pomodoro: { duration: pomDuration || 25, breakDuration: 5, isRunning: false, timeLeft: (pomDuration || 25) * 60, isBreak: false, cycle: 0 },
    isActive: true, createdBy: createdBy || 'anonymous',
    createdAt: new Date().toISOString(), maxParticipants: maxParticipants || 10,
  };
  store.rooms.set(id, room);
  res.status(201).json({ room });
});

// POST /api/rooms/:id/doubt - Post doubt
router.post('/:id/doubt', (req, res) => {
  const { text, author } = req.body;
  const room = store.rooms.get(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  const doubt = { id: uuidv4(), text, author: author || 'Anonymous', upvotes: 0, answers: [], isResolved: false, createdAt: new Date().toISOString() };
  res.status(201).json({ doubt });
});

module.exports = router;
