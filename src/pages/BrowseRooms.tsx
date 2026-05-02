import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn, TOPICS } from '@/lib/utils';
import { BookOpen, Users, Search, Plus, Timer, Zap, Globe, MapPin, Filter } from 'lucide-react';

const ROOMS = [
  { id: 'room-1', name: 'DSA Grind Session', topic: 'DSA', desc: 'LeetCode daily problems', count: 5, max: 10, pomodoro: true, active: true },
  { id: 'room-2', name: 'React Deep Dive', topic: 'React', desc: 'Advanced hooks & patterns', count: 3, max: 8, pomodoro: true, active: true },
  { id: 'room-3', name: 'AI/ML Study Group', topic: 'AI/ML', desc: 'Transformers & attention', count: 7, max: 15, pomodoro: false, active: true },
  { id: 'room-4', name: 'Java OOP Basics', topic: 'Java', desc: 'Inheritance & polymorphism', count: 4, max: 8, pomodoro: true, active: true },
  { id: 'room-5', name: 'System Design Prep', topic: 'System Design', desc: 'FAANG interview prep', count: 6, max: 12, pomodoro: true, active: true },
  { id: 'room-6', name: 'IoT Project Lab', topic: 'IoT', desc: 'Arduino & Raspberry Pi', count: 2, max: 6, pomodoro: false, active: false },
  { id: 'room-7', name: 'Python Beginners', topic: 'Python', desc: 'Learn Python from scratch', count: 8, max: 20, pomodoro: true, active: true },
  { id: 'room-8', name: 'Database Mastery', topic: 'Database', desc: 'SQL optimization & NoSQL', count: 3, max: 10, pomodoro: false, active: true },
];

export default function BrowseRooms() {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [scope, setScope] = useState<'global' | 'local'>('global');

  const filtered = ROOMS.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.topic.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedTopic && r.topic !== selectedTopic) return false;
    return true;
  });

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><BookOpen className="w-7 h-7 text-neon-cyan" /> Study Rooms</h1>
          <p className="text-slate-400 mt-1">Join topic-based rooms or create your own</p>
        </div>
        <Link to="/rooms/create" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Room</Link>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="glass rounded-2xl p-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rooms..." className="input-field pl-10 text-sm" />
          </div>
          <div className="flex gap-1 p-1 glass-light rounded-xl">
            <button onClick={() => setScope('global')} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1', scope === 'global' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400')}>
              <Globe className="w-3 h-3" /> Global
            </button>
            <button onClick={() => setScope('local')} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1', scope === 'local' ? 'bg-neon-violet/20 text-neon-violet' : 'text-slate-400')}>
              <MapPin className="w-3 h-3" /> Local
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedTopic(null)} className={cn('tag', !selectedTopic && 'tag-active')}>All</button>
          {TOPICS.slice(0, 10).map((t) => (
            <button key={t} onClick={() => setSelectedTopic(selectedTopic === t ? null : t)} className={cn('tag', selectedTopic === t && 'tag-active')}>{t}</button>
          ))}
        </div>
      </motion.div>

      {/* Room Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room) => (
          <Link key={room.id} to={`/rooms/${room.id}`} className="glass glass-hover rounded-2xl p-5 group block">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-neon-cyan" />
              </div>
              <div className="flex items-center gap-1">
                {room.active && <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />}
                <span className="text-xs text-slate-500">{room.active ? 'Active' : 'Idle'}</span>
              </div>
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-neon-cyan transition-colors">{room.name}</h3>
            <p className="text-xs text-slate-400 mb-3">{room.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="badge badge-cyan">{room.topic}</span>
                {room.pomodoro && <span className="badge badge-violet flex items-center gap-1"><Timer className="w-3 h-3" />Pomodoro</span>}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500"><Users className="w-3 h-3" />{room.count}/{room.max}</div>
            </div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
