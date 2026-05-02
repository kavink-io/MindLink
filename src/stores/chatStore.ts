import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderNickname: string;
  senderAvatar: { emoji: string; color: string };
  content: string;
  encrypted: boolean;
  timestamp: string;
  isSystem: boolean;
  isDoubt: boolean;
}

interface ChatState {
  messages: Record<string, ChatMessage[]>; // roomId -> messages
  typingUsers: Record<string, string[]>; // roomId -> userIds
  addMessage: (roomId: string, message: ChatMessage) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  clearMessages: (roomId: string) => void;
  setTyping: (roomId: string, users: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  typingUsers: {},

  addMessage: (roomId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [roomId]: [...(s.messages[roomId] || []), message],
      },
    })),

  setMessages: (roomId, messages) =>
    set((s) => ({
      messages: { ...s.messages, [roomId]: messages },
    })),

  clearMessages: (roomId) =>
    set((s) => ({
      messages: { ...s.messages, [roomId]: [] },
    })),

  setTyping: (roomId, users) =>
    set((s) => ({
      typingUsers: { ...s.typingUsers, [roomId]: users },
    })),
}));
