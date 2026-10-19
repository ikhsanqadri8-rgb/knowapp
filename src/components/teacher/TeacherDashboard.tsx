import React, { useState } from 'react';
import { 
  School, 
  Layers, 
  Users, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  BarChart3, 
  Sparkles,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AddClassModal } from './AddClassModal';

interface TeacherDashboardProps {
  onNavigate: (view: string) => void;
  onSelectClass: (classId: string) => void;
  onOpenSession: (sessionId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigate,
  onSelectClass,
  onOpenSession
}) => {
  const { user } = useAuth();
  const { classes, sessions, members, responses, profiles } = useData();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const activeClasses = classes.filter((c) => !c.isArchived);
  const activeSessions = sessions.filter((s) => s.status === 'active' || s.status === 'scheduled');
  const activeMembers = members.filter((m) => m.status === 'active');

  const totalCompletedResponses = responses.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Portal Guru Pengampu
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Selamat Datang, {user?.displayName || 'Bapak/Ibu Guru'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Pantau kesiapan awal belajar murid, kelola sesi asesmen gamifikasi, dan temukan rekomendasi pedagogis berbasis bukti nyata.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('teacher-classes')}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Kelola Kelas Saya
          </button>
          <button
            onClick={() => onNavigate('content-packs')}
            className="px-4 py-2.5 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            Bank Misi
          </button>
        </div>
      </div>

      {/* Actual Stats Grid (Calculated strictly from real state, no hardcoded dummy!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Kelas Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{activeClasses.length}</p>
          <p className="text-[11px] text-slate-500">Kelas yang sedang diampu</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sesi Asesmen Berjalan</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{activeSessions.length}</p>
          <p className="text-[11px] text-slate-500">Menerima pengerjaan murid</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Murid Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{activeMembers.length}</p>
          <p className="text-[11px] text-slate-500">Bergabung melalui kode kelas</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Respons Asesmen</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{totalCompletedResponses}</p>
          <p className="text-[11px] text-slate-500">Bukti jawaban tersimpan</p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      {classes.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
            <School className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-white">Mulai Langkah Pertama Anda di KNOW</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anda belum memiliki kelas aktif. Tambahkan kelas binaan Anda untuk mendapatkan kode bergabung unik, membuat sesi asesmen diagnostik, dan mengundang murid.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat Kelas Pertama Saya
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Sessions List (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm">Sesi Asesmen Aktif</h3>
                <p className="text-xs text-slate-400">Pantau progres pengerjaan misi oleh murid di setiap sesi</p>
              </div>
              <button
                onClick={() => onNavigate('teacher-classes')}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                Lihat Semua Sesi
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <p>Belum ada sesi asesmen yang dibuat di kelas Anda.</p>
                <p className="text-[11px] text-slate-500">Buka menu Kelas Saya untuk membuat sesi asesmen.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 4).map((sess) => {
                  const targetClass = classes.find((c) => c.id === sess.classId);
                  const sessResponses = responses.filter((r) => r.sessionId === sess.id);
                  const classStudentCount = members.filter((m) => m.classId === sess.classId && m.status === 'active').length;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => onOpenSession(sess.id)}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sess.status === 'active' ? 'bg-teal-950 text-teal-300 border border-teal-800/40' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {sess.status}
                          </span>
                          <h4 className="font-bold text-white text-xs group-hover:text-teal-300 transition-colors">
                            {sess.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400">
                          Kelas: <strong className="text-slate-300">{targetClass?.name}</strong> &bull; {sess.selectedMissionIds.length} Misi Terpilih
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-white">
                          {sessResponses.length} Respons
                        </span>
                        <p className="text-[10px] text-slate-500">dari {classStudentCount} murid</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Class Summary (1 col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Daftar Kelas Binaan</h3>
              <button
                onClick={() => onNavigate('teacher-classes')}
                className="text-xs font-semibold text-teal-400 hover:underline"
              >
                Lihat
              </button>
            </div>

            <div className="space-y-3">
              {activeClasses.slice(0, 5).map((cls) => {
                const memberCount = members.filter((m) => m.classId === cls.id && m.status === 'active').length;
                return (
                  <div
                    key={cls.id}
                    onClick={() => onSelectClass(cls.id)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-teal-500/40 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs">{cls.name}</h4>
                      <p className="text-[11px] text-slate-400">{cls.gradeLevel} &bull; {cls.major}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono font-semibold text-teal-300">
                        {cls.joinCode}
                      </span>
                      <p className="text-[10px] text-slate-500">{memberCount} Murid</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      <AddClassModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={(newClassId) => {
          setIsAddOpen(false);
          onSelectClass(newClassId);
        }}
      />
    </div>
  );
};
