import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerStatus, DesignThinkingPhase } from '../types';
import { getProkerProgress, isProkerNeedsAttention } from '../utils/storage';

interface ProgramsViewProps {
  teams: TeamCategory[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onOpenAddProker: (defaultTeamId?: string) => void;
  onOpenAI: (teamName?: string, prokerTitle?: string) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  teams,
  searchQuery,
  onSearchChange,
  onSelectProgram,
  onOpenAddProker,
  onOpenAI,
}) => {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');

  const allProkersWithTeam = teams.flatMap(t => 
    t.prokers.map(p => ({ ...p, teamName: t.name, teamShortName: t.shortName }))
  );

  const filteredProkers = allProkersWithTeam.filter(p => {
    const matchesSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTeam = selectedTeamFilter === 'all' || p.teamId === selectedTeamFilter;
    const matchesStatus = selectedStatusFilter === 'all' || p.status === selectedStatusFilter;
    const matchesPhase = selectedPhaseFilter === 'all' || p.designPhase === selectedPhaseFilter;

    return matchesSearch && matchesTeam && matchesStatus && matchesPhase;
  });

  const getStatusBadge = (status: ProkerStatus, proker: ProgramKerja) => {
    if (isProkerNeedsAttention(proker)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          🔴 Attention
        </span>
      );
    }

    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            🟢 Selesai
          </span>
        );
      case 'Sedang Berjalan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            🟡 Berjalan
          </span>
        );
      case 'Tahap Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            🟣 In Review
          </span>
        );
      case 'Dalam Perencanaan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            🔵 Planning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            ⚪ Belum Mulai
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Semua Program Kerja ({allProkersWithTeam.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar lengkap program kerja, capaian milestone, penanggung jawab (PIC), dan status eksekusi
          </p>
        </div>

        <button
          onClick={() => onOpenAddProker()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari program kerja, nama PIC, deliverable, atau topik..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Team Filter */}
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Semua Tim ({teams.length})</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.shortName}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Sedang Berjalan">Sedang Berjalan</option>
              <option value="Dalam Perencanaan">Dalam Perencanaan</option>
              <option value="Tahap Review">Tahap Review</option>
              <option value="Selesai">Selesai</option>
              <option value="Terkendala">Terkendala</option>
              <option value="Belum Dimulai">Belum Dimulai</option>
            </select>

            {/* Phase Filter */}
            <select
              value={selectedPhaseFilter}
              onChange={(e) => setSelectedPhaseFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Semua Tahap Design</option>
              <option value="Empathize">1. Empathize</option>
              <option value="Define">2. Define</option>
              <option value="Ideate">3. Ideate</option>
              <option value="Prototype">4. Prototype</option>
              <option value="Test">5. Test</option>
              <option value="Completed">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Program Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Program Kerja</th>
                <th className="py-3 px-4">Divisi / Tim</th>
                <th className="py-3 px-4">PIC Utama</th>
                <th className="py-3 px-4">Target Waktu</th>
                <th className="py-3 px-4">Progress (%)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProkers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ditemukan program kerja yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredProkers.map((proker) => {
                  const prog = getProkerProgress(proker);
                  return (
                    <tr
                      key={proker.id}
                      onClick={() => onSelectProgram(proker.teamId, proker.id)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 text-xs">
                          {proker.title}
                        </div>
                        {proker.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{proker.description}</div>
                        )}
                        {proker.milestones && proker.milestones.length > 0 && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            {proker.milestones.filter(m => m.isCompleted).length} dari {proker.milestones.length} milestone tercapai
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-indigo-700 whitespace-nowrap">
                        {proker.teamShortName}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {proker.pic}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {proker.targetMonth || (proker.targetDate ? proker.targetDate.slice(5) : '-')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                prog === 100 ? 'bg-emerald-500' : prog >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                              }`}
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800 text-[11px]">{prog}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(proker.status, proker)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenAI(proker.teamName, proker.title);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Tanya Saran AI"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-indigo-600 group-hover:underline inline-flex items-center gap-0.5 text-xs">
                            Buka →
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
