import React, { useState } from 'react';
import { X, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setResultMsg(null);

    const res = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (res.success) {
      setResultMsg({ type: 'success', text: res.message });
    } else {
      setResultMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-teal-400" />
            </div>
            <h3 className="text-base font-bold text-white">Pemulihan Kata Sandi</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Masukkan alamat email yang Anda gunakan saat mendaftar. Sistem akan memverifikasi dan mengirimkan instruksi pembaruan kata sandi.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Alamat Email Terdaftar
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {resultMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              resultMsg.type === 'success' 
                ? 'bg-teal-950/40 border border-teal-800/50 text-teal-200' 
                : 'bg-rose-950/40 border border-rose-800/50 text-rose-200'
            }`}>
              {resultMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{resultMsg.text}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'Kirim Tautan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
