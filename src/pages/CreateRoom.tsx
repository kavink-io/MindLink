import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { TOPICS, cn, generateRoomId } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Clock, Users, ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function CreateRoom() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [pomDuration, setPomDuration] = useState(25);
  const [maxParticipants, setMaxParticipants] = useState(10);

  const handleCreate = () => {
    if (!name || !topic) return;
    const roomId = generateRoomId();
    navigate(`/rooms/${roomId}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/rooms')} className="btn-ghost text-sm flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Rooms
      </button>

      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 flex items-center justify-center">
            <Plus className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create Study Room</h1>
            <p className="text-sm text-slate-400">Set up an anonymous study session</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Room Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. DSA Grind Session" className="input-field" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Topic</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.slice(0, 12).map((t) => (
                <button key={t} onClick={() => setTopic(t)}
                  className={cn('px-4 py-2 rounded-xl text-sm transition-all', topic === t ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 text-white' : 'glass text-slate-400 hover:text-white')}>
                  {topic === t && <Check className="w-3 h-3 inline mr-1" />}{t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will you study?" className="input-field resize-none h-20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-1"><Clock className="w-4 h-4" /> Pomodoro (min)</label>
              <input type="number" value={pomDuration} onChange={(e) => setPomDuration(Number(e.target.value))} min={5} max={60} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-1"><Users className="w-4 h-4" /> Max Participants</label>
              <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} min={2} max={50} className="input-field" />
            </div>
          </div>

          <button onClick={handleCreate} disabled={!name || !topic}
            className={cn('w-full btn-primary py-4 text-lg flex items-center justify-center gap-2', (!name || !topic) && 'opacity-50 cursor-not-allowed')}>
            <Sparkles className="w-5 h-5" /> Create Room
          </button>
        </div>
      </div>
    </motion.div>
  );
}
