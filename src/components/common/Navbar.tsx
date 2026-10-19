import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Compass, BookOpen, Layers, LogOut, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenPrivacy }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => onNavigate(user ? (user.role === 'teacher' ? 'teacher-dashboard' : 'student-hub') : 'landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">KNOW</span>
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase hidden sm:block">
              Diagnostic Assessment Platform
            </p>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {!user && (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'landing' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => onNavigate('content-packs')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'content-packs' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Bank Misi
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'about' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Tentang KNOW
              </button>
            </>
          )}

          {user && user.role === 'teacher' && (
            <>
              <button
                onClick={() => onNavigate('teacher-dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'teacher-dashboard' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('teacher-classes')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'teacher-classes' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Kelas Saya
              </button>
              <button
                onClick={() => onNavigate('content-packs')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'content-packs' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Bank Misi
              </button>
              <button
                onClick={() => onNavigate('reports-export')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'reports-export' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Laporan & Ekspor
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'about' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                About
              </button>
            </>
          )}

          {user && user.role === 'student' && (
            <>
              <button
                onClick={() => onNavigate('student-hub')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'student-hub' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Misi Saya
              </button>
              <button
                onClick={() => onNavigate('student-progress')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'student-progress' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Progres & Badge
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'about' ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                About
              </button>
            </>
          )}
        </nav>

        {/* Right Auth controls */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Daftar Akun
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  user.role === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'
                }`}>
                  {user.role === 'teacher' ? 'G' : 'M'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-medium text-white leading-tight truncate max-w-[120px]">{user.displayName}</p>
                  <p className="text-[10px] text-teal-400 capitalize">{user.role === 'teacher' ? 'Guru Pengampu' : 'Murid'}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onNavigate('landing');
                }}
                title="Keluar dari Akun"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
