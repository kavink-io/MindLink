const ADJECTIVES = [
  'Cosmic', 'Quantum', 'Mystic', 'Silent', 'Shadow', 'Neon', 'Crystal', 'Lunar',
  'Solar', 'Astral', 'Clever', 'Swift', 'Bright', 'Bold', 'Calm', 'Keen',
  'Wild', 'Zen', 'Nova', 'Echo', 'Pixel', 'Cyber', 'Frost', 'Storm',
  'Amber', 'Jade', 'Ruby', 'Onyx', 'Azure', 'Coral', 'Sage', 'Blaze',
];

const NOUNS = [
  'Phoenix', 'Panda', 'Tiger', 'Eagle', 'Wolf', 'Fox', 'Owl', 'Hawk',
  'Dolphin', 'Falcon', 'Lynx', 'Raven', 'Cobra', 'Mantis', 'Otter', 'Crane',
  'Coder', 'Hacker', 'Scholar', 'Wizard', 'Knight', 'Ninja', 'Sage', 'Monk',
  'Nomad', 'Ranger', 'Scout', 'Pilot', 'Spark', 'Blaze', 'Frost', 'Wave',
];

const AVATAR_COLORS = [
  '#06b6d4', '#8b5cf6', '#10b981', '#ec4899', '#f59e0b',
  '#6366f1', '#14b8a6', '#f43f5e', '#a855f7', '#22d3ee',
];

const AVATAR_EMOJIS = [
  '🦊', '🐼', '🦉', '🐺', '🦅', '🐬', '🦁', '🐯',
  '🦋', '🌟', '🔥', '⚡', '🌙', '🎯', '💎', '🎪',
  '🧠', '🎨', '🚀', '🌊', '🍀', '🎭', '🎵', '🔮',
];

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}

export function generateAvatar(): { emoji: string; color: string } {
  return {
    emoji: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
  };
}

export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const TOPICS = [
  'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'TypeScript',
  'DSA', 'System Design', 'AI/ML', 'IoT', 'Web Dev', 'Mobile Dev',
  'Database', 'Cloud', 'DevOps', 'Cybersecurity', 'Blockchain', 'Math',
  'Physics', 'Electronics', 'Networks', 'OS', 'Compiler Design', 'Data Science',
];

export const MOODS = [
  { id: 'focused', emoji: '🎯', label: 'Focused', color: '#06b6d4' },
  { id: 'curious', emoji: '🤔', label: 'Curious', color: '#8b5cf6' },
  { id: 'creative', emoji: '🎨', label: 'Creative', color: '#ec4899' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: '#f43f5e' },
  { id: 'chill', emoji: '😌', label: 'Chill', color: '#10b981' },
  { id: 'motivated', emoji: '🔥', label: 'Motivated', color: '#f59e0b' },
  { id: 'confused', emoji: '😵‍💫', label: 'Confused', color: '#a855f7' },
  { id: 'lazy', emoji: '😴', label: 'Lazy', color: '#94a3b8' },
];

export const MENTAL_STATES = [
  { id: 'deep-focus', emoji: '🧘', label: 'Deep Focus' },
  { id: 'light-study', emoji: '📖', label: 'Light Study' },
  { id: 'need-help', emoji: '🆘', label: 'Need Help' },
  { id: 'helping-others', emoji: '🤝', label: 'Helping Others' },
  { id: 'brainstorming', emoji: '💡', label: 'Brainstorming' },
  { id: 'reviewing', emoji: '🔍', label: 'Reviewing' },
];

export const REPUTATION_TIERS = [
  { min: 0, label: 'Novice', emoji: '🌱', color: '#94a3b8' },
  { min: 10, label: 'Helper', emoji: '⭐', color: '#f59e0b' },
  { min: 50, label: 'Mentor', emoji: '🏆', color: '#8b5cf6' },
  { min: 100, label: 'Sage', emoji: '👑', color: '#06b6d4' },
  { min: 250, label: 'Legend', emoji: '💎', color: '#ec4899' },
];

export function getReputationTier(rep: number) {
  let tier = REPUTATION_TIERS[0];
  for (const t of REPUTATION_TIERS) {
    if (rep >= t.min) tier = t;
  }
  return tier;
}
