import React, { useState } from 'react';
import { X, Trash2, Archive, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { SchoolClass } from '../../types';

interface DeleteClassModalProps {
  isOpen: boolean;
  classItem: SchoolClass;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  isOpen,
  classItem,
  onClose,
  onSuccess
}) => {
  const { deleteClass, archiveClass, getClassMembers, getClassSessions } = useData();
  const [confirmName, setConfirmName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const membersCount = getClassMembers(classItem.id).length;
  const sessionsCount = getClassSessions(classItem.id).length;

  const handleDelete = async () => {
    if (confirmName !== classItem.name) {
      setError(`Ketikkan nama kelas "${classItem.name}" secara tepat untuk konfirmasi.`);
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteClass(classItem.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus kelas.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveAlternative = async () => {
    setIsDeleting(true);
    try {
      await archiveClass(classItem.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal mengarsipkan kelas.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-rose-900/40 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-white">Konfirmasi Hapus Kelas Permanen</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Anda akan menghapus kelas: <strong className="text-white font-bold">{classItem.name}</strong> ({classItem.gradeLevel} - {classItem.major}).
          </p>

          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 space-y-1.5">
            <p className="font-semibold text-rose-300">Dampak Penghapusan Permanen:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>{sessionsCount} sesi asesmen di kelas ini akan dihapus.</li>
              <li>Keanggotaan {membersCount} murid di kelas ini akan dinonaktifkan (akun murid tetap ada, tidak dihapus).</li>
              <li>Seluruh rekam jejak respons, skor diagnostik, dan analisis AI kelas ini akan dihapus permanen.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-xs text-indigo-300">Ingin mempertahankan data asesmen?</p>
              <p className="text-[11px] text-slate-400">Arsipkan kelas untuk menyembunyikannya tanpa menghilangkan laporan.</p>
            </div>
            <button
              type="button"
              onClick={handleArchiveAlternative}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              Arsipkan Saja
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Untuk konfirmasi, ketik nama kelas: <span className="text-white font-mono">{classItem.name}</span>
            </label>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={classItem.name}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {error && (
            <p className="text-rose-400 text-xs font-medium">{error}</p>
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
            onClick={handleDelete}
            disabled={isDeleting || confirmName !== classItem.name}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Menghapus...' : 'Hapus Kelas Permanen'}
          </button>
        </div>
      </div>
    </div>
  );
};
