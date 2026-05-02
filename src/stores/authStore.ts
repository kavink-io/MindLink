import { create } from 'zustand';
import { generateNickname, generateAvatar } from '@/lib/utils';

export interface UserSession {
  id: string;
  nickname: string;
  avatar: { emoji: string; color: string };
  mood: string | null;
  interests: string[];
  mentalState: string | null;
  reputation: number;
  isAnonymous: boolean;
  studyStreak: number;
  totalFocusMinutes: number;
  doubtsResolved: number;
  battlesWon: number;
}

interface AuthState {
  token: string | null;
  user: UserSession | null;
  isOnboarded: boolean;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  setVibe: (mood: string, interests: string[], mentalState: string) => void;
  toggleIdentity: () => void;
  updateReputation: (delta: number) => void;
  updateStats: (stats: Partial<UserSession>) => void;
  setOnboarded: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('minklink_token'),
  user: JSON.parse(localStorage.getItem('minklink_user') || 'null'),
  isOnboarded: localStorage.getItem('minklink_onboarded') === 'true',

  login: (token, user) => {
    localStorage.setItem('minklink_token', token);
    localStorage.setItem('minklink_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('minklink_token');
    localStorage.removeItem('minklink_user');
    localStorage.removeItem('minklink_onboarded');
    set({ token: null, user: null, isOnboarded: false });
  },

  setVibe: (mood, interests, mentalState) => {
    set((state) => {
      const user = state.user ? { ...state.user, mood, interests, mentalState } : null;
      if (user) localStorage.setItem('minklink_user', JSON.stringify(user));
      return { user };
    });
  },

  toggleIdentity: () => {
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, isAnonymous: !state.user.isAnonymous };
      localStorage.setItem('minklink_user', JSON.stringify(user));
      return { user };
    });
  },

  updateReputation: (delta) => {
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, reputation: state.user.reputation + delta };
      localStorage.setItem('minklink_user', JSON.stringify(user));
      return { user };
    });
  },

  updateStats: (stats) => {
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, ...stats };
      localStorage.setItem('minklink_user', JSON.stringify(user));
      return { user };
    });
  },

  setOnboarded: (val) => {
    localStorage.setItem('minklink_onboarded', String(val));
    set({ isOnboarded: val });
  },
}));

// Quick helper to create a new anonymous session
export function createAnonymousSession(): UserSession {
  const avatar = generateAvatar();
  return {
    id: crypto.randomUUID(),
    nickname: generateNickname(),
    avatar,
    mood: null,
    interests: [],
    mentalState: null,
    reputation: 0,
    isAnonymous: true,
    studyStreak: 0,
    totalFocusMinutes: 0,
    doubtsResolved: 0,
    battlesWon: 0,
  };
}
