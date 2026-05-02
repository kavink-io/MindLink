const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const router = express.Router();

const QUIZ_QUESTIONS = [
  { id: 'q1', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], answer: 0, topic: 'Web Dev' },
  { id: 'q2', question: 'Which sorting algorithm has O(n log n) average complexity?', options: ['Bubble Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'], answer: 1, topic: 'DSA' },
  { id: 'q3', question: 'typeof null in JavaScript?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], answer: 2, topic: 'JavaScript' },
  { id: 'q4', question: 'Secure web protocol?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], answer: 2, topic: 'Networks' },
  { id: 'q5', question: 'What is a closure?', options: ['Function with no return', 'Function + lexical scope', 'A class method', 'Recursive function'], answer: 1, topic: 'JavaScript' },
  { id: 'q6', question: 'Time complexity of hash table lookup (average)?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2, topic: 'DSA' },
  { id: 'q7', question: 'React hook for side effects?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], answer: 1, topic: 'React' },
  { id: 'q8', question: 'SQL command to get unique values?', options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'SINGLE'], answer: 1, topic: 'Database' },
];

// GET /api/battles - List battles
router.get('/', (req, res) => {
  const battles = Array.from(store.battles.values());
  res.json({ battles });
});

// POST /api/battles - Create battle
router.post('/', (req, res) => {
  const { name, topic, maxPlayers } = req.body;
  const id = uuidv4().substring(0, 6);
  const questions = QUIZ_QUESTIONS.sort(() => Math.random() - 0.5).slice(0, 5);
  const battle = {
    id, name: name || 'Quick Battle', topic: topic || 'Mixed',
    questions, players: [], scores: {},
    maxPlayers: maxPlayers || 6, status: 'waiting',
    createdAt: new Date().toISOString(),
  };
  store.battles.set(id, battle);
  res.status(201).json({ battle: { ...battle, questions: questions.map(q => ({ ...q, answer: undefined })) } });
});

// POST /api/battles/:id/answer - Submit answer
router.post('/:id/answer', (req, res) => {
  const { userId, questionId, answer } = req.body;
  const battle = store.battles.get(req.params.id);
  if (!battle) return res.status(404).json({ message: 'Battle not found' });
  const question = battle.questions.find(q => q.id === questionId);
  if (!question) return res.status(400).json({ message: 'Question not found' });
  const isCorrect = answer === question.answer;
  if (!battle.scores[userId]) battle.scores[userId] = 0;
  if (isCorrect) battle.scores[userId] += 100;
  store.battles.set(req.params.id, battle);
  res.json({ isCorrect, correctAnswer: question.answer, score: battle.scores[userId] });
});

module.exports = router;
