import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Trophy, Flame, Clock, Check, X, Star, ArrowRight, Sparkles } from 'lucide-react';

const CHALLENGES = [
  {
    id: 'c1', question: 'What is the space complexity of a recursive fibonacci implementation?',
    topic: 'DSA', difficulty: 'Medium', points: 20,
    options: ['O(1)', 'O(n)', 'O(2^n)', 'O(log n)'], answer: 1,
    explanation: 'The recursive call stack can go at most n levels deep, so space complexity is O(n).'
  },
  {
    id: 'c2', question: 'In React, what hook replaces componentDidMount in functional components?',
    topic: 'React', difficulty: 'Easy', points: 10,
    options: ['useState', 'useEffect', 'useRef', 'useMemo'], answer: 1,
    explanation: 'useEffect with an empty dependency array [] runs once after mount, similar to componentDidMount.'
  },
  {
    id: 'c3', question: 'Which design pattern ensures only one instance of a class exists?',
    topic: 'System Design', difficulty: 'Easy', points: 10,
    options: ['Factory', 'Singleton', 'Observer', 'Strategy'], answer: 1,
    explanation: 'The Singleton pattern restricts instantiation to a single instance and provides global access.'
  },
];

export default function DailyChallenge() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const challenge = CHALLENGES[currentIdx];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === challenge.answer) {
      setTotalScore((s) => s + challenge.points);
    }
    setCompleted((c) => [...c, currentIdx]);
  };

  const nextChallenge = () => {
    if (currentIdx < CHALLENGES.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-amber/20 to-neon-pink/20 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-neon-amber" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Daily Challenges 🏆</h1>
          <p className="text-sm text-slate-400">Test yourself daily, build your streak</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Score', value: totalScore, icon: Star, color: 'text-neon-amber' },
          { label: 'Streak', value: '3 days', icon: Flame, color: 'text-neon-pink' },
          { label: 'Completed', value: `${completed.length}/${CHALLENGES.length}`, icon: Check, color: 'text-neon-emerald' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Progress */}
      <motion.div variants={item} className="flex gap-2">
        {CHALLENGES.map((_, i) => (
          <div key={i} className={cn('flex-1 h-2 rounded-full transition-all',
            completed.includes(i) ? 'bg-gradient-to-r from-neon-cyan to-neon-violet' : i === currentIdx ? 'bg-neon-violet/30' : 'bg-dark-600'
          )} />
        ))}
      </motion.div>

      {/* Challenge Card */}
      <motion.div key={challenge.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge badge-cyan">{challenge.topic}</span>
          <span className={cn('badge', challenge.difficulty === 'Easy' ? 'badge-emerald' : challenge.difficulty === 'Medium' ? 'badge-amber' : 'badge-pink')}>
            {challenge.difficulty}
          </span>
          <span className="badge badge-violet flex items-center gap-1"><Star className="w-3 h-3" />{challenge.points} pts</span>
        </div>

        <h2 className="text-lg font-bold mb-6">{challenge.question}</h2>

        <div className="space-y-3">
          {challenge.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
              className={cn('w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3',
                selected === null ? 'glass-light hover:bg-white/5'
                : i === challenge.answer ? 'bg-neon-emerald/20 border border-neon-emerald/30 text-neon-emerald'
                : selected === i ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 'glass-light opacity-40')}>
              <span className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center font-mono text-xs">{String.fromCharCode(65 + i)}</span>
              {opt}
              {selected !== null && i === challenge.answer && <Check className="w-4 h-4 ml-auto" />}
              {selected === i && i !== challenge.answer && <X className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>

        {selected !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className={cn('p-4 rounded-xl text-sm mb-4',
              selected === challenge.answer ? 'bg-neon-emerald/10 border border-neon-emerald/20' : 'bg-red-500/10 border border-red-500/20')}>
              <p className={selected === challenge.answer ? 'text-neon-emerald' : 'text-red-400'}>
                {selected === challenge.answer ? '✅ Correct!' : '❌ Incorrect'} — {challenge.explanation}
              </p>
            </div>
            {currentIdx < CHALLENGES.length - 1 && (
              <button onClick={nextChallenge} className="btn-primary w-full flex items-center justify-center gap-2">
                Next Challenge <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentIdx === CHALLENGES.length - 1 && (
              <div className="text-center p-4">
                <Sparkles className="w-8 h-8 text-neon-amber mx-auto mb-2" />
                <p className="font-bold text-lg">All challenges completed!</p>
                <p className="text-sm text-slate-400">Come back tomorrow for new ones</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
