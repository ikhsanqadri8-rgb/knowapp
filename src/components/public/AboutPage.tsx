import React from 'react';
import { 
  Compass, 
  Target, 
  Users, 
  BrainCircuit, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Lightbulb, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenPrivacy }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* SECTION 1 — About KNOW */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5" />
            Tentang Platform KNOW
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Mengenal Murid Lebih Dalam,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-200 to-indigo-300">
              Merancang Pembelajaran Lebih Tepat.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            “KNOW adalah platform asesmen diagnostik interaktif yang membantu guru memahami kesiapan awal, minat, preferensi aktivitas, dan kebutuhan dukungan murid. Melalui misi interaktif dan analisis berbasis bukti, KNOW membantu guru memperoleh gambaran yang lebih terstruktur sebagai dasar merancang pembelajaran yang relevan dan responsif terhadap kebutuhan murid.”
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('content-packs')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              Lihat 16 Bank Misi
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
            >
              Daftar Sebagai Guru / Murid
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2 — The Problem */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-l-4 border-indigo-500 pl-4 space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">
              Tantangan Nyata di Sekolah
            </h2>
            <h3 className="text-2xl font-bold text-white">
              Keberagaman Karakteristik & Kesiapan Awal Murid SMK
            </h3>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm leading-relaxed">
            <p>
              Setiap awal tahun ajaran baru atau pergantian modul ajar, guru SMK menyambut puluhan murid dengan latar belakang yang sangat heterogen. Sebagian murid sudah akrab dengan logika pemrograman dan perangkat komputer dari SMP atau hobi pribadi, sementara sebagian lainnya baru pertama kali bersentuhan langsung dengan konsep teknologi informasi.
            </p>
            <p>
              Asesmen tradisional yang hanya berfokus pada perolehan skor akhir (angka kuantitatif tunggal) sering kali belum cukup menjelaskan <em>mengapa</em> seorang murid mengalami kendala, atau <em>strategi apa</em> yang paling tepat untuk menolong mereka. Skor rendah tidak selalu berarti kurangnya kecerdasan, melainkan bisa disebabkan oleh miskonsepsi konsep dasar, keterbatasan kosakata teknis, atau instruksi belajar yang tidak sejalan dengan gaya eksplorasi murid.
            </p>
            <p>
              KNOW hadir bukan untuk menggantikan peran berharga guru atau mengklaim menyelesaikan seluruh persoalan pendidikan, melainkan dirancang sebagai alat pendamping formatif yang praktis. Dengan aktivitas singkat (10–15 menit) yang dikemas sebagai misi permainan interaktif, guru memperoleh rekam jejak bukti autentik yang terstruktur untuk merencanakan tindak lanjut pembelajaran secara lebih percaya diri.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Our Approach */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-teal-400">
              Metodologi 4 Tahap
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Pendekatan KNOW: Dari Bukti Menuju Tindakan
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Empat pilar sekuensial yang menghubungkan pengalaman eksplorasi murid dengan keputusan instruksional guru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold flex items-center justify-center font-mono">
                01
              </div>
              <h4 className="font-bold text-white text-base">Discover</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Memahami kemampuan awal, minat konteks, dan titik kesiapan murid tanpa tekanan nilai rapor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center font-mono">
                02
              </div>
              <h4 className="font-bold text-white text-base">Explore</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengajak murid menyelesaikan misi tantangan interaktif dengan alur briefing, simulasi, dan umpan balik langsung.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex items-center justify-center font-mono">
                03
              </div>
              <h4 className="font-bold text-white text-base">Understand</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengorganisasi bukti respons ke dalam 4 dimensi diagnostik yang dapat ditelusuri ke setiap butir jawaban.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center font-mono">
                04
              </div>
              <h4 className="font-bold text-white text-base">Design</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Membantu guru merancang strategi pengelompokan fleksibel, bahan ajar berjenjang, dan proyek kontekstual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Educational Foundation */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-teal-400">
              Landasan Pedagogis
            </h2>
            <h3 className="text-2xl font-bold text-white">
              Kerangka Teoretis yang Menjadi Acuan Pengembangan
            </h3>
            <p className="text-xs text-slate-400">
              Prinsip-prinsip ini digunakan sebagai pedoman desain alur instrumen dan rekomendasi, bukan klaim validitas psikometrik formal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-400" />
                Asesmen Diagnostik Awal
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mengidentifikasi kompetensi prasyarat dan miskonsepsi sebelum pembelajaran dimulai agar intervensi dapat diberikan sejak dini.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Teaching at the Right Level (TaRL)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menyesuaikan pengelompokan dan tingkat kedalaman instruksi dengan fase kesiapan nyata murid, bukan sekadar patokan usia atau kelas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Scaffolding & Zone of Proximal Development (ZPD)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menyediakan bantuan bertahap (petunjuk, contoh penyelesaian, perincian langkah) yang dikurangi seiring meningkatnya kemandirian murid.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Universal Design for Learning (UDL) & Diferensiasi
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menyediakan multi-modalitas representasi konten, variasi proses pengerjaan, dan pilihan konteks penugasan yang relevan dengan minat murid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Meet the Developer */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-teal-500 via-indigo-500 to-purple-600 shadow-xl shadow-teal-500/20">
            <div className="w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-300 font-mono">
              IQ
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">Ikhsan Qadri</h3>
            <p className="text-sm font-semibold text-teal-400">
              Developer & Educational Technology Enthusiast
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left shadow-lg">
            <p className="text-sm text-slate-300 leading-relaxed italic">
              “KNOW dikembangkan oleh Ikhsan Qadri sebagai upaya mengeksplorasi pemanfaatan teknologi dalam asesmen diagnostik dan perencanaan pembelajaran. Platform ini dirancang untuk menjembatani pengalaman asesmen murid yang lebih interaktif dengan kebutuhan guru akan informasi yang lebih terstruktur, relevan, dan dapat ditindaklanjuti.”
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Responsible Use of AI */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pemanfaatan AI yang Bertanggung Jawab</h3>
              <p className="text-xs text-slate-400">Prinsip Etika Integrasi Gemini AI pada KNOW</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Pada platform KNOW, Gemini AI digunakan semata-mata sebagai <strong>asisten analitik pendukung bagi guru</strong> untuk merangkum pola respons kelas yang kompleks, memetakan indikator yang butuh perhatian, dan menyarankan variasi strategi diferensiasi ajar.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Guru Selalu Memegang Kendali Pedagogis:</strong> Rekomendasi AI bersifat terbuka untuk ditinjau, disunting catatannya, atau diabaikan oleh guru pengampu. Keputusan instruksional di kelas tetap berada di tangan pendidik manusia.
              </li>
              <li>
                <strong className="text-slate-200">Bukan Diagnosis Medis atau Label Permanen:</strong> Output sistem tidak boleh dimaknai sebagai vonis psikologis atau pembatasan potensi belajar murid.
              </li>
              <li>
                <strong className="text-slate-200">Keterbatasan Data Dinyatakan Terbuka:</strong> Apabila respons murid belum mencukupi batas minimum, sistem secara eksplisit menampilkan status “Data Belum Cukup” daripada menghasilkan kesimpulan spekulatif.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
