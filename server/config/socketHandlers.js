const store = require('./db');

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room
    socket.on('join-room', ({ roomId, user }) => {
      socket.join(roomId);
      const room = store.rooms.get(roomId);
      if (room) {
        const participant = {
          id: user.id, nickname: user.nickname, emoji: user.avatar?.emoji || '👤',
          mentalState: user.mentalState, progress: 0, currentTopic: room.topic,
          socketId: socket.id,
        };
        room.participants = room.participants.filter(p => p.id !== user.id);
        room.participants.push(participant);
        store.rooms.set(roomId, room);
        io.to(roomId).emit('room-updated', room);
        io.to(roomId).emit('system-message', { content: `${user.nickname} joined the room`, timestamp: new Date().toISOString() });
      }
    });

    // Leave room
    socket.on('leave-room', ({ roomId, userId }) => {
      socket.leave(roomId);
      const room = store.rooms.get(roomId);
      if (room) {
        room.participants = room.participants.filter(p => p.id !== userId);
        store.rooms.set(roomId, room);
        io.to(roomId).emit('room-updated', room);
      }
    });

    // Chat message (encrypted)
    socket.on('chat-message', ({ roomId, message }) => {
      io.to(roomId).emit('chat-message', message);
    });

    // Pomodoro sync
    socket.on('pomodoro-sync', ({ roomId, pomodoro }) => {
      const room = store.rooms.get(roomId);
      if (room) {
        room.pomodoro = pomodoro;
        store.rooms.set(roomId, room);
        io.to(roomId).emit('pomodoro-update', pomodoro);
      }
    });

    // Progress update
    socket.on('progress-update', ({ roomId, userId, progress, topic }) => {
      const room = store.rooms.get(roomId);
      if (room) {
        const participant = room.participants.find(p => p.id === userId);
        if (participant) {
          participant.progress = progress;
          participant.currentTopic = topic;
          store.rooms.set(roomId, room);
          io.to(roomId).emit('progress-updated', { userId, progress, topic });
        }
      }
    });

    // Typing indicator
    socket.on('typing', ({ roomId, userId, isTyping }) => {
      socket.to(roomId).emit('user-typing', { userId, isTyping });
    });

    // Doubt posted
    socket.on('doubt-posted', ({ roomId, doubt }) => {
      io.to(roomId).emit('new-doubt', doubt);
    });

    // Battle events
    socket.on('join-battle', ({ battleId, user }) => {
      socket.join(`battle-${battleId}`);
      io.to(`battle-${battleId}`).emit('player-joined', { user });
    });

    socket.on('battle-answer', ({ battleId, userId, questionId, answer, isCorrect, score }) => {
      io.to(`battle-${battleId}`).emit('answer-submitted', { userId, questionId, isCorrect, score });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Remove from all rooms
      store.rooms.forEach((room, roomId) => {
        const before = room.participants.length;
        room.participants = room.participants.filter(p => p.socketId !== socket.id);
        if (room.participants.length < before) {
          store.rooms.set(roomId, room);
          io.to(roomId).emit('room-updated', room);
        }
      });
    });
  });
}

module.exports = setupSocketHandlers;
