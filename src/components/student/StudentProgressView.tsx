import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Compass, 
  ArrowLeft,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ALL_MISSIONS } from '../../content/missionBank';

interface StudentProgressViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({
  onBack,
  onNavigate
}) => {
  const { user } = useAuth();
  const { responses, profiles } = useData();

  const myResponses = responses.filter((r) => r.studentId === user?.id);
  const myProfile = profiles.find((p) => p.studentId === user?.id);

  const totalXP = myResponses.length * 100;
  const isExplorer = totalXP >= 100;
  const isProblemSolver = totalXP >= 300;
  const isStrategist = totalXP >= 600;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Progres & Lencana Saya</h1>
            <p className="text-xs text-slate-400">Pencapaian asesmen diagnostik dan rekam jejak belajarmu</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('student-hub')}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors"
        >
          Kerjakan Misi Lain
        </button>
      </div>

      {/* Gamification Level & Badges */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">Lencana Pencapaian Misi</span>
            <h2 className="text-base font-bold text-white mt-0.5">Tingkat Penjelajah KNOW</h2>
          </div>
          <span className="text-sm font-mono font-bold text-teal-400">{totalXP} Total XP</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Badge 1: Explorer */}
          <div className={`p-4 rounded-2xl border transition-all text-center space-y-2 ${
            isExplorer
              ? 'bg-teal-950/30 border-teal-500/50 shadow-lg shadow-teal-500/10'
              : 'bg-slate-950/50 border-slate-800 opacity-40'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-xs">Explorer</h3>
            <p className="text-[11px] text-slate-400">Menyelesaikan misi diagnostik pertama</p>
            {isExplorer && (
              <span className="inline-block text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                Terbuka
              </span>
            )}
          </div>

          {/* Badge 2: Problem Solver */}
          <div className={`p-4 rounded-2xl border transition-all text-center space-y-2 ${
            isProblemSolver
              ? 'bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-950/50 border-slate-800 opacity-40'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-xs">Problem Solver</h3>
            <p className="text-[11px] text-slate-400">Menyelesaikan 3 misi atau lebih</p>
            {isProblemSolver && (
              <span className="inline-block text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                Terbuka
              </span>
            )}
          </div>

          {/* Badge 3: Strategist */}
          <div className={`p-4 rounded-2xl border transition-all text-center space-y-2 ${
            isStrategist
              ? 'bg-purple-950/30 border-purple-500/50 shadow-lg shadow-purple-500/10'
              : 'bg-slate-950/50 border-slate-800 opacity-40'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-xs">Strategist</h3>
            <p className="text-[11px] text-slate-400">Menyelesaikan 6 misi atau lebih</p>
            {isStrategist && (
              <span className="inline-block text-[10px] font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                Terbuka
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Completed Missions History */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">
          Riwayat Misi yang Telah Diselesaikan ({myResponses.length})
        </h3>

        {myResponses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Kamu belum menyelesaikan misi. Klik &ldquo;Kerjakan Misi Lain&rdquo; untuk mulai!
          </div>
        ) : (
          <div className="space-y-3">
            {myResponses.map((resp) => {
              const mission = ALL_MISSIONS.find((m) => m.id === resp.missionId);
              return (
                <div
                  key={resp.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <h4 className="font-bold text-white text-xs">{mission?.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(resp.completedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] pl-6">
                      {mission?.indicator}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-teal-400 font-bold">+100 XP</span>
                    <p className="text-[10px] text-slate-500">{resp.hintsUsed} petunjuk dipakai</p>
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
