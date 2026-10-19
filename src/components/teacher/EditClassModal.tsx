import React, { useState } from 'react';
import { X, Edit3, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { SchoolClass } from '../../types';

interface EditClassModalProps {
  isOpen: boolean;
  classItem: SchoolClass;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({
  isOpen,
  classItem,
  onClose,
  onSuccess
}) => {
  const { updateClass } = useData();
  const [name, setName] = useState(classItem.name);
  const [gradeLevel, setGradeLevel] = useState(classItem.gradeLevel);
  const [major, setMajor] = useState(classItem.major);
  const [description, setDescription] = useState(classItem.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama kelas tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateClass(classItem.id, {
        name: name.trim(),
        gradeLevel: gradeLevel.trim(),
        major: major.trim(),
        description: description.trim()
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui kelas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white">Edit Informasi Kelas</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Kelas
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tingkat
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Kelas X (Fase E)">Kelas X (Fase E)</option>
                <option value="Kelas XI (Fase F)">Kelas XI (Fase F)</option>
                <option value="Kelas XII (Fase F)">Kelas XII (Fase F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Jurusan / Keahlian
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Informatika Umum">Informatika Umum</option>
                <option value="Rekayasa Perangkat Lunak (RPL)">RPL / PPLG</option>
                <option value="Teknik Komputer & Jaringan (TKJ)">TKJ / TJKT</option>
                <option value="Bisnis Digital & E-Commerce">Bisnis Digital</option>
                <option value="Desain Komunikasi Visual (DKV)">DKV</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deskripsi Kelas
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
