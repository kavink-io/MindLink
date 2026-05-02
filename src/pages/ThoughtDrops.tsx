import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { cn, timeAgo, TOPICS } from '@/lib/utils';
import { MessageCircle, TrendingUp, Send, Filter, Brain, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ThoughtDrop {
  id: string; text: string; topic: string; author: string; authorEmoji: string;
  upvotes: number; answers: { id: string; text: string; author: string; upvotes: number }[];
  createdAt: Date; hasAIAnswer: boolean;
}

const MOCK_THOUGHTS: ThoughtDrop[] = [
  {
    id: 't1', text: 'Can someone explain the difference between TCP and UDP in simple terms?', topic: 'Networks',
    author: 'CosmicOwl42', authorEmoji: '🦉', upvotes: 12, createdAt: new Date(Date.now() - 3600000),
    hasAIAnswer: true,
    answers: [
      { id: 'a1', text: 'TCP = reliable delivery (like registered mail). UDP = fast but no guarantee (like shouting across a room). TCP has handshakes, UDP just sends!', author: 'NeonFox88', upvotes: 8 },
      { id: 'a2', text: '🤖 AI: TCP (Transmission Control Protocol) ensures ordered, error-checked delivery. UDP (User Datagram Protocol) is connectionless and faster but unreliable. Use TCP for web/email, UDP for streaming/gaming.', author: 'AI Assistant', upvotes: 5 },
    ],
  },
  {
    id: 't2', text: 'What\'s the best approach to learn system design for interviews?', topic: 'System Design',
    author: 'SilentWolf11', authorEmoji: '🐺', upvotes: 18, createdAt: new Date(Date.now() - 7200000),
    hasAIAnswer: false,
    answers: [
      { id: 'a3', text: 'Start with "Designing Data-Intensive Applications" book, then practice on system design primer GitHub repo!', author: 'BrightEagle7', upvotes: 12 },
    ],
  },
  {
    id: 't3', text: 'Why does JavaScript have both == and ===? When should I use which?', topic: 'JavaScript',
    author: 'AzurePanda55', authorEmoji: '🐼', upvotes: 9, createdAt: new Date(Date.now() - 1800000),
    hasAIAnswer: false, answers: [],
  },
];

export default function ThoughtDrops() {
  const { user } = useAuthStore();
  const [thoughts, setThoughts] = useState(MOCK_THOUGHTS);
  const [newThought, setNewThought] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string | null>(null);
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});

  const postThought = () => {
    if (!newThought.trim()) return;
    setThoughts((prev) => [{
      id: crypto.randomUUID(), text: newThought, topic: newTopic || 'General',
      author: user?.isAnonymous ? 'Anonymous' : user?.nickname || 'Anon',
      authorEmoji: user?.avatar.emoji || '👤', upvotes: 0, answers: [],
      createdAt: new Date(), hasAIAnswer: false,
    }, ...prev]);
    setNewThought('');
    setNewTopic('');
  };

  const postAnswer = (thoughtId: string) => {
    const text = newAnswers[thoughtId];
    if (!text?.trim()) return;
    setThoughts((prev) => prev.map((t) => t.id === thoughtId ? {
      ...t, answers: [...t.answers, { id: crypto.randomUUID(), text, author: user?.nickname || 'Anonymous', upvotes: 0 }]
    } : t));
    setNewAnswers((prev) => ({ ...prev, [thoughtId]: '' }));
  };

  const filtered = filterTopic ? thoughts.filter((t) => t.topic === filterTopic) : thoughts;

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-violet/20 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-neon-pink" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Thought Drops 💭</h1>
          <p className="text-sm text-slate-400">Drop questions, get crowd answers</p>
        </div>
      </motion.div>

      {/* New Thought */}
      <motion.div variants={item} className="glass rounded-2xl p-5">
        <textarea value={newThought} onChange={(e) => setNewThought(e.target.value)} placeholder="Drop a thought or question..." className="input-field resize-none h-20 mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['DSA', 'JavaScript', 'React', 'AI/ML', 'General'].map((t) => (
              <button key={t} onClick={() => setNewTopic(t)} className={cn('tag text-xs', newTopic === t && 'tag-active')}>{t}</button>
            ))}
          </div>
          <button onClick={postThought} disabled={!newThought.trim()} className={cn('btn-primary px-4 py-2 text-sm flex items-center gap-1', !newThought.trim() && 'opacity-50')}>
            <Send className="w-3 h-3" /> Drop
          </button>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div variants={item} className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterTopic(null)} className={cn('tag', !filterTopic && 'tag-active')}>All</button>
        {['DSA', 'JavaScript', 'React', 'Networks', 'System Design'].map((t) => (
          <button key={t} onClick={() => setFilterTopic(filterTopic === t ? null : t)} className={cn('tag', filterTopic === t && 'tag-active')}>{t}</button>
        ))}
      </motion.div>

      {/* Thoughts Feed */}
      <div className="space-y-4">
        {filtered.map((thought) => (
          <motion.div key={thought.id} variants={item} className="glass rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="text-xl">{thought.authorEmoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{thought.author}</span>
                  <span className="text-xs text-slate-500">{timeAgo(thought.createdAt)}</span>
                  <span className="badge badge-cyan text-xs">{thought.topic}</span>
                </div>
                <p className="text-sm mb-3">{thought.text}</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setThoughts((prev) => prev.map((t) => t.id === thought.id ? { ...t, upvotes: t.upvotes + 1 } : t))}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-neon-cyan transition-colors">
                    <TrendingUp className="w-3 h-3" /> {thought.upvotes}
                  </button>
                  <button onClick={() => setExpanded(expanded === thought.id ? null : thought.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-neon-violet transition-colors">
                    <MessageCircle className="w-3 h-3" /> {thought.answers.length} answers
                    {expanded === thought.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {thought.hasAIAnswer && <span className="flex items-center gap-1 text-xs text-neon-emerald"><Brain className="w-3 h-3" /> AI answered</span>}
                </div>
              </div>
            </div>

            {expanded === thought.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 ml-8 space-y-3">
                {thought.answers.map((a) => (
                  <div key={a.id} className="glass-light rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">{a.author}</span>
                      {a.author === 'AI Assistant' && <span className="badge badge-emerald text-xs"><Brain className="w-2 h-2" /> AI</span>}
                    </div>
                    <p className="text-sm text-slate-300">{a.text}</p>
                    <button onClick={() => setThoughts((prev) => prev.map((t) => t.id === thought.id ? {
                      ...t, answers: t.answers.map((x) => x.id === a.id ? { ...x, upvotes: x.upvotes + 1 } : x)
                    } : t))} className="flex items-center gap-1 text-xs text-slate-500 hover:text-neon-cyan mt-2">
                      <TrendingUp className="w-3 h-3" /> {a.upvotes}
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newAnswers[thought.id] || ''} onChange={(e) => setNewAnswers((prev) => ({ ...prev, [thought.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && postAnswer(thought.id)}
                    placeholder="Write an answer..." className="input-field text-sm flex-1" />
                  <button onClick={() => postAnswer(thought.id)} className="btn-primary px-3"><Send className="w-3 h-3" /></button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
