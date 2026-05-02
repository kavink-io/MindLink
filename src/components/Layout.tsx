import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { cn, getReputationTier } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, Plus, Brain, Swords, MessageCircle,
  Trophy, BarChart3, Menu, X, LogOut, Shield, Eye, EyeOff, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/rooms', label: 'Study Rooms', icon: BookOpen },
  { path: '/ai', label: 'AI Assistant', icon: Brain },
  { path: '/battles', label: 'Mind Battles', icon: Swords },
  { path: '/thoughts', label: 'Thought Drops', icon: MessageCircle },
  { path: '/daily', label: 'Daily Challenge', icon: Trophy },
  { path: '/progress', label: 'Growth', icon: BarChart3 },
];

export default function Layout() {
  const { user, toggleIdentity, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const navigate = useNavigate();
  const tier = user ? getReputationTier(user.reputation) : null;

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-72 glass z-50 flex flex-col transition-transform duration-300',
          'border-r border-white/5',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">MinkLink</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Study Together</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-4 mt-4 rounded-xl glass-light">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: user.avatar.color + '25', border: `2px solid ${user.avatar.color}` }}
              >
                {user.avatar.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.isAnonymous ? 'Anonymous' : user.nickname}
                </p>
                {tier && (
                  <p className="text-xs" style={{ color: tier.color }}>
                    {tier.emoji} {tier.label} · {user.reputation} rep
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={toggleIdentity}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-white/5"
              style={{ color: user.isAnonymous ? '#06b6d4' : '#8b5cf6' }}
            >
              {user.isAnonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {user.isAnonymous ? 'Anonymous Mode' : 'Nickname Mode'}
            </button>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-neon-cyan/10 to-neon-violet/10 text-white border border-neon-violet/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            <span>E2E Encrypted · Privacy First</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-white/5 px-6 py-4 flex items-center justify-between lg:hidden">
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-bold gradient-text">MinkLink</span>
          </div>
          <div className="w-5" />
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
