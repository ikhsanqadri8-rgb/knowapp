import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Award, 
  Play, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ALL_MISSIONS } from '../../content/missionBank';
import type { Mission } from '../../types';

interface StudentMissionsHubProps {
  onStartMission: (sessionId: string, missionId: string) => void;
  onNavigate: (view: string) => void;
}

export const StudentMissionsHub: React.FC<StudentMissionsHubProps> = ({
  onStartMission,
  onNavigate
}) => {
  const { user } = useAuth();
  const { 
    classes, 
    members, 
    sessions, 
    responses, 
    profiles, 
    joinClassByCode 
  } = useData();

  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Student's enrolled active classes
  const myEnrollments = members.filter((m) => m.studentId === user?.id && m.status === 'active');
  const myClassIds = myEnrollments.map((m) => m.classId);
  const myClasses = classes.filter((c) => myClassIds.includes(c.id) && !c.isArchived);

  // Active sessions in student's classes
  const myActiveSessions = sessions.filter(
    (s) => myClassIds.includes(s.classId) && s.status === 'active'
  );

  // Student completed responses
  const myResponses = responses.filter((r) => r.studentId === user?.id);
  const completedMissionIds = new Set(myResponses.map((r) => `${r.sessionId}_${r.missionId}`));

  // Total XP computed from completed missions
  const totalXP = myResponses.length * 100;
  const earnedLevel = totalXP >= 600 ? 'Strategist' : totalXP >= 300 ? 'Problem Solver' : 'Explorer';

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setIsJoining(true);
    setJoinMsg(null);

    const res = await joinClassByCode(joinCodeInput);
    setIsJoining(false);

    if (res.success) {
      setJoinMsg({ type: 'success', text: res.message });
      setJoinCodeInput('');
    } else {
      setJoinMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-8">
      {/* Student Profile Header & Gamification Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            Tingkat Misi: {earnedLevel}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Halo, {user?.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
            Selesaikan misi asesmen interaktif untuk membantu guru mengenal minat, kekuatan awal, dan cara belajar terbaikmu.
          </p>
        </div>

        {/* Gamified XP Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 min-w-[200px] space-y-2 relative z-10 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-teal-400">Total Progres XP</span>
            <span className="text-white font-mono">{totalXP} XP</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalXP / 800) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-right">
            {myResponses.length} misi telah diselesaikan
          </p>
        </div>
      </div>

      {/* Join Class Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              Gabung ke Kelas Baru
            </h2>
            <p className="text-xs text-slate-400">
              Masukkan 6 digit kode bergabung yang diberikan oleh guru pengampu Anda
            </p>
          </div>

          <form onSubmit={handleJoinClass} className="flex items-center gap-2">
            <input
              type="text"
              maxLength={6}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              placeholder="KODE KELAS (6 Digit)"
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold tracking-widest text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 uppercase w-44"
            />
            <button
              type="submit"
              disabled={isJoining || joinCodeInput.length < 6}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all disabled:opacity-40"
            >
              {isJoining ? 'Memeriksa...' : 'Gabung'}
            </button>
          </form>
        </div>

        {joinMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            joinMsg.type === 'success' 
              ? 'bg-teal-950/40 border border-teal-800/50 text-teal-200' 
              : 'bg-rose-950/40 border border-rose-800/50 text-rose-200'
          }`}>
            {joinMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{joinMsg.text}</span>
          </div>
        )}
      </div>

      {/* Available Missions by Active Session */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-400" />
            Misi Asesmen Aktif
          </h2>
          <button
            onClick={() => onNavigate('student-progress')}
            className="text-xs font-semibold text-teal-400 hover:underline"
          >
            Lihat Progres & Lencana Saya
          </button>
        </div>

        {myActiveSessions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Belum Ada Sesi Asesmen Aktif</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {myClasses.length === 0
                ? 'Anda belum terdaftar di kelas mana pun. Masukkan kode bergabung dari guru di atas untuk memulai.'
                : 'Guru pengampu belum mengaktifkan sesi asesmen baru. Silakan hubungi guru kelas Anda.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {myActiveSessions.map((sess) => {
              const sessionClass = classes.find((c) => c.id === sess.classId);
              const sessionMissions = ALL_MISSIONS.filter((m) => sess.selectedMissionIds.includes(m.id));

              return (
                <div key={sess.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-teal-400 font-mono tracking-wider">
                        Kelas: {sessionClass?.name} ({sessionClass?.major})
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{sess.name}</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {sessionMissions.filter((m) => completedMissionIds.has(`${sess.id}_${m.id}`)).length} dari {sessionMissions.length} Misi Selesai
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessionMissions.map((mission) => {
                      const isCompleted = completedMissionIds.has(`${sess.id}_${mission.id}`);
                      return (
                        <div
                          key={mission.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                            isCompleted
                              ? 'bg-slate-950/60 border-teal-800/40 opacity-80'
                              : 'bg-slate-950 border-slate-800 hover:border-teal-500/50 shadow-md'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                                {mission.dimensionLabel.split(':')[0]}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {mission.targetDurationMinutes}m
                              </span>
                            </div>

                            <h4 className="font-bold text-white text-sm">{mission.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {mission.briefing.story}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                            {isCompleted ? (
                              <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Selesai
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">
                                Belum Dikerjakan
                              </span>
                            )}

                            <button
                              onClick={() => onStartMission(sess.id, mission.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isCompleted
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-500/20'
                              }`}
                            >
                              <Play className="w-3.5 h-3.5" />
                              {isCompleted ? 'Kerjakan Ulang' : 'Mulai Misi'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
