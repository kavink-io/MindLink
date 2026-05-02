import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { MOODS, TOPICS, MENTAL_STATES, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

export default function OnboardVibe() {
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const { user, setVibe, setOnboarded } = useAuthStore();
  const navigate = useNavigate();

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleFinish = () => {
    if (selectedMood && selectedTopics.length > 0 && selectedState) {
      setVibe(selectedMood, selectedTopics, selectedState);
      setOnboarded(true);
      navigate('/dashboard');
    }
  };

  const canProceed = [
    selectedMood !== null,
    selectedTopics.length > 0,
    selectedState !== null,
  ];

  const steps = [
    {
      title: "What's your vibe right now?",
      subtitle: 'We\'ll match you with students in a similar mood',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.id)}
              className={cn(
                'glass glass-hover rounded-2xl p-6 text-center transition-all duration-300',
                selectedMood === mood.id && 'ring-2'
              )}
              style={{
                borderColor: selectedMood === mood.id ? mood.color : undefined,
                boxShadow: selectedMood === mood.id ? `0 0 30px ${mood.color}30` : undefined,
              }}
            >
              <div className="text-4xl mb-3">{mood.emoji}</div>
              <div className="text-sm font-semibold">{mood.label}</div>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: 'What are you studying?',
      subtitle: 'Pick topics to find matching study rooms',
      content: (
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
          {TOPICS.map((topic) => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTopic(topic)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                selectedTopics.includes(topic)
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 text-white'
                  : 'glass text-slate-400 hover:text-white'
              )}
            >
              {selectedTopics.includes(topic) && <Check className="w-3 h-3 inline mr-1" />}
              {topic}
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: 'How are you feeling?',
      subtitle: 'Tag your mental state — help us match you better',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto">
          {MENTAL_STATES.map((state) => (
            <motion.button
              key={state.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedState(state.id)}
              className={cn(
                'glass glass-hover rounded-2xl p-5 text-center transition-all duration-300',
                selectedState === state.id && 'ring-2 ring-neon-emerald border-neon-emerald/30'
              )}
              style={{
                boxShadow: selectedState === state.id ? '0 0 30px rgba(16, 185, 129, 0.2)' : undefined,
              }}
            >
              <div className="text-3xl mb-2">{state.emoji}</div>
              <div className="text-sm font-semibold">{state.label}</div>
            </motion.button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-violet/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-dark-600">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }}
                initial={{ width: '0%' }}
                animate={{ width: i <= step ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
        </div>

        {/* Avatar Preview */}
        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-2"
              style={{ backgroundColor: user.avatar.color + '25', border: `3px solid ${user.avatar.color}` }}
            >
              {user.avatar.emoji}
            </div>
            <p className="text-sm text-slate-400">
              You are <span className="text-white font-semibold">{user.nickname}</span>
            </p>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center mb-2">{steps[step].title}</h2>
            <p className="text-slate-400 text-center mb-10">{steps[step].subtitle}</p>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={cn('btn-ghost flex items-center gap-2', step === 0 && 'opacity-0 pointer-events-none')}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed[step]}
              className={cn(
                'btn-primary flex items-center gap-2',
                !canProceed[step] && 'opacity-50 cursor-not-allowed'
              )}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canProceed[step]}
              className={cn(
                'btn-primary flex items-center gap-2',
                !canProceed[step] && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Sparkles className="w-4 h-4" /> Start Learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
