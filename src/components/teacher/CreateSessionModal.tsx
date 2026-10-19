import React, { useState } from 'react';
import { X, Plus, Layers, AlertCircle, Calendar, Clock, HelpCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CONTENT_PACKS } from '../../content/contentPacks';
import { ALL_MISSIONS } from '../../content/missionBank';
import type { AssessmentSessionStatus } from '../../types';

interface CreateSessionModalProps {
  isOpen: boolean;
  classId: string;
  onClose: () => void;
  onSuccess: (sessionId: string) => void;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  classId,
  onClose,
  onSuccess
}) => {
  const { createSession } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contentPackId, setContentPackId] = useState('general_informatics');
  const [selectedMissions, setSelectedMissions] = useState<string[]>(
    CONTENT_PACKS.find((p) => p.id === 'general_informatics')?.missionIds || []
  );
  const [status, setStatus] = useState<AssessmentSessionStatus>('active');
  const [allowHints, setAllowHints] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [scheduledStartTime, setScheduledStartTime] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePackChange = (newPackId: string) => {
    setContentPackId(newPackId);
    const pack = CONTENT_PACKS.find((p) => p.id === newPackId);
    if (pack) {
      setSelectedMissions(pack.missionIds);
    }
  };

  const toggleMission = (missionId: string) => {
    if (selectedMissions.includes(missionId)) {
      if (selectedMissions.length === 1) {
        setError('Minimal 1 misi harus dipilih dalam sesi asesmen.');
        return;
      }
      setSelectedMissions(selectedMissions.filter((id) => id !== missionId));
    } else {
      setSelectedMissions([...selectedMissions, missionId]);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama sesi asesmen wajib diisi.');
      return;
    }
    if (selectedMissions.length === 0) {
      setError('Pilih minimal 1 misi untuk sesi ini.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createSession({
        classId,
        name: name.trim(),
        description: description.trim(),
        contentPackId,
        selectedMissionIds: selectedMissions,
        status,
        allowHints,
        maxAttempts,
        scheduledStartTime: scheduledStartTime || undefined,
        deadlineTime: deadlineTime || undefined
      });
      onSuccess(created.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat sesi asesmen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPack = CONTENT_PACKS.find((p) => p.id === contentPackId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tambah Sesi Asesmen Diagnostik</h3>
              <p className="text-xs text-slate-400">Atur paket konten, misi, dan jadwal pengerjaan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Nama Sesi <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Asesmen Diagnostik Awal Semester Genap"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Paket Konten Kurikulum
            </label>
            <select
              value={contentPackId}
              onChange={(e) => handlePackChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {CONTENT_PACKS.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} ({pack.missionIds.length} Misi)
                </option>
              ))}
            </select>
            {currentPack && (
              <p className="mt-1 text-[11px] text-slate-400 leading-normal">
                {currentPack.description}
              </p>
            )}
          </div>

          {/* Missions Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Pilih Misi ({selectedMissions.length} Terpilih)
              </label>
              <span className="text-[11px] text-teal-400">Centang misi yang ingin diujikan</span>
            </div>
            <div className="max-h-44 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
              {ALL_MISSIONS.map((mission) => {
                const isSelected = selectedMissions.includes(mission.id);
                return (
                  <label
                    key={mission.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-900 border border-teal-500/30 text-white' : 'hover:bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMission(mission.id)}
                        className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-teal-500"
                      />
                      <div>
                        <p className="font-semibold text-xs">{mission.title}</p>
                        <p className="text-[10px] text-slate-400">{mission.dimensionLabel}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {mission.targetDurationMinutes} min
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Status Awal Sesi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssessmentSessionStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="active">Active (Langsung Menerima Pengerjaan)</option>
                <option value="draft">Draft (Simpan sebagai Draf)</option>
                <option value="scheduled">Scheduled (Mengikuti Waktu)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Maksimal Percobaan
              </label>
              <select
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value={1}>1 Kali (Rekomendasi Diagnostik Awal)</option>
                <option value={2}>2 Kali Percobaan</option>
                <option value={3}>3 Kali Percobaan</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="font-semibold text-white text-xs">Aktifkan Petunjuk (Hints Scaffolding)</p>
              <p className="text-[11px] text-slate-400">Murid dapat membuka petunjuk bertahap saat kesulitan (tercatat sebagai bukti kebutuhan dukungan)</p>
            </div>
            <input
              type="checkbox"
              checked={allowHints}
              onChange={(e) => setAllowHints(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
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
              {isSubmitting ? 'Membuat...' : 'Buat Sesi Asesmen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
