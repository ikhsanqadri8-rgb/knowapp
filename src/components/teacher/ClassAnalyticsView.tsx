import React from 'react';
import { 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Users, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ALL_MISSIONS } from '../../content/missionBank';
import { calculateClassMetrics } from '../../utils/scoring';

interface ClassAnalyticsViewProps {
  classId: string;
  onOpenStudentProfile: (studentId: string) => void;
}

export const ClassAnalyticsView: React.FC<ClassAnalyticsViewProps> = ({
  classId,
  onOpenStudentProfile
}) => {
  const { responses, getClassMembers, profiles } = useData();

  const classResponses = responses.filter((r) => r.classId === classId);
  const classMembers = getClassMembers(classId);
  const classProfiles = profiles.filter((p) => p.classId === classId);

  // If no responses yet, show clear empty state
  if (classResponses.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-white">Data Respons Belum Cukup</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Belum ada murid yang menyelesaikan misi pada sesi asesmen di kelas ini. Grafik analisis diagnostik dan ringkasan miskonsepsi akan muncul secara otomatis segera setelah murid mengirimkan jawaban.
          </p>
        </div>
      </div>
    );
  }

  const indicatorMetrics = calculateClassMetrics(classResponses, ALL_MISSIONS);
  const metricList = Object.values(indicatorMetrics);

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Total Respons Asesmen Masuk</p>
          <p className="text-2xl font-bold text-white font-mono">{classResponses.length}</p>
          <p className="text-[11px] text-teal-400">Dari {classMembers.length} murid terdaftar</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Indikator Teruji</p>
          <p className="text-2xl font-bold text-white font-mono">{metricList.length}</p>
          <p className="text-[11px] text-slate-400">Tersebar di 4 Dimensi Diagnostik</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Status Validitas Bukti</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            <p className="text-xs font-bold text-teal-300">Respons Autentik Tersimpan</p>
          </div>
          <p className="text-[11px] text-slate-400">Dapat ditelusuri ke setiap jawaban murid</p>
        </div>
      </div>

      {/* Indicator Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-sm">Distribusi Ketercapaian per Indikator</h3>
            <p className="text-xs text-slate-400">Memetakan kekuatan awal dan kemungkinan miskonsepsi kelompok</p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Batas ketuntasan: 70%</span>
        </div>

        <div className="space-y-4">
          {metricList.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {stat.dimensionLabel}
                    </span>
                    <h4 className="font-bold text-white text-xs">{stat.missionTitle}</h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{stat.indicator}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-slate-400">Valid: </span>
                    <strong className="text-white">{stat.totalResponses} Murid</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Tuntas: </span>
                    <strong className={`text-xs ${stat.averagePercentage >= 70 ? 'text-teal-400' : 'text-amber-400'}`}>
                      {stat.averagePercentage}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    stat.averagePercentage >= 70 ? 'bg-teal-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${stat.averagePercentage}%` }}
                />
              </div>

              {/* Misconceptions notice */}
              {stat.commonErrors.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-amber-300">Pola Kendala / Miskonsepsi Teramati: </strong>
                    <span>{stat.commonErrors.join('; ')}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Student Individual Diagnostic Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-sm">Daftar Profil Diagnostik Murid</h3>
            <p className="text-xs text-slate-400">Klik nama murid untuk melihat rekam jejak jawaban dan kebutuhan dukungan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {classMembers.map((mem) => {
            const profile = classProfiles.find((p) => p.studentId === mem.studentId);
            const studentRespCount = classResponses.filter((r) => r.studentId === mem.studentId).length;

            return (
              <div
                key={mem.id}
                onClick={() => onOpenStudentProfile(mem.studentId)}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs group-hover:text-teal-400 transition-colors">
                    {mem.studentName}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    profile?.priorKnowledgeStatus === 'Kesiapan Mandiri'
                      ? 'bg-teal-950 text-teal-300 border border-teal-800/40'
                      : profile?.priorKnowledgeStatus === 'Perlu Latihan Terarah'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                      : profile?.priorKnowledgeStatus === 'Perlu Pendampingan Intensif'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {profile ? profile.priorKnowledgeStatus : 'Belum Mulai'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>Misi Selesai: {studentRespCount}</span>
                  {profile && profile.priorKnowledgeScorePercent > 0 && (
                    <span className="font-mono text-teal-400 font-semibold">
                      Skor Awal: {profile.priorKnowledgeScorePercent}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
