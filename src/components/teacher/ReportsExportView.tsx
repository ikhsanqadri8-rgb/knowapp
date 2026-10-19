import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  School, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ALL_MISSIONS } from '../../content/missionBank';

export const ReportsExportView: React.FC = () => {
  const { classes, sessions, responses, members, profiles } = useData();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const classMembers = members.filter((m) => m.classId === selectedClassId && m.status === 'active');
  const classSessions = sessions.filter((s) => s.classId === selectedClassId);
  const classResponses = responses.filter((r) => r.classId === selectedClassId);

  // CSV Export Generator
  const handleExportCSV = () => {
    if (!currentClass) return;

    const headers = [
      'ID Murid',
      'Nama Murid',
      'Email',
      'Kelas',
      'Jurusan',
      'Misi',
      'Dimensi',
      'Skor',
      'Skor Maksimal',
      'Petunjuk Digunakan',
      'Waktu Pengerjaan (Detik)',
      'Tanggal Selesai'
    ];

    const rows = classResponses.map((r) => [
      `"${r.studentId}"`,
      `"${r.studentName}"`,
      `"${classMembers.find((m) => m.studentId === r.studentId)?.studentEmail || ''}"`,
      `"${currentClass.name}"`,
      `"${currentClass.major}"`,
      `"${r.missionId}"`,
      `"${r.dimension}"`,
      r.score,
      r.maxScore,
      r.hintsUsed,
      r.timeSpentSeconds,
      `"${r.completedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KNOW_Laporan_${currentClass.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Non-print Controls Header */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-teal-400" />
            Laporan Diagnostik & Ekspor Data
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unduh rekapitulasi data respons dalam format CSV atau cetak ringkasan resmi kelas
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            disabled={!currentClass || classResponses.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-teal-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor ke CSV
          </button>
          <button
            onClick={handlePrint}
            disabled={!currentClass}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="print:hidden p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-300 shrink-0">
          Pilih Kelas untuk Laporan:
        </label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full sm:w-72 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.gradeLevel} - {c.major})
            </option>
          ))}
        </select>
      </div>

      {/* Printable Report Document Container */}
      {!currentClass ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          Silakan buat atau pilih kelas terlebih dahulu untuk melihat laporan.
        </div>
      ) : (
        <div className="p-8 bg-slate-900 print:bg-white print:text-black border border-slate-800 print:border-none rounded-3xl shadow-xl space-y-6">
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-700 print:border-black pb-4 text-center space-y-1">
            <h2 className="text-xl font-black uppercase tracking-wider text-white print:text-black font-mono">
              LAPORAN HASIL ASESMEN DIAGNOSTIK AWAL
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-400 print:text-teal-800">
              PLATFORM KNOW — DISCOVER LEARNERS. DESIGN BETTER LEARNING.
            </p>
            <p className="text-[11px] text-slate-400 print:text-slate-600">
              Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi &bull; Jenjang Sekolah Menengah Kejuruan (SMK)
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs">
            <div>
              <p className="text-slate-400 print:text-slate-600 font-semibold text-[10px] uppercase">Nama Kelas</p>
              <p className="font-bold text-white print:text-black mt-0.5">{currentClass.name}</p>
            </div>
            <div>
              <p className="text-slate-400 print:text-slate-600 font-semibold text-[10px] uppercase">Tingkat & Jurusan</p>
              <p className="font-bold text-white print:text-black mt-0.5">{currentClass.gradeLevel} - {currentClass.major}</p>
            </div>
            <div>
              <p className="text-slate-400 print:text-slate-600 font-semibold text-[10px] uppercase">Guru Pengampu</p>
              <p className="font-bold text-white print:text-black mt-0.5">{currentClass.teacherName}</p>
            </div>
            <div>
              <p className="text-slate-400 print:text-slate-600 font-semibold text-[10px] uppercase">Tanggal Terbit</p>
              <p className="font-bold text-white print:text-black mt-0.5">{new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          {/* Aggregate Stats */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div className="p-3 rounded-xl border border-slate-800 print:border-slate-300">
              <p className="text-slate-400 print:text-slate-600">Total Murid Terdaftar</p>
              <p className="text-lg font-bold text-white print:text-black font-mono">{classMembers.length}</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 print:border-slate-300">
              <p className="text-slate-400 print:text-slate-600">Total Respons Asesmen</p>
              <p className="text-lg font-bold text-white print:text-black font-mono">{classResponses.length}</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 print:border-slate-300">
              <p className="text-slate-400 print:text-slate-600">Sesi Asesmen Terlaksana</p>
              <p className="text-lg font-bold text-white print:text-black font-mono">{classSessions.length}</p>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white print:text-black">
              Rekapitulasi Kesiapan & Profil Murid
            </h3>

            {classMembers.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada murid yang bergabung di kelas ini.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
                  <thead className="bg-slate-950 print:bg-slate-200 text-slate-300 print:text-black font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-slate-800 print:border-slate-300">No</th>
                      <th className="py-2.5 px-3 border-b border-slate-800 print:border-slate-300">Nama Murid</th>
                      <th className="py-2.5 px-3 border-b border-slate-800 print:border-slate-300">Status Kesiapan Awal</th>
                      <th className="py-2.5 px-3 border-b border-slate-800 print:border-slate-300">Skor Awal</th>
                      <th className="py-2.5 px-3 border-b border-slate-800 print:border-slate-300">Minat Konteks</th>
                      <th className="py-2.5 px-3 border-b border-slate-800 print:border-slate-300">Preferensi Aktivitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-slate-300 print:text-black">
                    {classMembers.map((mem, idx) => {
                      const profile = profiles.find((p) => p.studentId === mem.studentId && p.classId === selectedClassId);
                      return (
                        <tr key={mem.id} className="hover:bg-slate-800/20 print:hover:bg-transparent">
                          <td className="py-2 px-3 font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-white print:text-black">{mem.studentName}</td>
                          <td className="py-2 px-3 font-medium">
                            {profile ? profile.priorKnowledgeStatus : 'Belum Mulai'}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold">
                            {profile && profile.priorKnowledgeScorePercent > 0 ? `${profile.priorKnowledgeScorePercent}%` : '-'}
                          </td>
                          <td className="py-2 px-3 text-[11px] truncate max-w-[140px]">
                            {profile?.interestsSummary?.length ? profile.interestsSummary.join(', ') : '-'}
                          </td>
                          <td className="py-2 px-3 text-[11px] truncate max-w-[140px]">
                            {profile?.preferredActivities?.length ? profile.preferredActivities.join(', ') : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Assessment Limitations Disclaimer */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-600 space-y-1">
            <p className="font-bold text-slate-300 print:text-slate-800 uppercase text-[10px]">
              Keterbatasan Instrumen & Catatan Etika Asesmen:
            </p>
            <p>
              Hasil asesmen ini ditujukan sebagai pemetaan awal formatif untuk membantu guru merancang strategi pengelompokan fleksibel (Teaching at the Right Level) dan diferensiasi instruksional. Instrumen ini bukan tes psikologis klinis atau penentu kelulusan formal murid.
            </p>
            <p className="pt-1">
              Dokumen ini dihasilkan secara otomatis melalui platform <strong>KNOW</strong>. Pengembang: Ikhsan Qadri.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
