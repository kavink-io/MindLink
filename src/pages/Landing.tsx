import { useNavigate } from 'react-router-dom';
import { useAuthStore, createAnonymousSession } from '@/stores/authStore';
import { motion } from 'framer-motion';
import {
  Shield, Zap, Brain, Users, Eye, EyeOff, Timer, MessageCircle,
  Swords, BarChart3, Lock, Sparkles, ArrowRight, Globe, Lightbulb
} from 'lucide-react';

const FEATURES = [
  { icon: Users, title: 'Vibe Matching', desc: 'Connect by mood & interests, not profiles', color: '#06b6d4' },
  { icon: Timer, title: 'Study Rooms', desc: 'Anonymous rooms with Pomodoro timer', color: '#8b5cf6' },
  { icon: Brain, title: 'AI Assistant', desc: 'Explain, quiz, summarize on demand', color: '#10b981' },
  { icon: Swords, title: 'Mind Battles', desc: 'Gamified quizzes with live competition', color: '#f59e0b' },
  { icon: MessageCircle, title: 'Thought Drops', desc: 'Post questions, get crowd answers', color: '#ec4899' },
  { icon: BarChart3, title: 'Growth Tracker', desc: 'Cognitive growth dashboard', color: '#6366f1' },
  { icon: EyeOff, title: 'Dual Identity', desc: 'Switch between anonymous & nickname', color: '#14b8a6' },
  { icon: Lock, title: 'E2E Encrypted', desc: 'End-to-end encrypted chats', color: '#f43f5e' },
  { icon: Globe, title: 'Topic Rooms', desc: 'Java, IoT, AI, and more', color: '#a855f7' },
  { icon: Lightbulb, title: 'Doubt Detection', desc: 'AI suggests help automatically', color: '#22d3ee' },
  { icon: Shield, title: 'Privacy First', desc: 'No data storage, no tracking', color: '#84cc16' },
  { icon: Sparkles, title: 'Daily Challenges', desc: 'Daily questions to keep you sharp', color: '#fb923c' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleEnter = () => {
    const session = createAnonymousSession();
    const fakeToken = btoa(JSON.stringify({ id: session.id, ts: Date.now() }));
    login(fakeToken, session);
    navigate('/onboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-emerald/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20">
        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center animate-pulse-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MinkLink</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            <span>Privacy First</span>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <span className="badge badge-violet text-xs px-4 py-1.5">
              <Lock className="w-3 h-3" />
              100% Anonymous · Zero Data Storage
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Study Together,{' '}
            <span className="gradient-text">Anonymously</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with students who share your vibe. Join study rooms, battle in quizzes,
            get AI-powered help — all without revealing who you are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              id="enter-anonymous-btn"
              onClick={handleEnter}
              className="btn-primary text-lg px-10 py-4 flex items-center gap-3 group"
            >
              <EyeOff className="w-5 h-5" />
              Enter Anonymously
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              No sign-up · No personal data
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-12 mt-20 mb-20"
        >
          {[
            { value: '🔒', label: 'E2E Encrypted' },
            { value: '🧠', label: 'AI Powered' },
            { value: '🎮', label: 'Gamified Learning' },
            { value: '👻', label: 'Fully Anonymous' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-2">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-center text-2xl font-bold mb-12">
            Everything you need to{' '}
            <span className="gradient-text">learn better</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                className="glass glass-hover rounded-2xl p-5 cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: feature.color + '20' }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-20"
        >
          <div className="glass rounded-3xl p-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Ready to study smarter?</h3>
            <p className="text-slate-400 mb-6">No accounts. No tracking. Just learning.</p>
            <button
              onClick={handleEnter}
              className="btn-primary px-8 py-3 flex items-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4" />
              Get Started Now
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 text-xs text-slate-600">
          <p>MinkLink © 2026 · Built with privacy in mind</p>
        </div>
      </div>
    </div>
  );
}
