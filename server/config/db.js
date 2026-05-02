// In-memory data store (privacy-first: no persistent storage)
const store = {
  sessions: new Map(),    // sessionId -> { id, nickname, avatar, mood, interests, mentalState, reputation, ... }
  rooms: new Map(),       // roomId -> { id, name, topic, participants, pomodoro, ... }
  thoughts: [],           // [{ id, text, topic, author, upvotes, answers, ... }]
  battles: new Map(),     // battleId -> { id, questions, players, scores, ... }
  progress: new Map(),    // sessionId -> { focusMinutes, battlesWon, doubtsResolved, ... }
};

// Seed some example data
store.rooms.set('room-1', {
  id: 'room-1', name: 'DSA Grind Session', topic: 'DSA',
  description: 'Solving LeetCode together', participants: [],
  pomodoro: { duration: 25, breakDuration: 5, isRunning: false, timeLeft: 1500, isBreak: false, cycle: 0 },
  isActive: true, createdBy: 'system', createdAt: new Date().toISOString(), maxParticipants: 10,
});
store.rooms.set('room-2', {
  id: 'room-2', name: 'React Deep Dive', topic: 'React',
  description: 'Advanced hooks & patterns', participants: [],
  pomodoro: { duration: 25, breakDuration: 5, isRunning: false, timeLeft: 1500, isBreak: false, cycle: 0 },
  isActive: true, createdBy: 'system', createdAt: new Date().toISOString(), maxParticipants: 8,
});
store.rooms.set('room-3', {
  id: 'room-3', name: 'AI/ML Study Group', topic: 'AI/ML',
  description: 'Neural networks & transformers', participants: [],
  pomodoro: { duration: 30, breakDuration: 10, isRunning: false, timeLeft: 1800, isBreak: false, cycle: 0 },
  isActive: true, createdBy: 'system', createdAt: new Date().toISOString(), maxParticipants: 15,
});

store.thoughts.push(
  {
    id: 't1', text: 'Can someone explain the difference between TCP and UDP?', topic: 'Networks',
    author: 'CosmicOwl42', authorEmoji: '🦉', upvotes: 12, createdAt: new Date().toISOString(),
    answers: [{ id: 'a1', text: 'TCP = reliable, UDP = fast but unreliable', author: 'NeonFox88', upvotes: 8 }],
  },
  {
    id: 't2', text: 'Best approach to learn system design?', topic: 'System Design',
    author: 'SilentWolf11', authorEmoji: '🐺', upvotes: 18, createdAt: new Date().toISOString(),
    answers: [{ id: 'a2', text: 'Start with DDIA book!', author: 'BrightEagle7', upvotes: 12 }],
  }
);

module.exports = store;
