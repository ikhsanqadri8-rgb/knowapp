import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  BarChart3, 
  Award, 
  Users, 
  ShieldCheck,
  BookOpen,
  Code2,
  Network,
  ShoppingBag,
  Zap,
  HelpCircle
} from 'lucide-react';
import { CONTENT_PACKS } from '../../content/contentPacks';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenPrivacy }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-800/80">
        {/* Subtle grid pattern & glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(13,148,136,0.18),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-teal-300 text-xs font-semibold tracking-wide shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            Platform Asesmen Diagnostik Edukatif untuk SMK
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            Discover Learners.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-200 to-indigo-400">
              Design Better Learning.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Platform asesmen diagnostik interaktif berbasis gamifikasi yang membantu guru memahami karakteristik awal murid dan merancang pembelajaran berdasarkan bukti autentik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-indigo-600 hover:brightness-110 active:scale-95 text-white shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              Mulai Asesmen Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('content-packs')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              Eksplorasi 16 Bank Misi
            </button>
          </div>

          {/* Quick value highlights */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-teal-400 font-bold text-base flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4" />
                4 Dimensi
              </div>
              <p className="text-xs text-slate-400">Kesiapan, minat konteks, preferensi, dan kebutuhan dukungan murid.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-indigo-400 font-bold text-base flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4" />
                Gamifikasi
              </div>
              <p className="text-xs text-slate-400">Briefing misi, tantangan interaktif, progress XP, dan reward ringan.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-purple-400 font-bold text-base flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-4 h-4" />
                Bukti Terlacak
              </div>
              <p className="text-xs text-slate-400">Setiap interpretasi dapat ditelusuri ke rekam jejak jawaban murid.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-amber-400 font-bold text-base flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                Saran AI Guru
              </div>
              <p className="text-xs text-slate-400">Rekomendasi diferensiasi ajar (TaRL & UDL) yang tetap dikontrol guru.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 DIMENSIONS SECTION */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-teal-400">
              Kerangka Asesmen
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Empat Dimensi Pemetaan Belajar Murid
            </h3>
            <p className="text-sm text-slate-400">
              Bukan sekadar mengukur skor benar/salah, melainkan memetakan profil belajar yang komprehensif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-lg font-bold text-white">Dimensi 1 — Kemampuan Awal (Prior Knowledge)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengidentifikasi kompetensi yang telah dikuasai sebelum pembelajaran dimulai, seperti literasi keamanan digital, logika sekuensial algoritma, analisis tabel data, dan dekomposisi masalah teknis.
              </p>
              <div className="pt-2 text-xs text-teal-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Rubrik terstandar & kunci jawaban objektif
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-lg font-bold text-white">Dimensi 2 — Minat & Konteks (Interests & Context)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Memetakan konteks industri yang memotivasi murid: Toko Digital & E-Commerce, Desain Konten & Media, Aplikasi & Game, Analisis Data & AI, Jaringan & Keamanan Siber, atau Solusi Masalah Komunitas.
              </p>
              <div className="pt-2 text-xs text-indigo-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Bukan skor kemampuan, melainkan panduan studi kasus relevan
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-lg font-bold text-white">Dimensi 3 — Preferensi Aktivitas (Activity Preferences)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengeksplorasi kenyamanan format belajar: diagram alur visual, instruksi bertahap, simulasi praktik langsung di lab komputer, diskusi komparasi kasus, atau refleksi mandiri.
              </p>
              <div className="pt-2 text-xs text-purple-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Menghindari pelabelan gaya belajar permanen yang kaku
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="text-lg font-bold text-white">Dimensi 4 — Kebutuhan Dukungan (Support Needs)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mencatat interaksi murid dengan scaffolding: petunjuk bertingkat, contoh pemecahan, pembagian tugas kecil, pengulangan instruksi, atau kebutuhan tantangan pengayaan.
              </p>
              <div className="pt-2 text-xs text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Penggunaan bantuan dicatat sebagai bukti kebutuhan guru
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT PACKS OVERVIEW */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-teal-400 mb-1">
                Paket Konten Lintas Bidang
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Kurikulum Relevan untuk SMK Informatika
              </h3>
            </div>
            <button
              onClick={() => onNavigate('content-packs')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 self-start sm:self-auto"
            >
              Lihat Rincian Misi Lengkap
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTENT_PACKS.map((pack) => (
              <div key={pack.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    {pack.code === 'general_informatics' && <Compass className="w-4 h-4" />}
                    {pack.code === 'digital_business' && <ShoppingBag className="w-4 h-4" />}
                    {pack.code === 'rpl' && <Code2 className="w-4 h-4" />}
                    {pack.code === 'tkj' && <Network className="w-4 h-4" />}
                  </div>
                  <h4 className="font-bold text-white text-sm">{pack.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {pack.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{pack.missionIds.length} Misi Interaktif</span>
                  <span className="text-teal-400 font-medium">Tersedia</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-gradient-to-t from-slate-900/80 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
            <ShieldCheck className="w-4 h-4" />
            Tanpa Akun Demo Palsu &bull; Bersih &bull; Siap Dipakai Nyata di Sekolah
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Siap Memulai Asesmen Diagnostik Kelas Anda?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Daftar sebagai Guru untuk membuat kelas dan sesi asesmen pertama Anda, atau gunakan kode bergabung jika Anda adalah murid.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all"
            >
              Registrasi Akun Baru
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
            >
              Sudah Punya Akun? Masuk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
