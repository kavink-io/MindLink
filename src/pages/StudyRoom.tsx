import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { cn, formatTime, MOODS, MENTAL_STATES, generateNickname } from '@/lib/utils';
import {
  Timer, Send, Users, MessageCircle, HelpCircle, Brain,
  Play, Pause, RotateCcw, ArrowLeft, ChevronRight, Sparkles,
  Shield, TrendingUp, AlertCircle
} from 'lucide-react';

interface Message {
  id: string; sender: string; senderEmoji: string; content: string;
  timestamp: Date; isSystem: boolean; isDoubt: boolean;
}

interface Doubt {
  id: string; text: string; upvotes: number; answers: string[];
  isResolved: boolean; author: string;
}

interface Participant {
  id: string; nickname: string; emoji: string; mentalState: string;
  progress: number; topic: string;
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p1', nickname: 'CosmicOwl42', emoji: '🦉', mentalState: 'deep-focus', progress: 72, topic: 'Binary Trees' },
  { id: 'p2', nickname: 'NeonFox88', emoji: '🦊', mentalState: 'light-study', progress: 45, topic: 'Graph Theory' },
  { id: 'p3', nickname: 'SilentWolf11', emoji: '🐺', mentalState: 'need-help', progress: 30, topic: 'Dynamic Prog.' },
];

