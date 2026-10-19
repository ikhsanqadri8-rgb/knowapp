import React, { useState } from 'react';
import { X, Trash2, Archive, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { AssessmentSession } from '../../types';

interface DeleteSessionModalProps {
  isOpen: boolean;
  session: AssessmentSession;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteSessionModal: React.FC<DeleteSessionModalProps> = ({
  isOpen,
  session,
  onClose,
  onSuccess
}) => {
  const { deleteSession, archiveSession, getSessionResponses } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const responsesCount = getSessionResponses(session.id).length;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteSession(session.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus sesi.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    setIsDeleting(true);
    try {
      await archiveSession(session.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal mengarsipkan sesi.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-rose-900/40 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-white">Hapus Sesi Asesmen</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Anda akan menghapus sesi asesmen: <strong className="text-white">{session.name}</strong>.
          </p>

          {responsesCount > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 space-y-2">
              <p className="font-semibold text-rose-300">Peringatan: Terdapat {responsesCount} Respons Murid</p>
              <p className="text-[11px] text-slate-300 leading-normal">
                Menghapus sesi ini akan menghapus seluruh data pengerjaan, skor per misi, dan rekomendasi AI terkait sesi ini.
              </p>
              <button
                type="button"
                onClick={handleArchive}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors mt-2"
              >
                <Archive className="w-3.5 h-3.5" />
                Arsipkan Sesi Saja (Simpan Rekam Jejak)
              </button>
            </div>
          )}

          {error && <p className="text-rose-400 text-xs font-medium">{error}</p>}
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
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Menghapus...' : 'Hapus Sesi'}
          </button>
        </div>
      </div>
    </div>
  );
};
