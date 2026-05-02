import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Toaster } from 'sonner';
import Landing from '@/pages/Landing';
import OnboardVibe from '@/pages/OnboardVibe';
import Dashboard from '@/pages/Dashboard';
import StudyRoom from '@/pages/StudyRoom';
import CreateRoom from '@/pages/CreateRoom';
import BrowseRooms from '@/pages/BrowseRooms';
import AIAssistant from '@/pages/AIAssistant';
import MindBattles from '@/pages/MindBattles';
import ThoughtDrops from '@/pages/ThoughtDrops';
import DailyChallenge from '@/pages/DailyChallenge';
import CognitiveDashboard from '@/pages/CognitiveDashboard';
import Layout from '@/components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isOnboarded } = useAuthStore();
  if (!token) return <Navigate to="/" replace />;
  if (!isOnboarded) return <Navigate to="/onboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-animated" />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 15, 42, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: '#f8fafc',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboard" element={<OnboardVibe />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><BrowseRooms /></ProtectedRoute>} />
          <Route path="/rooms/create" element={<ProtectedRoute><CreateRoom /></ProtectedRoute>} />
          <Route path="/rooms/:roomId" element={<ProtectedRoute><StudyRoom /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/battles" element={<ProtectedRoute><MindBattles /></ProtectedRoute>} />
          <Route path="/thoughts" element={<ProtectedRoute><ThoughtDrops /></ProtectedRoute>} />
          <Route path="/daily" element={<ProtectedRoute><DailyChallenge /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><CognitiveDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
