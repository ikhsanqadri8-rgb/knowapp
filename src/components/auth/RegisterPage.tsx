import React, { useState } from 'react';
import { useAuth, VALID_EDUCATOR_CODE } from '../../context/AuthContext';
import { Compass, Mail, Lock, User, ShieldCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import type { UserRole } from '../../types';

interface RegisterPageProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onOpenPrivacy }) => {
  const { register, isLoading, error, clearError } = useAuth();
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
      // Registered & logged in
      onNavigate(role === 'teacher' ? 'teacher-dashboard' : 'student-hub');
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
            Daftarkan akun resmi untuk memulai asesmen diagnostik
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

          {/* Educator Activation Code (Teacher only) */}
          {role === 'teacher' && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
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
                KNOW menerapkan RBAC ketat. Untuk pengujian institusi resmi, gunakan token aktivasi edukator: <code className="text-indigo-300 font-mono bg-indigo-950 px-1 py-0.5 rounded">{VALID_EDUCATOR_CODE}</code>.
              </p>
            </div>
          )}

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
