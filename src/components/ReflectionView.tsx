import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ExternalLink, 
  FileText, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { TeamCategory, ProgramKerja, TeamReflection } from '../types';

interface ReflectionViewProps {
  teams: TeamCategory[];
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onAddReflectionFeedback: (teamId: string, prokerId: string, feedback: string) => void;
  onOpenAI: (teamName?: string, context?: string) => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  teams,
  onSelectProgram,
  onAddReflectionFeedback,
  onOpenAI,
}) => {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [feedbackInputs, setFeedbackInputs] = useState<{ [prokerId: string]: string }>({});

  // Compile prokers that have reflections or are completed
  const reflectionProkers: { proker: ProgramKerja; team: TeamCategory }[] = [];
  teams.forEach(t => {
    t.prokers.forEach(p => {
      if (p.reflection || p.status === 'Selesai') {
        reflectionProkers.push({ proker: p, team: t });
      }
    });
  });

  const filteredProkers = reflectionProkers.filter(item => 
    selectedTeamFilter === 'all' || item.team.id === selectedTeamFilter
  );

  const handleSendFeedback = (teamId: string, prokerId: string) => {
    const text = feedbackInputs[prokerId]?.trim();
    if (!text) return;
    onAddReflectionFeedback(teamId, prokerId, text);
    setFeedbackInputs(prev => ({ ...prev, [prokerId]: '' }));
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              💭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Bank Refleksi & Evaluasi Program
                </h1>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {reflectionProkers.length} Program Terevaluasi
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dokumentasi pembelajaran tim pasca program: <strong>Apa yang berhasil</strong>, <strong>apa yang perlu diperbaiki</strong>, <strong>kendala lapangan</strong>, dan <strong>rekomendasi untuk tahun ajaran berikutnya</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="text-xs bg-white border border-indigo-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="all">Semua Tim ({teams.length})</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.shortName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reflections Grid */}
      <div className="space-y-5">
        {filteredProkers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">Belum ada refleksi di tim ini</h3>
            <p className="text-xs text-slate-500">Refleksi akan otomatis muncul setelah guru/PIC menyelesaikan program dan mengisi form evaluasi.</p>
          </div>
        ) : (
          filteredProkers.map(({ proker, team }) => {
            const ref = proker.reflection;

            return (
              <div
                key={proker.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition-all"
              >
                {/* Proker Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md">
                        {team.name}
                      </span>
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        ✅ Selesai
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectProgram(team.id, proker.id)}
                      className="text-base sm:text-lg font-black text-slate-900 hover:text-indigo-600 cursor-pointer"
                    >
                      {proker.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      PIC: <strong className="text-slate-800">{proker.pic}</strong>
                      {ref?.submittedAt && ` • Diserahkan: ${ref.submittedAt}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ref?.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span className="text-xs font-black text-amber-900">{ref.rating}/5</span>
                      </div>
                    )}

                    <button
                      onClick={() => onOpenAI(team.name, `Analisis Refleksi: ${proker.title} - What went well: ${ref?.whatWentWell}. Needs improvement: ${ref?.whatNeedsImprovement}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analisis AI</span>
                    </button>
                  </div>
                </div>

                {/* 4 Reflection Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* 1. What Went Well */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>1. What Went Well (Keberhasilan)</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium pl-5">
                      {ref?.whatWentWell || 'Pelaksanaan program berjalan sesuai target waktu dan melibatkan seluruh partisipan.'}
                    </p>
                  </div>

                  {/* 2. What Needs Improvement */}
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>2. What Needs Improvement</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium pl-5">
                      {ref?.whatNeedsImprovement || 'Peningkatan sosialisasi lebih awal kepada orang tua dan koordinasi logistik.'}
                    </p>
                  </div>

                  {/* 3. Challenges */}
                  <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                    <div className="font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>3. Challenges (Tantangan Lapangan)</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium pl-5">
                      {ref?.challenges || 'Penyesuaian jadwal asesmen dengan kegiatan parallel guru.'}
                    </p>
                  </div>

                  {/* 4. Recommendation for Next Year */}
                  <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                    <div className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>4. Rekomendasi Tahun Depan</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium pl-5">
                      {ref?.recommendationsForNextYear || 'Gunakan format digital terpusat dan tetapkan PIC logistik 2 minggu sebelum acara.'}
                    </p>
                  </div>
                </div>

                {/* Evidence Links Bar */}
                {proker.evidences && proker.evidences.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-600">Dokumentasi & Evidence:</span>
                    {proker.evidences.map((ev, idx) => (
                      <a
                        key={idx}
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-indigo-600 rounded-lg border border-slate-200 font-semibold text-[11px] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{ev.title} ({ev.type})</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Principal Review & Feedback Box */}
                <div className="pt-2 space-y-2">
                  {ref?.principalFeedback && (
                    <div className="bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-indigo-900 font-bold">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                          Review & Apresiasi Kepala Sekolah:
                        </span>
                        <span className="text-[10px] text-indigo-500 font-normal">
                          {ref.principalReviewedAt || 'Tercatat'}
                        </span>
                      </div>
                      <p className="text-slate-800 pl-5.5 leading-relaxed italic">
                        "{ref.principalFeedback}"
                      </p>
                    </div>
                  )}

                  {/* Feedback Input for Principal */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feedbackInputs[proker.id] || ''}
                      onChange={(e) => setFeedbackInputs(prev => ({ ...prev, [proker.id]: e.target.value }))}
                      placeholder="Beri catatan apresiasi atau feedback Kepala Sekolah untuk refleksi ini..."
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendFeedback(team.id, proker.id);
                      }}
                    />
                    <button
                      onClick={() => handleSendFeedback(team.id, proker.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Simpan Feedback</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
