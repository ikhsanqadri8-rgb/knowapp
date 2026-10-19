import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Award, 
  Target, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  Heart, 
  Compass,
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ALL_MISSIONS } from '../../content/missionBank';

interface StudentProfileViewProps {
  studentId: string;
  classId?: string;
  onBack: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  studentId,
  classId,
  onBack
}) => {
  const { responses, profiles, members, classes } = useData();

  const studentResponses = responses.filter((r) => r.studentId === studentId);
  const studentMember = members.find((m) => m.studentId === studentId);
  const studentProfile = profiles.find((p) => p.studentId === studentId);
  const studentClass = classes.find((c) => c.id === (classId || studentMember?.classId));

  const studentName = studentProfile?.studentName || studentMember?.studentName || 'Murid';

  // Dimension summaries
  const cognitiveResponses = studentResponses.filter((r) => r.dimension === 'prior_knowledge');
  const interestResponses = studentResponses.filter((r) => r.dimension === 'interests_context');
  const activityResponses = studentResponses.filter((r) => r.dimension === 'activity_preferences');
  const supportResponses = studentResponses.filter((r) => r.dimension === 'support_needs');

  const totalHintsUsed = studentResponses.reduce((sum, r) => sum + r.hintsUsed, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-white tracking-tight">{studentName}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                studentProfile?.priorKnowledgeStatus === 'Kesiapan Mandiri'
                  ? 'bg-teal-950 text-teal-300 border border-teal-800/40'
                  : studentProfile?.priorKnowledgeStatus === 'Perlu Latihan Terarah'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                  : studentProfile?.priorKnowledgeStatus === 'Perlu Pendampingan Intensif'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {studentProfile ? studentProfile.priorKnowledgeStatus : 'Belum Cukup Data'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelas: <span className="text-teal-300 font-semibold">{studentClass?.name || 'Informatika'}</span> ({studentClass?.major}) &bull; Email: {studentMember?.studentEmail}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Dimension Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Dim 1 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-teal-400 font-mono">Dimensi 1: Kesiapan Awal</span>
          <p className="text-2xl font-bold text-white font-mono">
            {studentProfile?.priorKnowledgeScorePercent || 0}%
          </p>
          <p className="text-[11px] text-slate-400">
            {cognitiveResponses.filter((r) => r.score >= r.maxScore * 0.7).length} dari {cognitiveResponses.length} misi tuntas
          </p>
        </div>

        {/* Dim 2 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-indigo-400 font-mono">Dimensi 2: Minat Konteks</span>
          <p className="text-xs font-semibold text-white pt-1 truncate">
            {studentProfile?.interestsSummary?.length ? studentProfile.interestsSummary.join(', ') : 'Belum Diisi'}
          </p>
          <p className="text-[11px] text-slate-400">Pilihan konteks aplikasi disukai</p>
        </div>

        {/* Dim 3 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-purple-400 font-mono">Dimensi 3: Format Belajar</span>
          <p className="text-xs font-semibold text-white pt-1 truncate">
            {studentProfile?.preferredActivities?.length ? studentProfile.preferredActivities.join(', ') : 'Belum Diisi'}
          </p>
          <p className="text-[11px] text-slate-400">Preferensi modalitas instruksi</p>
        </div>

        {/* Dim 4 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-400 font-mono">Dimensi 4: Bantuan Digunakan</span>
          <p className="text-2xl font-bold text-amber-300 font-mono">{totalHintsUsed} kali</p>
          <p className="text-[11px] text-slate-400">Penggunaan petunjuk scaffolding</p>
        </div>
      </div>

      {/* Answer Traces / Evidence List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            Rekam Jejak Bukti Jawaban Autentik (Evidence Traceability)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Setiap kesimpulan diagnostik dapat diverifikasi langsung melalui jawaban aktual murid di bawah ini
          </p>
        </div>

        {studentResponses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Murid belum menyelesaikan misi asesmen apa pun.
          </div>
        ) : (
          <div className="space-y-4">
            {studentResponses.map((resp) => {
              const mission = ALL_MISSIONS.find((m) => m.id === resp.missionId);
              const isPassed = resp.score >= resp.maxScore * 0.7;

              return (
                <div
                  key={resp.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPassed ? 'bg-teal-400' : 'bg-rose-400'}`} />
                      <h4 className="font-bold text-white text-xs">{mission?.title || resp.missionId}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                        {resp.dimension}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">Petunjuk: {resp.hintsUsed}</span>
                      <span className="text-slate-400">Waktu: {resp.timeSpentSeconds}s</span>
                      <span className={`font-bold ${isPassed ? 'text-teal-400' : 'text-rose-400'}`}>
                        Skor: {resp.score} / {resp.maxScore}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 space-y-1">
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Indikator Teruji:</strong> {mission?.indicator}
                    </p>
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Jawaban Murid:</strong>{' '}
                      <span className="font-mono text-teal-300">
                        {typeof resp.answers === 'object' ? JSON.stringify(resp.answers) : String(resp.answers)}
                      </span>
                    </p>
                    {resp.notes && (
                      <p className="text-slate-300 pt-0.5 italic">
                        &ldquo;{resp.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
