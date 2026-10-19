import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kebijakan Privasi & Etika Data KNOW</h3>
              <p className="text-xs text-slate-400">Komitmen Perlindungan Privasi Murid & Penggunaan AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/40 text-teal-200 text-xs">
            <strong>Prinsip Utama:</strong> KNOW dirancang dengan filosofi Zero-Leakage & Data Minimization. Kami hanya mengumpulkan informasi minimum yang esensial untuk memfasilitasi asesmen diagnostik formatif sekolah.
          </div>

          <section className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-indigo-400" />
              1. Minimalisasi Data Pribadi
            </h4>
            <p className="text-xs text-slate-400">
              KNOW tidak meminta Nomor Induk Siswa Nasional (NISN), nomor identitas kependudukan, alamat tempat tinggal, nomor kontak telepon, maupun data kesehatan pribadi. Akun murid hanya memerlukan nama tampilan kelas dan alamat email autentikasi yang sah.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              2. Isolasi Akses Murid & Guru (Role-Based Access)
            </h4>
            <p className="text-xs text-slate-400">
              Setiap murid hanya memiliki izin untuk melihat riwayat tugas, perolehan XP, dan refleksi miliknya sendiri. Murid tidak dapat mengakses data nilai atau jawaban murid lain. Guru hanya berhak mengakses data murid yang secara eksplisit mendaftar di kelas yang diampu guru tersebut.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-amber-400" />
              3. Batasan Instrumen & Penolakan Pelabelan Permanen
            </h4>
            <p className="text-xs text-slate-400">
              Hasil asesmen diagnostik di platform KNOW <strong>bukanlah diagnosis medis, klinis, maupun tes IQ psikologis permanen</strong>. KNOW melarang pelabelan peyoratif (seperti "murid lemah", "murid lambat", atau teori modalitas kaku). Hasil asesmen ditujukan murni sebagai pemetaan awal pedagogis untuk membantu guru merancang diferensiasi instruksional.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              4. Penggunaan Kecerdasan Buatan (Gemini AI) yang Bertanggung Jawab
            </h4>
            <p className="text-xs text-slate-400">
              Integrasi Gemini AI pada KNOW berfungsi untuk merangkum pola respons kelas dan menyarankan ide diferensiasi instruksional (Teaching at the Right Level & Universal Design for Learning). AI tidak menentukan skor kelulusan murid dan guru tetap memegang kendali penuh untuk meninjau, mengedit, atau mengabaikan saran AI.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-white text-sm">5. Retensi & Penghapusan Data</h4>
            <p className="text-xs text-slate-400">
              Guru memiliki hak penuh untuk mengarsipkan atau menghapus data kelas dan sesi asesmen. Penghapusan kelas akan membersihkan seluruh rekam jejak turunan terkait secara konsisten tanpa meninggalkan dokumen yatim di database.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors"
          >
            Saya Memahami & Menyetujui
          </button>
        </div>
      </div>
    </div>
  );
};
