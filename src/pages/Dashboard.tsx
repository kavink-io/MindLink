import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useRoomStore } from '@/stores/roomStore';
import { motion } from 'framer-motion';
import { cn, MOODS, getReputationTier } from '@/lib/utils';
import {
  BookOpen, Brain, Swords, MessageCircle, Trophy, BarChart3,
  Plus, Users, Clock, Zap, TrendingUp, Flame, Target, ArrowRight, Sparkles
} from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: Plus, label: 'Create Room', path: '/rooms/create', color: '#06b6d4' },
  { icon: BookOpen, label: 'Browse Rooms', path: '/rooms', color: '#8b5cf6' },
  { icon: Brain, label: 'AI Assistant', path: '/ai', color: '#10b981' },
  { icon: Swords, label: 'Mind Battle', path: '/battles', color: '#f59e0b' },
  { icon: MessageCircle, label: 'Thought Drops', path: '/thoughts', color: '#ec4899' },
  { icon: BarChart3, label: 'My Growth', path: '/progress', color: '#6366f1' },
];

const MOCK_ROOMS = [
  { id: 'room-1', name: 'DSA Grind Session', topic: 'DSA', desc: 'Solving LeetCode together', count: 5, max: 10 },
  { id: 'room-2', name: 'React Deep Dive', topic: 'React', desc: 'Advanced patterns & hooks', count: 3, max: 8 },
  { id: 'room-3', name: 'AI/ML Study Group', topic: 'AI/ML', desc: 'Neural networks & transformers', count: 7, max: 15 },
];

const CHALLENGE = {
  question: 'What is the time complexity of binary search on a sorted array?',
  topic: 'DSA', difficulty: 'Easy',
  options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1,
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);
  const mood = MOODS.find((m) => m.id === user?.mood);
  const tier = user ? getReputationTier(user.reputation) : null;

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item} className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-neon-cyan/10 to-transparent rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {mood && <span className="text-2xl">{mood.emoji}</span>}
              <h1 className="text-2xl md:text-3xl font-bold">
                Hey, <span className="gradient-text">{user?.isAnonymous ? 'Anonymous' : user?.nickname}</span>
              </h1>
            </div>
            <p className="text-slate-400">
              {mood ? `Feeling ${mood.label.toLowerCase()} today` : 'Ready to learn'} · {user?.interests.slice(0, 3).join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { val: user?.studyStreak || 0, label: 'Streak', icon: Flame, color: 'text-neon-cyan' },
              { val: user?.totalFocusMinutes || 0, label: 'Minutes', icon: Clock, color: 'text-neon-violet' },
              { val: `${tier?.emoji || ''} ${user?.reputation || 0}`, label: 'Rep', icon: TrendingUp, color: 'text-neon-emerald' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1"><s.icon className="w-3 h-3" /> {s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="section-title flex items-center gap-2"><Zap className="w-5 h-5 text-neon-cyan" /> Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.path} to={a.path} className="glass glass-hover rounded-xl p-4 text-center group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110" style={{ backgroundColor: a.color + '20' }}>
                <a.icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{a.label}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rooms */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0 flex items-center gap-2"><Target className="w-5 h-5 text-neon-violet" /> Vibe-Matched Rooms</h2>
            <Link to="/rooms" className="btn-ghost text-xs flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {MOCK_ROOMS.map((room) => (
              <Link key={room.id} to={`/rooms/${room.id}`} className="glass glass-hover rounded-xl p-4 flex items-center gap-4 group block">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-neon-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-neon-cyan transition-colors">{room.name}</h3>
                  <p className="text-xs text-slate-400">{room.desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="badge badge-cyan text-xs mb-1">{room.topic}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500"><Users className="w-3 h-3" />{room.count}/{room.max}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div variants={item}>
          <h2 className="section-title flex items-center gap-2"><Trophy className="w-5 h-5 text-neon-amber" /> Daily Challenge</h2>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-amber">{CHALLENGE.topic}</span>
              <span className="badge badge-emerald">{CHALLENGE.difficulty}</span>
            </div>
            <p className="text-sm font-medium mb-4">{CHALLENGE.question}</p>
            <div className="space-y-2">
              {CHALLENGE.options.map((opt, i) => (
                <button key={i} onClick={() => setChallengeAnswer(i)} disabled={challengeAnswer !== null}
                  className={cn('w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
                    challengeAnswer === null ? 'glass-light hover:bg-white/5'
                    : i === CHALLENGE.answer ? 'bg-neon-emerald/20 border border-neon-emerald/30 text-neon-emerald'
                    : challengeAnswer === i ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 'glass-light opacity-50'
                  )}>
                  <span className="font-mono text-xs mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              ))}
            </div>
            {challengeAnswer !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={cn('mt-4 p-3 rounded-xl text-sm',
                  challengeAnswer === CHALLENGE.answer ? 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20' : 'bg-red-500/10 text-red-400 border border-red-500/20')}>
                {challengeAnswer === CHALLENGE.answer
                  ? <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Correct! +10 rep</span>
                  : <span>Answer: {CHALLENGE.options[CHALLENGE.answer]}</span>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
