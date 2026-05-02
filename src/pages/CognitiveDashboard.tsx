import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { getReputationTier, MOODS } from '@/lib/utils';
import {
  BarChart3, Brain, Clock, Flame, Trophy, TrendingUp, Target, Zap,
  BookOpen, Swords, HelpCircle, Star
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar
} from 'recharts';

const focusData = [
  { day: 'Mon', minutes: 45 }, { day: 'Tue', minutes: 90 }, { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 120 }, { day: 'Fri', minutes: 75 }, { day: 'Sat', minutes: 150 },
  { day: 'Sun', minutes: 30 },
];

const growthData = [
  { week: 'W1', knowledge: 20, focus: 30, collaboration: 15 },
  { week: 'W2', knowledge: 35, focus: 45, collaboration: 25 },
  { week: 'W3', knowledge: 45, focus: 55, collaboration: 40 },
  { week: 'W4', knowledge: 60, focus: 70, collaboration: 55 },
  { week: 'W5', knowledge: 72, focus: 68, collaboration: 65 },
  { week: 'W6', knowledge: 85, focus: 82, collaboration: 78 },
];

const skillData = [
  { skill: 'DSA', level: 75 }, { skill: 'React', level: 60 }, { skill: 'Python', level: 45 },
  { skill: 'System Design', level: 30 }, { skill: 'AI/ML', level: 50 }, { skill: 'Databases', level: 55 },
];

const quizData = [
  { topic: 'DSA', won: 5, lost: 2 }, { topic: 'JS', won: 8, lost: 1 }, { topic: 'React', won: 3, lost: 3 },
  { topic: 'Python', won: 4, lost: 2 }, { topic: 'SQL', won: 6, lost: 0 },
];

const moodHistory = [
  { time: '9AM', mood: 'focused' }, { time: '11AM', mood: 'curious' }, { time: '1PM', mood: 'lazy' },
  { time: '3PM', mood: 'motivated' }, { time: '5PM', mood: 'focused' }, { time: '7PM', mood: 'creative' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs">
        <p className="text-slate-400">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CognitiveDashboard() {
  const { user } = useAuthStore();
  const tier = user ? getReputationTier(user.reputation) : null;

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  const stats = [
    { icon: Clock, label: 'Focus Time', value: '570 min', color: '#06b6d4' },
    { icon: Flame, label: 'Streak', value: '7 days', color: '#f59e0b' },
    { icon: Swords, label: 'Battles Won', value: '26', color: '#8b5cf6' },
    { icon: HelpCircle, label: 'Doubts Resolved', value: '14', color: '#10b981' },
    { icon: Star, label: 'Reputation', value: `${tier?.emoji || ''} ${user?.reputation || 42}`, color: '#ec4899' },
    { icon: BookOpen, label: 'Topics Studied', value: '8', color: '#6366f1' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold flex items-center gap-3"><BarChart3 className="w-7 h-7 text-neon-cyan" /> Cognitive Growth</h1>
        <p className="text-slate-400 mt-1">Track your learning journey</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center glass-hover">
            <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <motion.div variants={item} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-neon-cyan" /> Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="knowledge" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} name="Knowledge" />
              <Area type="monotone" dataKey="focus" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} name="Focus" />
              <Area type="monotone" dataKey="collaboration" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Collaboration" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Focus Time */}
        <motion.div variants={item} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-neon-violet" /> Focus Time This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={focusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="minutes" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Minutes" />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Radar */}
        <motion.div variants={item} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-neon-emerald" /> Skill Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" stroke="#64748b" fontSize={11} />
              <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" fontSize={10} />
              <Radar name="Level" dataKey="level" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood History */}
        <motion.div variants={item} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Brain className="w-4 h-4 text-neon-pink" /> Mood Timeline</h3>
          <div className="flex items-end justify-between gap-2 h-[250px] pt-8">
            {moodHistory.map((m, i) => {
              const mood = MOODS.find((x) => x.id === m.mood);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: (mood?.color || '#666') + '20' }}
                  >
                    {mood?.emoji}
                  </motion.div>
                  <span className="text-xs text-slate-400">{mood?.label}</span>
                  <span className="text-[10px] text-slate-600">{m.time}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Reputation */}
      <motion.div variants={item} className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-neon-amber" /> Reputation Progress</h3>
        <div className="flex items-center gap-4">
          {[
            { label: 'Novice', emoji: '🌱', min: 0 },
            { label: 'Helper', emoji: '⭐', min: 10 },
            { label: 'Mentor', emoji: '🏆', min: 50 },
            { label: 'Sage', emoji: '👑', min: 100 },
            { label: 'Legend', emoji: '💎', min: 250 },
          ].map((t, i, arr) => (
            <div key={t.label} className="flex-1 text-center">
              <div className={`text-2xl mb-1 ${(user?.reputation || 0) >= t.min ? '' : 'opacity-30'}`}>{t.emoji}</div>
              <div className="text-xs font-medium">{t.label}</div>
              <div className="text-[10px] text-slate-500">{t.min}+ rep</div>
              {i < arr.length - 1 && (
                <div className="h-0.5 bg-dark-600 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet" style={{ width: `${Math.min(100, ((user?.reputation || 0) - t.min) / (arr[i + 1].min - t.min) * 100)}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
