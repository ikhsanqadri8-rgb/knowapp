import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Target, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  X,
  Code2,
  Network,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { CONTENT_PACKS } from '../../content/contentPacks';
import { ALL_MISSIONS } from '../../content/missionBank';
import type { Mission } from '../../types';

export const ContentPacksView: React.FC = () => {
  const [selectedPackId, setSelectedPackId] = useState<string>('general_informatics');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  const currentPack = CONTENT_PACKS.find((p) => p.id === selectedPackId) || CONTENT_PACKS[0];
  const packMissions = ALL_MISSIONS.filter((m) => currentPack.missionIds.includes(m.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Katalog Bank Misi Diagnostik
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Paket Konten Lintas Bidang Kejuruan
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Eksplorasi 16 instrumen misi diagnostik yang dirancang khusus untuk mengukur kesiapan awal, minat, dan kebutuhan dukungan murid SMK Informatika.
        </p>
      </div>

      {/* Content Pack Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CONTENT_PACKS.map((pack) => {
          const isSelected = pack.id === selectedPackId;
          return (
            <button
              key={pack.id}
              onClick={() => setSelectedPackId(pack.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-teal-500/60 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2">
                  {pack.code === 'general_informatics' && <Compass className="w-4 h-4" />}
                  {pack.code === 'digital_business' && <ShoppingBag className="w-4 h-4" />}
                  {pack.code === 'rpl' && <Code2 className="w-4 h-4" />}
                  {pack.code === 'tkj' && <Network className="w-4 h-4" />}
                </div>
                <h3 className="font-bold text-xs text-white leading-tight">{pack.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{pack.tagline}</p>
              </div>
              <div className="text-[10px] text-teal-400 font-mono font-medium">
                {pack.missionIds.length} Misi Interaktif
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Pack Description */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <h2 className="text-base font-bold text-white">{currentPack.name}</h2>
        <p className="text-xs text-slate-300 leading-relaxed">{currentPack.description}</p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Prasyarat Belajar Awal:</span>
          {currentPack.prerequisites.map((req, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-teal-300 font-mono">
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Mission Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">
          Misi dalam Paket Ini ({packMissions.length} Misi)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packMissions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => setActiveMission(mission)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {mission.dimensionLabel.split(':')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {mission.targetDurationMinutes} min
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors">
                  {mission.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {mission.briefing.story}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Tingkat: <strong className="text-slate-200">{mission.difficulty}</strong>
                </span>
                <span className="text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Periksa Rincian
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Detail Modal */}
      {activeMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-950 text-teal-300 border border-teal-800/40">
                  {activeMission.dimensionLabel}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{activeMission.title}</h3>
              </div>
              <button
                onClick={() => setActiveMission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="font-semibold text-slate-200 text-xs">Indikator Kompetensi:</p>
                <p className="text-teal-300 font-medium">{activeMission.indicator}</p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Skenario Misi</h4>
                <p className="text-slate-300">{activeMission.briefing.story}</p>
                <p className="text-slate-400">{activeMission.briefing.scenario}</p>
              </div>

              {activeMission.stimulus && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Stimulus</h4>
                  {activeMission.stimulus.scenarioText && (
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300 whitespace-pre-wrap">
                      {activeMission.stimulus.scenarioText}
                    </pre>
                  )}
                  {activeMission.stimulus.codeSnippet && (
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300 whitespace-pre-wrap">
                      {activeMission.stimulus.codeSnippet}
                    </pre>
                  )}
                  {activeMission.stimulus.dataTable && (
                    <div className="overflow-x-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-teal-400 font-mono">
                            {activeMission.stimulus.dataTable.headers.map((h, i) => (
                              <th key={i} className="p-1.5">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeMission.stimulus.dataTable.rows.map((r, ri) => (
                            <tr key={ri} className="border-b border-slate-900">
                              {r.map((c, ci) => (
                                <td key={ci} className="p-1.5">{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-1.5">
                <p className="font-bold text-indigo-300 text-xs">Interpretasi Bukti Jawaban:</p>
                <p className="text-slate-300">
                  <strong>Jika Benar:</strong> {activeMission.evidenceInterpretation.correctMeaning}
                </p>
                {activeMission.evidenceInterpretation.commonMisconception && (
                  <p className="text-amber-300">
                    <strong>Miskonsepsi Umum:</strong> {activeMission.evidenceInterpretation.commonMisconception}
                  </p>
                )}
                <p className="text-slate-400 text-[11px]">
                  <strong>Implikasi Pedagogis:</strong> {activeMission.evidenceInterpretation.pedagogicalImplication}
                </p>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveMission(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
