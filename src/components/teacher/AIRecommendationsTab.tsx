import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Users, 
  Lightbulb, 
  Layers, 
  Check, 
  Edit3,
  HelpCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AIRecommendationsTabProps {
  sessionId: string;
}

export const AIRecommendationsTab: React.FC<AIRecommendationsTabProps> = ({ sessionId }) => {
  const { recommendations, requestAIRecommendations, updateRecommendationNotes, getSessionResponses } = useData();

  const existingRec = recommendations.find((r) => r.sessionId === sessionId);
  const responses = getSessionResponses(sessionId);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teacherContext, setTeacherContext] = useState('');
  const [teacherNotes, setTeacherNotes] = useState(existingRec?.teacherNotes || '');
  const [status, setStatus] = useState<'draft' | 'reviewed' | 'applied'>(existingRec?.status || 'draft');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    const res = await requestAIRecommendations(sessionId, teacherContext);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || 'Gagal memanggil layanan Gemini AI.');
    }
  };

  const handleSaveNotes = async () => {
    if (!existingRec) return;
    await updateRecommendationNotes(existingRec.id, teacherNotes, status);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Rekomendasi Pedagogis Gemini AI
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/50">
                  gemini-2.5-flash
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Menganalisis bukti empiris hasil asesmen murid untuk merumuskan strategi Teaching at the Right Level (TaRL), Scaffolding berjenjang, dan rancangan diferensiasi instruksional.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || responses.length === 0}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Menganalisis Data...' : existingRec ? 'Perbarui Analisis AI' : 'Hasilkan Rekomendasi AI'}
          </button>
        </div>

        {responses.length === 0 && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Belum ada data respons pengerjaan murid di sesi ini. Gemini membutuhkan bukti respons aktual untuk merumuskan rekomendasi yang valid.</span>
          </div>
        )}

        {/* Optional context field for teacher */}
        {!existingRec && responses.length > 0 && (
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Catatan Konteks Tambahan dari Guru (Opsional)
            </label>
            <input
              type="text"
              value={teacherContext}
              onChange={(e) => setTeacherContext(e.target.value)}
              placeholder="Contoh: Fokuskan rekomendasi pada kesiapan materi logika percabangan untuk persiapan modul pemrograman web."
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-300">Gagal Memproses Rekomendasi:</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* When Recommendation exists */}
      {existingRec && existingRec.data && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-teal-400" />
                Ringkasan Eksekutif Kesiapan Belajar Kelas
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Dihasilkan: {new Date(existingRec.generatedAt).toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {existingRec.data.executiveSummary}
            </p>
          </div>

          {/* TaRL Grouping (Teaching at the Right Level) */}
          {existingRec.data.tarlGrouping && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">
                  Pengelompokan Fleksibel Berbasis TaRL (Teaching at the Right Level)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {existingRec.data.tarlGrouping.groupingStrategy}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-teal-300">Kesiapan Mandiri / Pengayaan</span>
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                    {existingRec.data.tarlGrouping.readyForExtension?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-300">Perlu Latihan Terarah</span>
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                    {existingRec.data.tarlGrouping.needGuidedPractice?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-300">Pendampingan Intensif</span>
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  </div>
                  <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                    {existingRec.data.tarlGrouping.needIntensiveScaffolding?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Strategies Grid */}
          {existingRec.data.suggestedStrategies && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Rekomendasi Tindak Lanjut Pembelajaran Berdiferensiasi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {existingRec.data.suggestedStrategies.map((strat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-xs">{strat.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        {strat.differentiationType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "{strat.rationale}"
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-semibold text-slate-300">Langkah Aksi Guru:</p>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                        {strat.actionSteps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Misconceptions */}
          {existingRec.data.misconceptions && existingRec.data.misconceptions.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Analisis Miskonsepsi yang Teramati
              </h3>
              <div className="space-y-3">
                {existingRec.data.misconceptions.map((misc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <p className="font-bold text-rose-300">{misc.concept}</p>
                    <p className="text-slate-400"><strong className="text-slate-300">Bentuk Kesalahan:</strong> {misc.observedError}</p>
                    <p className="text-teal-300"><strong className="text-slate-300">Saran Klarifikasi Guru:</strong> {misc.suggestedCorrection}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Review & Notes Editor */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-teal-800/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-teal-400" />
                  Tinjauan & Catatan Khusus Guru Pengampu
                </h3>
                <p className="text-xs text-slate-400">
                  Guru memegang kendali penuh untuk menyelaraskan rekomendasi AI dengan kondisi nyata kelas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Status Tinjauan:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="draft">Draf (Belum Selesai Ditinjau)</option>
                  <option value="reviewed">Sudah Ditinjau Guru</option>
                  <option value="applied">Diterapkan ke Perencanaan Modul</option>
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="Tuliskan catatan modifikasi, rencana tindak lanjut di lab, atau penyesuaian jadwal mengajar Anda di sini..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? (
                <span className="text-xs text-teal-400 flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4" />
                  Catatan Guru Berhasil Disimpan Secara Persisten!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Perubahan tersimpan ke database Firestore/lokal Anda.
                </span>
              )}

              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Catatan Guru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
