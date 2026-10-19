import React, { useState } from 'react';
import { 
  School, 
  Plus, 
  Search, 
  Users, 
  Layers, 
  Copy, 
  Check, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AddClassModal } from './AddClassModal';
import { EditClassModal } from './EditClassModal';
import { DeleteClassModal } from './DeleteClassModal';
import type { SchoolClass } from '../../types';

interface ClassesViewProps {
  onSelectClass: (classId: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({ onSelectClass }) => {
  const { classes, getClassMembers, getClassSessions, archiveClass, restoreClass } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredClasses = classes.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.major.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'active') return matchesSearch && !c.isArchived;
    if (statusFilter === 'archived') return matchesSearch && c.isArchived;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <School className="w-6 h-6 text-teal-400" />
            Manajemen Kelas Saya
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola kelas binaan, kode bergabung murid, dan pemantauan asesmen
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Kelas Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama kelas atau jurusan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'active' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aktif ({classes.filter((c) => !c.isArchived).length})
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'archived' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diarsipkan ({classes.filter((c) => c.isArchived).length})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({classes.length})
          </button>
        </div>
      </div>

      {/* Grid of Classes or Empty State */}
      {filteredClasses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
            <School className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">
              {classes.length === 0 ? 'Belum Ada Kelas yang Dibuat' : 'Tidak Ada Kelas yang Sesuai Filter'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {classes.length === 0
                ? 'Mulai dengan menambahkan kelas pertama Anda untuk mendapatkan kode bergabung dan membagikannya ke murid.'
                : 'Coba ubah kata kunci pencarian atau sesuaikan filter status kelas.'}
            </p>
          </div>
          {classes.length === 0 && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Buat Kelas Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((item) => {
            const memberCount = getClassMembers(item.id).length;
            const sessionCount = getClassSessions(item.id).length;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between space-y-4 ${
                  item.isArchived 
                    ? 'border-slate-800/60 opacity-70' 
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                }`}
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                      {item.gradeLevel}
                    </span>
                    {item.isArchived ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        Diarsipkan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-teal-950/60 text-teal-300 border border-teal-800/40">
                        Aktif
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-teal-400 font-medium">
                    {item.major}
                  </p>
                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Join Code Box */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Kode Bergabung:{' '}
                    <span className="font-mono font-bold text-white tracking-widest text-xs">
                      {item.joinCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(item.joinCode, item.id)}
                    title="Salin Kode Bergabung"
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {copiedCodeId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 py-1 border-t border-b border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{memberCount} Murid Terdaftar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sessionCount} Sesi Asesmen</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-1">
                  <button
                    onClick={() => onSelectClass(item.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Detail
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingClass(item)}
                      title="Edit Kelas"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {item.isArchived ? (
                      <button
                        onClick={() => restoreClass(item.id)}
                        title="Aktifkan Kembali Kelas"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => archiveClass(item.id)}
                        title="Arsipkan Kelas"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => setDeletingClass(item)}
                      title="Hapus Kelas"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddClassModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={(newId) => onSelectClass(newId)}
      />

      {editingClass && (
        <EditClassModal
          isOpen={true}
          classItem={editingClass}
          onClose={() => setEditingClass(null)}
          onSuccess={() => setEditingClass(null)}
        />
      )}

      {deletingClass && (
        <DeleteClassModal
          isOpen={true}
          classItem={deletingClass}
          onClose={() => setDeletingClass(null)}
          onSuccess={() => setDeletingClass(null)}
        />
      )}
    </div>
  );
};
