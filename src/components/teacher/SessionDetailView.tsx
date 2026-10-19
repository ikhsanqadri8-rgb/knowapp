import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  Play,
  Pause,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AIRecommendationsTab } from './AIRecommendationsTab';
import type { AssessmentSessionStatus } from '../../types';

interface SessionDetailViewProps {
  sessionId: string;
  onBack: () => void;
  onOpenStudentProfile: (studentId: string) => void;
}

export const SessionDetailView: React.FC<SessionDetailViewProps> = ({
  sessionId,
  onBack,
  onOpenStudentProfile
}) => {
  const { 
    getSessionById, 
    getClassById, 
    getClassMembers, 
    getSessionResponses,
    updateSessionStatus 
  } = useData();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'ai-insights'>('monitoring');

  const session = getSessionById(sessionId);
  if (!session) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-slate-400">Sesi asesmen tidak ditemukan.</p>
        <button onClick={onBack} className="text-xs text-teal-400 font-semibold hover:underline">
          Kembali
        </button>
      </div>
    );
  }

  const classItem = getClassById(session.classId);
  const members = getClassMembers(session.classId);
  const responses = getSessionResponses(sessionId);

  // Group responses by student to compute progress
  const studentMap = new Map<string, {
    studentId: string;
    studentName: string;
    completedMissions: number;
    totalScore: number;
    totalMaxScore: number;
    totalHints: number;
    totalTimeSeconds: number;
    lastCompletedAt: string;
  }>();

  responses.forEach((r) => {
    if (!studentMap.has(r.studentId)) {
      studentMap.set(r.studentId, {
        studentId: r.studentId,
        studentName: r.studentName,
        completedMissions: 0,
        totalScore: 0,
        totalMaxScore: 0,
        totalHints: 0,
        totalTimeSeconds: 0,
        lastCompletedAt: r.completedAt
      });
    }
    const record = studentMap.get(r.studentId)!;
    record.completedMissions += 1;
    record.totalScore += r.score;
    record.totalMaxScore += r.maxScore;
    record.totalHints += r.hintsUsed;
    record.totalTimeSeconds += r.timeSpentSeconds;
  });

  const studentSubmissions = Array.from(studentMap.values());
  const totalMissionsInSession = session.selectedMissionIds.length;

  const finishedCount = studentSubmissions.filter((s) => s.completedMissions >= totalMissionsInSession).length;
  const inProgressCount = studentSubmissions.filter((s) => s.completedMissions > 0 && s.completedMissions < totalMissionsInSession).length;
  const notStartedCount = Math.max(0, members.length - studentSubmissions.length);

  const averageScore = studentSubmissions.length > 0
    ? Math.round(
        studentSubmissions.reduce((acc, curr) => 
          acc + (curr.totalMaxScore > 0 ? (curr.totalScore / curr.totalMaxScore) * 100 : 0), 0
        ) / studentSubmissions.length
      )
    : 0;

  const handleToggleStatus = async () => {
    const nextStatus: AssessmentSessionStatus = session.status === 'active' ? 'paused' : 'active';
    await updateSessionStatus(session.id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{session.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                session.status === 'active'
                  ? 'bg-teal-950 text-teal-300 border border-teal-800/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-800/40'
              }`}>
                {session.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelas: <span className="text-teal-300 font-semibold">{classItem?.name}</span> &bull; {session.selectedMissionIds.length} Misi &bull; Paket: {session.contentPackId.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              session.status === 'active'
                ? 'bg-amber-950/40 border-amber-800/50 text-amber-300 hover:bg-amber-900/60'
                : 'bg-teal-950/40 border-teal-800/50 text-teal-300 hover:bg-teal-900/60'
            }`}
          >
            {session.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {session.status === 'active' ? 'Jeda Sesi' : 'Buka / Lanjutkan Sesi'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'monitoring'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Pemantauan Progres Murid ({studentSubmissions.length}/{members.length})
        </button>

        <button
          onClick={() => setActiveTab('ai-insights')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ai-insights'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          Rekomendasi AI Guru (Gemini)
        </button>
      </div>

      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Total Murid Kelas</p>
              <p className="text-2xl font-bold text-white font-mono">{members.length}</p>
              <p className="text-[11px] text-slate-500">Anggota aktif</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Selesai Seluruh Misi</p>
              <p className="text-2xl font-bold text-teal-400 font-mono">{finishedCount}</p>
              <p className="text-[11px] text-slate-500">{totalMissionsInSession} misi tuntas</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Sedang Mengerjakan</p>
              <p className="text-2xl font-bold text-indigo-400 font-mono">{inProgressCount}</p>
              <p className="text-[11px] text-slate-500">Progres berjalan</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Rerata Skor Awal</p>
              <p className="text-2xl font-bold text-amber-400 font-mono">{averageScore}%</p>
              <p className="text-[11px] text-slate-500">Berdasarkan data aktual</p>
            </div>
          </div>

          {/* Student responses table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-3 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm">Rekam Jejak Pengerjaan Murid</h3>
                <p className="text-xs text-slate-400">Daftar murid yang telah mengirimkan respons asesmen</p>
              </div>
            </div>

            {studentSubmissions.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Belum ada murid yang memulai pengerjaan sesi ini.
                </p>
                <p className="text-[11px] text-slate-500">
                  Pastikan status sesi <strong>Active</strong> dan murid telah memasukkan kode bergabung kelas.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nama Murid</th>
                      <th className="py-3 px-4">Misi Tuntas</th>
                      <th className="py-3 px-4">Rerata Skor</th>
                      <th className="py-3 px-4">Petunjuk Dipakai</th>
                      <th className="py-3 px-4">Waktu Pengerjaan</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {studentSubmissions.map((sub) => {
                      const percent = sub.totalMaxScore > 0 ? Math.round((sub.totalScore / sub.totalMaxScore) * 100) : 0;
                      return (
                        <tr key={sub.studentId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            {sub.studentName}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className="text-teal-400">{sub.completedMissions}</span> / {totalMissionsInSession}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold">
                            <span className={percent >= 70 ? 'text-teal-400' : 'text-amber-400'}>
                              {percent}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            {sub.totalHints} kali
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            {Math.round(sub.totalTimeSeconds / 60)} menit
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => onOpenStudentProfile(sub.studentId)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Lihat Bukti
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ai-insights' && (
        <AIRecommendationsTab sessionId={sessionId} />
      )}
    </div>
  );
};
