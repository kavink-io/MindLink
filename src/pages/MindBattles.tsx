import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Swords, Trophy, Zap, Clock, Users, Play, Crown, Check, X, Star } from 'lucide-react';

interface Question {
  id: string; question: string; options: string[]; answer: number; topic: string;
}

const QUIZ_QUESTIONS: Question[] = [
  { id: 'q1', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], answer: 0, topic: 'Web Dev' },
  { id: 'q2', question: 'Which sorting algorithm has the best average time complexity?', options: ['Bubble Sort O(n²)', 'Merge Sort O(n log n)', 'Insertion Sort O(n²)', 'Selection Sort O(n²)'], answer: 1, topic: 'DSA' },
  { id: 'q3', question: 'What is the output of: typeof null in JavaScript?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], answer: 2, topic: 'JavaScript' },
  { id: 'q4', question: 'Which protocol is used for secure web communication?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], answer: 2, topic: 'Networks' },
  { id: 'q5', question: 'What is a closure in programming?', options: ['A function with no return', 'A function + its lexical scope', 'A class method', 'A recursive function'], answer: 1, topic: 'JavaScript' },
];

const MOCK_BATTLES = [
  { id: 'b1', name: 'DSA Showdown', topic: 'DSA', players: 4, maxPlayers: 6, status: 'waiting' },
  { id: 'b2', name: 'JS Brain Teaser', topic: 'JavaScript', players: 2, maxPlayers: 4, status: 'waiting' },
  { id: 'b3', name: 'System Design Arena', topic: 'System Design', players: 3, maxPlayers: 4, status: 'in-progress' },
];

export default function MindBattles() {
  const [mode, setMode] = useState<'lobby' | 'battle' | 'results'>('lobby');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);

  const startBattle = () => {
    setMode('battle');
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const submitAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === QUIZ_QUESTIONS[currentQ].answer;
    if (correct) setScore((s) => s + 100 + timeLeft * 5);
    setAnswers((a) => [...a, idx]);

    setTimeout(() => {
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelectedAnswer(null);
        setTimeLeft(15);
      } else {
        setMode('results');
      }
    }, 1500);
  };

  const q = QUIZ_QUESTIONS[currentQ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      {mode === 'lobby' && (
        <>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-amber/20 to-neon-pink/20 flex items-center justify-center">
              <Swords className="w-6 h-6 text-neon-amber" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mind Battles 🎮</h1>
              <p className="text-sm text-slate-400">Challenge your knowledge in real-time quizzes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-6 glass-hover cursor-pointer group" onClick={startBattle}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1">Quick Battle</h3>
              <p className="text-sm text-slate-400">5 random questions, test your speed!</p>
              <button className="btn-primary mt-4 w-full flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Start Now
              </button>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-neon-amber" /> Leaderboard</h3>
              <div className="space-y-2">
                {['CosmicOwl42', 'NeonFox88', 'SilentWolf11', 'BrightEagle7'].map((name, i) => (
                  <div key={name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-lg w-6 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
                    <span className="flex-1 text-sm font-medium">{name}</span>
                    <span className="text-sm font-bold text-neon-amber">{(1500 - i * 280)}pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 className="section-title mt-8">Open Battles</h2>
          <div className="space-y-3">
            {MOCK_BATTLES.map((b) => (
              <div key={b.id} className="glass glass-hover rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-violet/20 flex items-center justify-center"><Swords className="w-5 h-5 text-neon-violet" /></div>
                  <div>
                    <h3 className="font-semibold text-sm">{b.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="badge badge-cyan">{b.topic}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.players}/{b.maxPlayers}</span>
                    </div>
                  </div>
                </div>
                <button onClick={startBattle} className={cn('btn-primary px-4 py-2 text-xs', b.status === 'in-progress' && 'opacity-50')} disabled={b.status === 'in-progress'}>
                  {b.status === 'waiting' ? 'Join' : 'In Progress'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'battle' && q && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="badge badge-cyan">Question {currentQ + 1}/{QUIZ_QUESTIONS.length}</span>
            <span className="badge badge-amber">{q.topic}</span>
            <span className="badge badge-violet flex items-center gap-1"><Star className="w-3 h-3" />{score} pts</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-dark-600 mb-8 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet transition-all" style={{ width: `${((currentQ) / QUIZ_QUESTIONS.length) * 100}%` }} />
          </div>
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => submitAnswer(i)} disabled={selectedAnswer !== null}
                  className={cn('w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3',
                    selectedAnswer === null ? 'glass-light hover:bg-white/5 hover:border-neon-cyan/30'
                    : i === q.answer ? 'bg-neon-emerald/20 border border-neon-emerald/30 text-neon-emerald'
                    : selectedAnswer === i ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 'glass-light opacity-40')}>
                  <span className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center font-mono text-xs">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{opt}</span>
                  {selectedAnswer !== null && i === q.answer && <Check className="w-5 h-5 text-neon-emerald" />}
                  {selectedAnswer === i && i !== q.answer && <X className="w-5 h-5 text-red-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {mode === 'results' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center glass rounded-2xl p-10">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold mb-2">Battle Complete!</h2>
          <p className="text-slate-400 mb-6">Great effort!</p>
          <div className="text-5xl font-black gradient-text mb-6">{score} pts</div>
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-emerald">{answers.filter((a, i) => a === QUIZ_QUESTIONS[i].answer).length}</div>
              <div className="text-xs text-slate-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{answers.filter((a, i) => a !== QUIZ_QUESTIONS[i].answer).length}</div>
              <div className="text-xs text-slate-500">Wrong</div>
            </div>
          </div>
          <button onClick={() => setMode('lobby')} className="btn-primary w-full py-3">Back to Lobby</button>
        </motion.div>
      )}
    </motion.div>
  );
}
