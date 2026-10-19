import React, { useState } from 'react';
import { useAuth, VALID_EDUCATOR_CODE } from '../../context/AuthContext';
import { Compass, Mail, Lock, User, ShieldCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import type { UserRole } from '../../types';

interface RegisterPageProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onOpenPrivacy }) => {
  const { register, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const [role, setRole] = useState<UserRole>('teacher');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [educatorCode, setEducatorCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!agreedTerms) {
      setFormError('Anda wajib menyetujui Kebijakan Privasi & Ketentuan Penggunaan.');
      return;
    }

    if (role === 'teacher' && !educatorCode) {
      setFormError('Kode aktivasi Guru wajib diisi untuk mengaktifkan hak akses pengampu kelas.');
      return;
    }

    const res = await register(email, password, displayName, role, educatorCode);
    if (res.success) {
      onNavigate(role === 'teacher' ? 'teacher-dashboard' : 'student-hub');
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  const handleGoogleRegister = async () => {
    setFormError(null);
    clearError();

    if (!agreedTerms) {
      setFormError('Anda wajib menyetujui Kebijakan Privasi & Ketentuan Penggunaan.');
      return;
    }

    if (role === 'teacher' && !educatorCode) {
      setFormError('Kode aktivasi Guru wajib diisi sebelum mendaftar dengan Google.');
      return;
    }

    const res = await loginWithGoogle(role, educatorCode);
    if (res.success && res.user) {
      onNavigate(res.user.role === 'teacher' ? 'teacher-dashboard' : 'student-hub');
    } else if (res.error) {
      setFormError(res.error);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top brand */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 mb-3">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Registrasi Akun KNOW</h2>
          <p className="text-xs text-slate-400">
            Daftarkan akun resmi untuk memulai asesmen diagnostik lintas perangkat
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              role === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Guru Pengampu
          </button>
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Murid SMK
          </button>
        </div>

        {(formError || error) && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Educator Activation Code (Teacher only - shown up top for both Google and Email registration) */}
        {role === 'teacher' && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-indigo-300">
                Kode Aktivasi Guru Terverifikasi
              </label>
              <span className="text-[10px] text-indigo-400 font-mono">Diperlukan</span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                required
                value={educatorCode}
                onChange={(e) => setEducatorCode(e.target.value)}
                placeholder="GURU-KNOW-2026"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-indigo-700/60 rounded-xl text-sm text-white placeholder-indigo-400/50 font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Gunakan token aktivasi edukator: <code className="text-indigo-300 font-mono bg-indigo-950 px-1 py-0.5 rounded">{VALID_EDUCATOR_CODE}</code>.
            </p>
          </div>
        )}

        {/* Google One-Click Registration */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800/80 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-sm mb-6 disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Daftar Sebagai {role === 'teacher' ? 'Guru' : 'Murid'} dengan Akun Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500">Atau daftar dengan formulir email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={role === 'teacher' ? 'Budi Santoso, S.Kom.' : 'Rizky Pratama'}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kata Sandi (Minimal 6 Karakter)
            </label>
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

          {/* Terms checkbox */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-1 rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="terms" className="text-xs text-slate-400 leading-normal">
              Saya menyetujui{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-teal-400 underline hover:text-teal-300"
              >
                Kebijakan Privasi
              </button>{' '}
              dan memahami bahwa KNOW melindungi data murid tanpa penjualan data komersial.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 hover:brightness-110 active:scale-[0.99] text-white shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isLoading ? 'Mendaftarkan Akun...' : `Daftar Sebagai ${role === 'teacher' ? 'Guru' : 'Murid'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Sudah memiliki akun terdaftar?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-teal-400 font-semibold hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
