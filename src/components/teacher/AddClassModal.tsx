import React, { useState } from 'react';
import { X, School, Plus, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newClassId: string) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createClass } = useData();
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Kelas X');
  const [major, setMajor] = useState('Informatika Umum');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama kelas wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createClass(name, gradeLevel, major, description);
      setName('');
      setDescription('');
      onClose();
      onSuccess(created.id);
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan kelas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <School className="w-4 h-4 text-teal-400" />
            </div>
            <h3 className="text-base font-bold text-white">Tambah Kelas Baru</h3>
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
              Nama Kelas <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: X PPLG 1 atau X TKJ 2"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tingkat / Fase
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Kelas X (Fase E)">Kelas X (Fase E)</option>
                <option value="Kelas XI (Fase F)">Kelas XI (Fase F)</option>
                <option value="Kelas XII (Fase F)">Kelas XII (Fase F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Konsentrasi Keahlian
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
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
              Deskripsi Kelas (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan tahun ajaran, semester, atau target kompetensi awal..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
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
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {isSubmitting ? 'Menyimpan...' : 'Buat Kelas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