export default function StudyRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'System', senderEmoji: '🤖', content: 'Welcome to the study room! E2E encryption is active 🔐', timestamp: new Date(), isSystem: true, isDoubt: false },
    { id: '2', sender: 'CosmicOwl42', senderEmoji: '🦉', content: 'Hey everyone! Working on tree traversal today', timestamp: new Date(), isSystem: false, isDoubt: false },
    { id: '3', sender: 'NeonFox88', senderEmoji: '🦊', content: 'Can someone explain the difference between BFS and DFS?', timestamp: new Date(), isSystem: false, isDoubt: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [doubts, setDoubts] = useState<Doubt[]>([
    { id: 'd1', text: 'How does Dijkstra handle negative weights?', upvotes: 3, answers: ['It doesn\'t — use Bellman-Ford for negative weights!'], isResolved: false, author: 'SilentWolf11' },
  ]);
  const [newDoubt, setNewDoubt] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'doubts' | 'participants'>('chat');

  // Pomodoro
  const [pomTime, setPomTime] = useState(25 * 60);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomBreak, setPomBreak] = useState(false);
  const [pomCycle, setPomCycle] = useState(0);
  const pomRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const totalPomTime = pomBreak ? 5 * 60 : 25 * 60;

  useEffect(() => {
    if (pomRunning) {
      pomRef.current = setInterval(() => {
        setPomTime((t) => {
          if (t <= 1) {
            setPomBreak((b) => !b);
            setPomCycle((c) => c + 1);
            return pomBreak ? 25 * 60 : 5 * 60;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(pomRef.current);
  }, [pomRunning, pomBreak]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const isDoubt = newMessage.includes('?') || newMessage.toLowerCase().startsWith('how') || newMessage.toLowerCase().startsWith('why');
    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(), sender: user?.isAnonymous ? 'Anonymous' : user?.nickname || 'You',
      senderEmoji: user?.avatar.emoji || '👤', content: newMessage,
      timestamp: new Date(), isSystem: false, isDoubt,
    }]);
    setNewMessage('');
    // Simulate response
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), sender: MOCK_PARTICIPANTS[Math.floor(Math.random() * MOCK_PARTICIPANTS.length)].nickname,
        senderEmoji: '🦉', content: isDoubt ? 'Great question! Let me think about that...' : 'Nice progress! Keep going 💪',
        timestamp: new Date(), isSystem: false, isDoubt: false,
      }]);
    }, 1500);
  };

  const postDoubt = () => {
    if (!newDoubt.trim()) return;
    setDoubts((prev) => [...prev, { id: crypto.randomUUID(), text: newDoubt, upvotes: 0, answers: [], isResolved: false, author: user?.nickname || 'Anonymous' }]);
    setNewDoubt('');
  };

  const progress = ((totalPomTime - pomTime) / totalPomTime) * 100;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/rooms')} className="btn-ghost text-sm flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Back to Rooms</button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Room Header + Pomodoro */}
          <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            {/* Pomodoro Timer */}
            <div className="flex-shrink-0">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="6" />
                  <circle cx="60" cy="60" r="54" fill="none" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    className="pomodoro-ring" style={{ stroke: pomBreak ? '#10b981' : '#06b6d4' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-mono">{formatTime(pomTime)}</span>
                  <span className="text-xs text-slate-400">{pomBreak ? 'Break' : `Focus #${pomCycle + 1}`}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <button onClick={() => setPomRunning(!pomRunning)} className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1">
                  {pomRunning ? <><Pause className="w-3 h-3" />Pause</> : <><Play className="w-3 h-3" />Start</>}
                </button>
                <button onClick={() => { setPomTime(25*60); setPomRunning(false); setPomBreak(false); }} className="btn-secondary px-3 py-1.5 text-xs">
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Room Info */}
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">{roomId === 'room-1' ? 'DSA Grind Session' : roomId === 'room-2' ? 'React Deep Dive' : 'AI/ML Study Group'}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-cyan">DSA</span>
                <span className="badge badge-emerald flex items-center gap-1"><Shield className="w-3 h-3" />E2E Encrypted</span>
                <span className="badge badge-violet flex items-center gap-1"><Users className="w-3 h-3" />{MOCK_PARTICIPANTS.length + 1} online</span>
              </div>
              {/* Progress bars */}
              <div className="space-y-2">
                {MOCK_PARTICIPANTS.slice(0, 2).map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <span>{p.emoji}</span>
                    <span className="text-slate-400 w-20 truncate">{p.nickname}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-dark-600 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-slate-500 w-8 text-right">{p.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 glass rounded-xl">
            {(['chat', 'doubts'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                  activeTab === tab ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 text-white' : 'text-slate-400 hover:text-white')}>
                {tab === 'chat' ? <MessageCircle className="w-4 h-4 inline mr-1" /> : <HelpCircle className="w-4 h-4 inline mr-1" />}{tab}
              </button>
            ))}
          </div>

          {/* Chat Panel */}
          {activeTab === 'chat' && (
            <div className="glass rounded-2xl flex flex-col" style={{ height: '400px' }}>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={cn('flex gap-3', msg.sender === (user?.isAnonymous ? 'Anonymous' : user?.nickname) ? 'flex-row-reverse' : '')}>
                    <div className="text-xl flex-shrink-0">{msg.senderEmoji}</div>
                    <div className={cn(msg.isSystem ? 'text-center w-full text-xs text-slate-500 py-2' :
                      msg.sender === (user?.isAnonymous ? 'Anonymous' : user?.nickname) ? 'chat-bubble chat-bubble-self' : 'chat-bubble chat-bubble-other')}>
                      {!msg.isSystem && <p className="text-xs text-slate-400 mb-1">{msg.sender}</p>}
                      <p className="text-sm">{msg.content}</p>
                      {msg.isDoubt && !msg.isSystem && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                          <AlertCircle className="w-3 h-3" /> Doubt detected
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-white/5 flex gap-2">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message (encrypted)..." className="input-field text-sm flex-1" />
                <button onClick={sendMessage} className="btn-primary px-4"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Doubts Panel */}
          {activeTab === 'doubts' && (
            <div className="glass rounded-2xl p-4 space-y-3" style={{ minHeight: '400px' }}>
              <div className="flex gap-2 mb-4">
                <input value={newDoubt} onChange={(e) => setNewDoubt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && postDoubt()}
                  placeholder="Ask a doubt anonymously..." className="input-field text-sm flex-1" />
                <button onClick={postDoubt} className="btn-primary px-4 text-sm">Ask</button>
              </div>
              {doubts.map((d) => (
                <div key={d.id} className="glass-light rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">{d.text}</p>
                      <p className="text-xs text-slate-500">by {d.author}</p>
                    </div>
                    <button onClick={() => setDoubts((prev) => prev.map((x) => x.id === d.id ? { ...x, upvotes: x.upvotes + 1 } : x))}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs glass hover:bg-white/5">
                      <TrendingUp className="w-3 h-3" /> {d.upvotes}
                    </button>
                  </div>
                  {d.answers.length > 0 && (
                    <div className="mt-3 pl-3 border-l-2 border-neon-emerald/30">
                      {d.answers.map((a, i) => (
                        <p key={i} className="text-sm text-slate-300">{a}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Participants */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Participants</h3>
            <div className="space-y-3">
              {MOCK_PARTICIPANTS.map((p) => {
                const state = MENTAL_STATES.find((s) => s.id === p.mentalState);
                return (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="text-lg">{p.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{p.nickname}</p>
                      <p className="text-[10px] text-slate-500">{state?.emoji} {state?.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Brain className="w-4 h-4" /> AI Summary</h3>
            <button className="w-full btn-secondary text-xs flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" /> Summarize Chat
            </button>
            <p className="text-xs text-slate-500 mt-2 text-center">AI will create study notes from the discussion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
