import React, { useState } from 'react';
import { X, Copy, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { AssessmentSession } from '../../types';

interface DuplicateSessionModalProps {
  isOpen: boolean;
  session: AssessmentSession;
  onClose: () => void;
  onSuccess: (newSessionId: string) => void;
}

export const DuplicateSessionModal: React.FC<DuplicateSessionModalProps> = ({
  isOpen,
  session,
  onClose,
  onSuccess
}) => {
  const { duplicateSession } = useData();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    setError(null);

    try {
      const cloned = await duplicateSession(session.id);
      onSuccess(cloned.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menduplikasi sesi.');
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Copy className="w-4 h-4 text-teal-400" />
            </div>
            <h3 className="text-base font-bold text-white">Duplikasi Konfigurasi Sesi</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Anda akan menduplikasi konfigurasi dari sesi: <strong className="text-white">{session.name}</strong>.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="font-semibold text-teal-400 text-xs">Ketentuan Integritas Duplikasi:</p>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Menyalin daftar misi terpilih ({session.selectedMissionIds.length} misi) dan pengaturan petunjuk/percobaan.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Membuat sesi baru dalam status <strong>Draft</strong> dengan ID dan jadwal bersih.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>TIDAK menyalin respons, nilai, atau profil hasil murid</strong> untuk menjaga kemurnian asesmen baru.</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            {isDuplicating ? 'Menduplikasi...' : 'Duplikasi Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};
