import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Filter, 
  Layers, 
  Calendar, 
  UserCheck, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { TeamCategory, ProgramKerja, IssueCategory } from '../types';
import { isProkerNeedsAttention } from '../utils/storage';

interface AttentionViewProps {
  teams: TeamCategory[];
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onResolveIssue: (teamId: string, prokerId: string) => void;
  onAddPrincipalComment: (teamId: string, prokerId: string, comment: string) => void;
  onOpenAI: (teamName?: string, prokerTitle?: string) => void;
}

export const AttentionView: React.FC<AttentionViewProps> = ({
  teams,
  onSelectProgram,
  onResolveIssue,
  onAddPrincipalComment,
  onOpenAI,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterState, setFilterState] = useState<'unresolved' | 'resolved' | 'all'>('unresolved');
  const [commentInputs, setCommentInputs] = useState<{ [prokerId: string]: string }>({});

  const categories: IssueCategory[] = [
    'Koordinasi',
    'SDM',
    'Waktu',
    'Budget',
    'Sarana',
    'Approval',
    'Lainnya',
  ];

  // Compile issues
  const allIssues: { proker: ProgramKerja; team: TeamCategory }[] = [];
  teams.forEach(t => {
    t.prokers.forEach(p => {
      if (p.issue?.hasIssue || p.status === 'Terkendala') {
        allIssues.push({ proker: p, team: t });
      }
    });
  });

  const filteredIssues = allIssues.filter(({ proker }) => {
    const matchesCategory = selectedCategory === 'all' || proker.issue?.category === selectedCategory;
    const isResolved = proker.issue?.isResolved || false;
    
    if (filterState === 'unresolved') return matchesCategory && !isResolved;
    if (filterState === 'resolved') return matchesCategory && isResolved;
    return matchesCategory;
  });

  const handleSendComment = (teamId: string, prokerId: string) => {
    const text = commentInputs[prokerId]?.trim();
    if (!text) return;
    onAddPrincipalComment(teamId, prokerId, text);
    setCommentInputs(prev => ({ ...prev, [prokerId]: '' }));
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              ⚠️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Needs Attention & Kendala Tim
                </h1>
                <span className="text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                  {allIssues.filter(i => !i.proker.issue?.isResolved).length} Aktif
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pusat penanganan hambatan program sekolah. Kepala Sekolah dapat langsung memberikan arahan solusi, persetujuan sarana/approval, atau menandai selesai (*Mark as Resolved*).
              </p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-rose-200/60">
          <span className="text-xs font-bold text-slate-600 mr-1">Kategori Kendala:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-rose-200 hover:bg-rose-100/60'
            }`}
          >
            Semua ({allIssues.length})
          </button>
          {categories.map((cat) => {
            const count = allIssues.filter(i => i.proker.issue?.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-rose-200 hover:bg-rose-100/60'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Unresolved / Resolved tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterState('unresolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterState === 'unresolved' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perlu Tindak Lanjut ({allIssues.filter(i => !i.proker.issue?.isResolved).length})
          </button>
          <button
            onClick={() => setFilterState('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterState === 'resolved' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Teratasi ({allIssues.filter(i => i.proker.issue?.isResolved).length})
          </button>
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterState === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Riwayat
          </button>
        </div>
      </div>

      {/* Issue Cards */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-80" />
            <h3 className="font-bold text-slate-800 text-base">Tidak ada kendala dalam kategori ini</h3>
            <p className="text-xs text-slate-500">Seluruh program kerja berjalan lancar dan terkoordinasi dengan baik.</p>
          </div>
        ) : (
          filteredIssues.map(({ proker, team }) => {
            const isResolved = proker.issue?.isResolved || false;

            return (
              <div
                key={proker.id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-xs space-y-4 ${
                  isResolved ? 'border-emerald-200 opacity-85' : 'border-rose-300 hover:border-rose-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md">
                        {team.name}
                      </span>
                      {proker.issue?.category && (
                        <span className="text-xs font-extrabold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-md border border-rose-200">
                          Kategori: {proker.issue.category}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-400">
                        Target: {proker.targetDate || proker.targetMonth || '-'}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectProgram(team.id, proker.id)}
                      className="text-base sm:text-lg font-black text-slate-900 hover:text-indigo-600 cursor-pointer"
                    >
                      {proker.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      PIC: <span className="font-bold text-slate-800">{proker.pic}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => onOpenAI(team.name, `${proker.title} - Kendala: ${proker.issue?.description}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
                      title="Dapatkan rekomendasi solusi dari AI"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Saran Solusi AI</span>
                    </button>

                    <button
                      onClick={() => onResolveIssue(team.id, proker.id)}
                      className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isResolved
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isResolved ? 'Buka Kembali Kendala' : 'Mark as Resolved'}</span>
                    </button>
                  </div>
                </div>

                {/* Kendala Detail Description */}
                <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200/80 text-xs space-y-1">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Keterangan Kendala dari PIC:</span>
                  </div>
                  <p className="text-slate-800 pl-5.5 leading-relaxed font-medium">
                    {proker.issue?.description || 'Belum ada rincian kendala yang dituliskan.'}
                  </p>
                </div>

                {/* Principal Feedback Display & Input */}
                <div className="space-y-3 pt-2">
                  {proker.issue?.principalComment && (
                    <div className="bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-indigo-900 font-bold">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                          Arahan / Keputusan Kepala Sekolah:
                        </span>
                        <span className="text-[10px] text-indigo-500 font-normal">
                          {proker.issue.principalCommentedAt || 'Baru saja'}
                        </span>
                      </div>
                      <p className="text-slate-800 pl-5.5 leading-relaxed italic">
                        "{proker.issue.principalComment}"
                      </p>
                    </div>
                  )}

                  {/* Comment Input Box for Principal */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[proker.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [proker.id]: e.target.value }))}
                      placeholder="Tulis instruksi / feedback tindak lanjut Kepala Sekolah..."
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(team.id, proker.id);
                      }}
                    />
                    <button
                      onClick={() => handleSendComment(team.id, proker.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Arahan</span>
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
