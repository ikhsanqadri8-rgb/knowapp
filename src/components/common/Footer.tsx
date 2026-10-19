import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrivacy }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 mt-auto text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Compass className="w-4 h-4 text-teal-400" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">KNOW</span>
            </div>
            <p className="text-slate-300 font-medium text-sm">
              Discover Learners. Design Better Learning.
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Platform asesmen diagnostik interaktif berbasis gamifikasi untuk membantu guru memetakan karakteristik awal belajar murid dan merancang pembelajaran yang berpusat pada bukti autentik.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span>Dikembangkan dengan dedikasi oleh</span>
              <strong className="text-slate-200 font-semibold">Ikhsan Qadri</strong>
              <span className="text-[11px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                Developer & Educational Technology Enthusiast
              </span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Eksplorasi Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('landing')} 
                  className="hover:text-teal-400 transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('content-packs')} 
                  className="hover:text-teal-400 transition-colors"
                >
                  Bank Misi & Paket Konten
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-teal-400 transition-colors"
                >
                  Tentang KNOW & Metodologi
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="hover:text-teal-400 transition-colors"
                >
                  Portal Masuk
                </button>
              </li>
            </ul>
          </div>

          {/* Ethics & Compliance Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Keamanan & Privasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onOpenPrivacy} 
                  className="hover:text-teal-400 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Kebijakan Privasi Murid
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPrivacy} 
                  className="hover:text-teal-400 transition-colors"
                >
                  Etika & Batasan Instrumen AI
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block pt-1 leading-normal">
                  KNOW melindungi data pribadi murid. Tidak menjual data atau memberikan diagnosis psikologis permanen.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {currentYear} KNOW Platform. Hak cipta dilindungi. Pengembang: Ikhsan Qadri.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 transition-colors">
              Privasi Data
            </button>
            <span>&bull;</span>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300 transition-colors">
              Pernyataan AI Bertanggung Jawab
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
