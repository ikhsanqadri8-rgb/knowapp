import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Compass, Mail, Lock, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onOpenForgotPassword: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onOpenForgotPassword }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email || !password) {
      setFormError('Email dan kata sandi wajib diisi.');
      return;
    }

    const res = await login(email, password);
    if (res.success && res.user) {
      onNavigate(res.user.role === 'teacher' ? 'teacher-dashboard' : 'student-hub');
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 mb-3">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Masuk ke Platform KNOW</h2>
          <p className="text-xs text-slate-400">
            Akses dashboard guru atau selesaikan misi diagnostik murid
          </p>
        </div>

        {(formError || error) && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={onOpenForgotPassword}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
              >
                Lupa kata sandi?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 hover:brightness-110 active:scale-[0.99] text-white shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Belum memiliki akun?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-teal-400 font-semibold hover:underline"
            >
              Daftar akun baru
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
