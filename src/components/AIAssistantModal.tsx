import React, { useState } from 'react';
import { Sparkles, BrainCircuit, X, Send, Loader2, Lightbulb, CheckCircle2, MessageSquare } from 'lucide-react';
import { TeamCategory } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamCategory[];
  defaultTeamName?: string;
  defaultProkerTitle?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  teams,
  defaultTeamName = 'Agama',
  defaultProkerTitle = '',
}) => {
  const [selectedTeam, setSelectedTeam] = useState<string>(defaultTeamName || teams[0]?.name || 'Agama');
  const [prokerTitle, setProkerTitle] = useState<string>(defaultProkerTitle || '');
  const [currentStage, setCurrentStage] = useState<string>('Ideate');
  const [promptType, setPromptType] = useState<'design_planning' | 'reflection_analysis'>('design_planning');
  const [contextInput, setContextInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAskAI = async () => {
    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/design-thinking-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: selectedTeam,
          prokerTitle: prokerTitle || 'Program Kerja Tim',
          currentStage,
          problemOrReflection: contextInput,
          promptType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResponse(data.advice);
      } else {
        setAiResponse('Mohon maaf, terjadi kendala saat memproses rekomendasi AI. Silakan coba sesaat lagi.');
      }
    } catch (e: any) {
      console.error(e);
      // Fallback response for smooth offline or network resilient experience
      setAiResponse(
        `[Rekomendasi Design Thinking untuk Tim ${selectedTeam}]\n\n1. **Empathize & Define**: Lakukan survei singkat kebutuhan peserta dan panitia untuk acara "${prokerTitle || 'kegiatan ini'}".\n2. **Ideate & Visual Concept**: Buat konsep visual segar bernuansa ramah anak dan mudah diterapkan di berbagai materi promosi (poster, banner, sosial media).\n3. **Prototype**: Siapkan template pengerjaan H-14 agar tim desainer dan dokumentator memiliki cukup waktu iterasi.\n4. **Workload Balance**: Bagi tanggung jawab secara spesifik agar tiap anggota memiliki porsi yang terukur.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-400/30">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">AI Asisten Team Design</h3>
              <p className="text-xs text-slate-300">Konsultasi Design Thinking, Solusi Kendala & Analisis Refleksi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Tim:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Program Kerja / Topik:</label>
              <input
                type="text"
                value={prokerTitle}
                onChange={(e) => setProkerTitle(e.target.value)}
                placeholder="Contoh: Super Camp, Bulan Bahasa, MI Thon..."
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Bantuan AI:</label>
              <select
                value={promptType}
                onChange={(e) => setPromptType(e.target.value as any)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="design_planning">💡 Perencanaan & Ide Kreatif (Design Thinking)</option>
                <option value="reflection_analysis">📊 Analisis Refleksi & Pemecahan Kendala</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tahap Saat Ini:</label>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Empathize">1. Empathize (Kebutuhan Audiens)</option>
                <option value="Define">2. Define (Rumusan Masalah)</option>
                <option value="Ideate">3. Ideate (Eksplorasi Konsep)</option>
                <option value="Prototype">4. Prototype (Draf & Layout)</option>
                <option value="Test">5. Test (Uji & Review Acara)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Catatan Konteks / Kendala Spesifik yang Dihadapi:
            </label>
            <textarea
              rows={3}
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="Jelaskan tantangan, batasan waktu, atau kebutuhan khusus acara agar AI dapat memberikan rekomendasi yang sangat tepat sasaran..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleAskAI}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI sedang menganalisis strategi tim...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Dapatkan Rekomendasi Design Thinking</span>
              </>
            )}
          </button>

          {/* AI Response View */}
          {aiResponse && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 border border-indigo-500/30 text-xs leading-relaxed space-y-2 max-h-72 overflow-y-auto whitespace-pre-wrap">
              <div className="flex items-center gap-1.5 text-violet-400 font-bold border-b border-slate-800 pb-2">
                <BrainCircuit className="w-4 h-4" />
                <span>Saran Strategis AI untuk {selectedTeam}</span>
              </div>
              <div>{aiResponse}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
