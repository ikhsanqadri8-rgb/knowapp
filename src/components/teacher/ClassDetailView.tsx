import React, { useState } from 'react';
import { 
  ArrowLeft, 
  School, 
  Users, 
  Layers, 
  BarChart3, 
  Plus, 
  Copy, 
  Check, 
  RefreshCw, 
  Play, 
  Pause, 
  CheckCircle2, 
  Archive, 
  Trash2, 
  Edit3, 
  UserMinus, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CreateSessionModal } from './CreateSessionModal';
import { DuplicateSessionModal } from './DuplicateSessionModal';
import { DeleteSessionModal } from './DeleteSessionModal';
import { EditClassModal } from './EditClassModal';
import { ClassAnalyticsView } from './ClassAnalyticsView';
import type { SchoolClass, AssessmentSession, AssessmentSessionStatus } from '../../types';

interface ClassDetailViewProps {
  classId: string;
  onBack: () => void;
  onOpenSession: (sessionId: string) => void;
  onOpenStudentProfile: (studentId: string) => void;
}

export const ClassDetailView: React.FC<ClassDetailViewProps> = ({
  classId,
  onBack,
  onOpenSession,
  onOpenStudentProfile
}) => {
  const { 
    getClassById, 
    getClassMembers, 
    getClassSessions, 
    regenerateClassJoinCode,
    removeClassMember,
    updateSessionStatus
  } = useData();

  const classItem = getClassById(classId);
  const [activeTab, setActiveTab] = useState<'sessions' | 'members' | 'analytics'>('sessions');

  // Modals state
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [duplicatingSession, setDuplicatingSession] = useState<AssessmentSession | null>(null);
  const [deletingSession, setDeletingSession] = useState<AssessmentSession | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);

  if (!classItem) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-slate-400">Kelas tidak ditemukan.</p>
        <button onClick={onBack} className="text-xs text-teal-400 font-semibold hover:underline">
          Kembali ke Daftar Kelas
        </button>
      </div>
    );
  }

  const members = getClassMembers(classId);
  const sessions = getClassSessions(classId);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classItem.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRegenerateCode = async () => {
    if (confirm('Apakah Anda yakin ingin memperbarui kode bergabung kelas? Kode lama tidak akan bisa digunakan lagi.')) {
      setIsRegenerating(true);
      await regenerateClassJoinCode(classId);
      setIsRegenerating(false);
    }
  };

  const handleToggleSessionStatus = async (session: AssessmentSession) => {
    let target: AssessmentSessionStatus = 'active';
    if (session.status === 'active') target = 'paused';
    else if (session.status === 'paused' || session.status === 'draft') target = 'active';

    await updateSessionStatus(session.id, target);
  };

  const handleConfirmRemoveMember = async () => {
    if (!memberToRemove) return;
    await removeClassMember(classId, memberToRemove.id);
    setMemberToRemove(null);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{classItem.name}</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                {classItem.gradeLevel}
              </span>
              {classItem.isArchived && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800/40">
                  Diarsipkan
                </span>
              )}
            </div>
            <p className="text-xs text-teal-400 font-medium mt-0.5">{classItem.major}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Join Code Display with Copy & Regenerate */}
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Kode Murid:</span>
            <span className="font-mono font-bold text-white tracking-wider text-sm">
              {classItem.joinCode}
            </span>
            <button
              onClick={handleCopyCode}
              title="Salin Kode"
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRegenerateCode}
              disabled={isRegenerating}
              title="Perbarui Kode Unik"
              className="p-1 rounded-lg text-slate-400 hover:text-teal-400 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-teal-400' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => setIsEditClassOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Edit Kelas"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'sessions'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Sesi Asesmen ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'members'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Anggota Kelas ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analisis Diagnostik Kelas
        </button>
      </div>

      {/* TAB 1: SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Daftar penugasan asesmen diagnostik untuk kelas ini
            </p>
            <button
              onClick={() => setIsCreateSessionOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Sesi Asesmen
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Belum Ada Sesi Asesmen</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Buat sesi asesmen baru untuk memilih paket misi dan mengaktifkan pengerjaan bagi murid kelas ini.
              </p>
              <button
                onClick={() => setIsCreateSessionOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Sesi Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        sess.status === 'active' 
                          ? 'bg-teal-950 text-teal-300 border border-teal-800/40'
                          : sess.status === 'paused'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : sess.status === 'closed'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sess.status}
                      </span>
                      <h4 className="font-bold text-white text-sm">{sess.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      {sess.selectedMissionIds.length} Misi Terpilih &bull; Paket: <span className="text-teal-300 capitalize">{sess.contentPackId.replace('_', ' ')}</span> &bull; {sess.allowHints ? 'Petunjuk Diizinkan' : 'Tanpa Petunjuk'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => onOpenSession(sess.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Pantau Progres
                    </button>

                    <button
                      onClick={() => handleToggleSessionStatus(sess)}
                      title={sess.status === 'active' ? 'Jeda Sesi' : 'Aktifkan Sesi'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        sess.status === 'active'
                          ? 'bg-amber-950/40 border-amber-800/50 text-amber-300 hover:bg-amber-900/60'
                          : 'bg-teal-950/40 border-teal-800/50 text-teal-300 hover:bg-teal-900/60'
                      }`}
                    >
                      {sess.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setDuplicatingSession(sess)}
                      title="Duplikasi Konfigurasi Sesi"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeletingSession(sess)}
                      title="Hapus Sesi"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Murid yang telah bergabung ke kelas menggunakan kode <strong className="text-white font-mono">{classItem.joinCode}</strong>
            </p>
          </div>

          {members.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Belum Ada Murid Terdaftar</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bagikan kode bergabung <span className="text-teal-400 font-mono font-bold">{classItem.joinCode}</span> kepada murid di kelas untuk mulai mengerjakan asesmen.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nama Murid</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Tanggal Bergabung</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {members.map((mem) => (
                      <tr key={mem.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          <button
                            onClick={() => onOpenStudentProfile(mem.studentId)}
                            className="hover:text-teal-400 hover:underline flex items-center gap-1.5"
                          >
                            {mem.studentName}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{mem.studentEmail}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(mem.joinedAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800/40 uppercase">
                            {mem.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenStudentProfile(mem.studentId)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold transition-colors"
                            >
                              Profil Diagnostik
                            </button>
                            <button
                              onClick={() => setMemberToRemove({ id: mem.studentId, name: mem.studentName })}
                              title="Keluarkan Murid dari Kelas"
                              className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {activeTab === 'analytics' && (
        <ClassAnalyticsView classId={classId} onOpenStudentProfile={onOpenStudentProfile} />
      )}

      {/* MODALS */}
      <CreateSessionModal
        isOpen={isCreateSessionOpen}
        classId={classId}
        onClose={() => setIsCreateSessionOpen(false)}
        onSuccess={(newId) => onOpenSession(newId)}
      />

      {isEditClassOpen && (
        <EditClassModal
          isOpen={true}
          classItem={classItem}
          onClose={() => setIsEditClassOpen(false)}
          onSuccess={() => setIsEditClassOpen(false)}
        />
      )}

      {duplicatingSession && (
        <DuplicateSessionModal
          isOpen={true}
          session={duplicatingSession}
          onClose={() => setDuplicatingSession(null)}
          onSuccess={(clonedId) => onOpenSession(clonedId)}
        />
      )}

      {deletingSession && (
        <DeleteSessionModal
          isOpen={true}
          session={deletingSession}
          onClose={() => setDeletingSession(null)}
          onSuccess={() => setDeletingSession(null)}
        />
      )}

      {/* Remove member confirmation modal */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm">Keluarkan Murid dari Kelas?</h3>
            <p>
              Anda akan mengeluarkan <strong className="text-white">{memberToRemove.name}</strong> dari kelas ini. Akun murid tidak akan terhapus, namun akses murid ke sesi kelas ini akan dihentikan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setMemberToRemove(null)}
                className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRemoveMember}
                className="px-3 py-1.5 rounded-xl font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Keluarkan Murid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
