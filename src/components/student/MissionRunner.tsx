import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  Sparkles, 
  ArrowRight,
  MoveUp,
  MoveDown,
  Layers,
  RotateCcw
} from 'lucide-react';
import { ALL_MISSIONS } from '../../content/missionBank';
import { useData } from '../../context/DataContext';
import type { Mission } from '../../types';

interface MissionRunnerProps {
  sessionId: string;
  missionId: string;
  onFinish: () => void;
  onBack: () => void;
}

type RunnerStep = 'briefing' | 'challenge' | 'feedback' | 'summary';

export const MissionRunner: React.FC<MissionRunnerProps> = ({
  sessionId,
  missionId,
  onFinish,
  onBack
}) => {
  const { submitMissionResponse, getSessionById } = useData();
  const session = getSessionById(sessionId);
  const mission = ALL_MISSIONS.find((m) => m.id === missionId);

  const [step, setStep] = useState<RunnerStep>('briefing');
  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    percentage: number;
    isCorrect: boolean;
    feedback: string;
  } | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Initialize ordering items if mission type is ordering
    if (mission && mission.type === 'ordering' && mission.challenge.orderingItems) {
      // Shuffle initially
      const ids = mission.challenge.orderingItems.map((i) => i.id);
      const shuffled = [...ids].sort(() => Math.random() - 0.5);
      setOrderedItems(shuffled);
    }

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mission]);

  if (!mission) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Misi tidak ditemukan. <button onClick={onBack} className="text-teal-400 font-semibold underline">Kembali</button>
      </div>
    );
  }

  const handleRevealHint = () => {
    if (hintsRevealed < mission.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  const moveOrderItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedItems.length) return;
    const next = [...orderedItems];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setOrderedItems(next);
  };

  const handleSubmit = async () => {
    let finalAnswer = selectedChoice;
    if (mission.type === 'ordering') {
      finalAnswer = orderedItems;
    }

    if (finalAnswer === null || finalAnswer === undefined) return;

    setIsSubmitting(true);
    try {
      const res = await submitMissionResponse(
        sessionId,
        missionId,
        finalAnswer,
        timeSpentSeconds,
        hintsRevealed
      );
      setSubmissionResult(res);
      setStep('feedback');

      // Trigger celebratory confetti for positive progress!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Confetti silent fallback
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan respons asesmen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar with HUD */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Keluar ke Hub Misi
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            {formatTimer(timeSpentSeconds)}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/40">
            {mission.dimensionLabel.split(':')[0]}
          </span>
        </div>
      </div>

      {/* STEP 1: BRIEFING */}
      {step === 'briefing' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in shadow-2xl">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
              Mission Briefing & Skenario
            </span>
            <h1 className="text-2xl font-extrabold text-white">{mission.title}</h1>
            <p className="text-xs text-slate-400">{mission.indicator}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono text-teal-300">
              Konteks Kasus:
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{mission.briefing.story}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{mission.briefing.scenario}</p>
          </div>

          {mission.stimulus && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase font-mono">Informasi Pendukung:</h4>
              {mission.stimulus.scenarioText && (
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-teal-300 whitespace-pre-wrap">
                  {mission.stimulus.scenarioText}
                </pre>
              )}
              {mission.stimulus.codeSnippet && (
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-teal-300 whitespace-pre-wrap">
                  {mission.stimulus.codeSnippet}
                </pre>
              )}
              {mission.stimulus.dataTable && (
                <div className="overflow-x-auto p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-teal-400 font-mono">
                        {mission.stimulus.dataTable.headers.map((h, i) => (
                          <th key={i} className="p-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mission.stimulus.dataTable.rows.map((r, ri) => (
                        <tr key={ri} className="border-b border-slate-800/40">
                          {r.map((c, ci) => (
                            <td key={ci} className="p-2 text-slate-300">{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Tingkat Tantangan: <strong className="text-white">{mission.difficulty}</strong> &bull; Estimasi: {mission.targetDurationMinutes} Menit
            </div>
            <button
              onClick={() => setStep('challenge')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              Mulai Tantangan
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CHALLENGE */}
      {step === 'challenge' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in shadow-2xl">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
              Tantangan Interaktif
            </span>
            <h2 className="text-xl font-bold text-white">{mission.challenge.question}</h2>
            <p className="text-xs text-slate-400">{mission.challenge.instructions}</p>
          </div>

          {/* Stimulus mini reminder if code or data exists */}
          {mission.stimulus && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {mission.stimulus.scenarioText && (
                <pre className="font-mono text-[11px] text-teal-300 whitespace-pre-wrap">
                  {mission.stimulus.scenarioText}
                </pre>
              )}
              {mission.stimulus.codeSnippet && (
                <pre className="font-mono text-[11px] text-teal-300 whitespace-pre-wrap">
                  {mission.stimulus.codeSnippet}
                </pre>
              )}
            </div>
          )}

          {/* CHALLENGE TYPE: MULTIPLE CHOICE & SCENARIO & REFLECTION */}
          {mission.challenge.choices && (
            <div className="space-y-3">
              {mission.challenge.choices.map((choice) => {
                const isSelected = selectedChoice === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() => setSelectedChoice(choice.id)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-teal-950/60 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="leading-relaxed">{choice.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* CHALLENGE TYPE: ORDERING */}
          {mission.type === 'ordering' && mission.challenge.orderingItems && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-2">
                Gunakan tombol panah untuk mengatur urutan langkah dari yang paling awal (1) hingga akhir (4):
              </p>
              {orderedItems.map((itemId, idx) => {
                const item = mission.challenge.orderingItems?.find((i) => i.id === itemId);
                if (!item) return null;

                return (
                  <div
                    key={itemId}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200">{item.text}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveOrderItem(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveOrderItem(idx, idx + 1)}
                        disabled={idx === orderedItems.length - 1}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Progressive Hint Drawer */}
          {session?.allowHints && mission.hints.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Bantuan / Petunjuk Bertingkat ({hintsRevealed}/{mission.hints.length})
                </span>
                {hintsRevealed < mission.hints.length && (
                  <button
                    type="button"
                    onClick={handleRevealHint}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold"
                  >
                    Buka Petunjuk {hintsRevealed + 1}
                  </button>
                )}
              </div>

              {hintsRevealed > 0 && (
                <div className="space-y-1.5 pt-1">
                  {mission.hints.slice(0, hintsRevealed).map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-indigo-900/40 text-xs text-slate-300">
                      <strong className="text-indigo-300">Petunjuk {i + 1}:</strong> {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit action */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              onClick={() => setStep('briefing')}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Baca Ulang Kasus
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (mission.type !== 'ordering' && !selectedChoice)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Memeriksa Jawaban...' : 'Kirim Jawaban Misi'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FEEDBACK */}
      {step === 'feedback' && submissionResult && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white">Misi Selesai!</h2>
            <p className="text-xs text-slate-400">
              Responsmu telah dicatat secara aman dalam database asesmen kelas
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed">
            <h3 className="font-bold text-teal-400 uppercase tracking-wider font-mono">
              Umpan Balik Kontekstual:
            </h3>
            <p className="text-slate-300 text-sm">
              {submissionResult.feedback}
            </p>
            {hintsRevealed > 0 && (
              <p className="text-[11px] text-slate-400 pt-1">
                Catatan: Kamu menggunakan {hintsRevealed} petunjuk. Ini membantu guru memahami tingkat panduan yang pas untukmu.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">XP Diperoleh:</span>
              <p className="text-lg font-bold text-teal-400 font-mono">+100 XP</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Waktu Pengerjaan:</span>
              <p className="text-lg font-bold text-white font-mono">{formatTimer(timeSpentSeconds)}</p>
            </div>
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              onClick={onFinish}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
            >
              Kembali ke Hub Misi
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
