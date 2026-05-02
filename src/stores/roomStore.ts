import { create } from 'zustand';

export interface RoomParticipant {
  id: string;
  nickname: string;
  avatar: { emoji: string; color: string };
  mentalState: string | null;
  isAnonymous: boolean;
  progress: number;
  currentTopic: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  topic: string;
  description: string;
  participants: RoomParticipant[];
  pomodoro: {
    duration: number;
    breakDuration: number;
    isRunning: boolean;
    timeLeft: number;
    isBreak: boolean;
    cycle: number;
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  maxParticipants: number;
}

interface RoomState {
  rooms: StudyRoom[];
  currentRoom: StudyRoom | null;
  setRooms: (rooms: StudyRoom[]) => void;
  addRoom: (room: StudyRoom) => void;
  setCurrentRoom: (room: StudyRoom | null) => void;
  updateRoom: (roomId: string, updates: Partial<StudyRoom>) => void;
  updatePomodoro: (updates: Partial<StudyRoom['pomodoro']>) => void;
  addParticipant: (participant: RoomParticipant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipantProgress: (participantId: string, progress: number, topic: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  currentRoom: null,

  setRooms: (rooms) => set({ rooms }),

  addRoom: (room) => set((s) => ({ rooms: [room, ...s.rooms] })),

  setCurrentRoom: (room) => set({ currentRoom: room }),

  updateRoom: (roomId, updates) =>
    set((s) => ({
      rooms: s.rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r)),
      currentRoom: s.currentRoom?.id === roomId ? { ...s.currentRoom, ...updates } : s.currentRoom,
    })),

  updatePomodoro: (updates) =>
    set((s) => ({
      currentRoom: s.currentRoom
        ? { ...s.currentRoom, pomodoro: { ...s.currentRoom.pomodoro, ...updates } }
        : null,
    })),

  addParticipant: (participant) =>
    set((s) => ({
      currentRoom: s.currentRoom
        ? { ...s.currentRoom, participants: [...s.currentRoom.participants, participant] }
        : null,
    })),

  removeParticipant: (participantId) =>
    set((s) => ({
      currentRoom: s.currentRoom
        ? {
            ...s.currentRoom,
            participants: s.currentRoom.participants.filter((p) => p.id !== participantId),
          }
        : null,
    })),

  updateParticipantProgress: (participantId, progress, topic) =>
    set((s) => ({
      currentRoom: s.currentRoom
        ? {
            ...s.currentRoom,
            participants: s.currentRoom.participants.map((p) =>
              p.id === participantId ? { ...p, progress, currentTopic: topic } : p
            ),
          }
        : null,
    })),
}));
