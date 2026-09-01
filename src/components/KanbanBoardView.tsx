import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Filter,
  Layers,
  User,
  Plus
} from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerStatus } from '../types';
import confetti from 'canvas-confetti';

interface KanbanBoardViewProps {
  teams: TeamCategory[];
  onUpdateProkerStatus: (teamId: string, prokerId: string, newStatus: ProkerStatus) => void;
  onSelectTeam: (teamId: string) => void;
  onOpenAddProker: (defaultTeamId?: string) => void;
  onOpenAI: (teamName: string, prokerTitle?: string) => void;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  teams,
  onUpdateProkerStatus,
  onSelectTeam,
  onOpenAddProker,
  onOpenAI,
}) => {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');

  const columns: { status: ProkerStatus; title: string; color: string; headerBg: string }[] = [
    { status: 'Belum Dimulai', title: 'Belum Dimulai', color: 'border-slate-300', headerBg: 'bg-slate-100 text-slate-700' },
    { status: 'Dalam Perencanaan', title: 'Perencanaan (Empathize & Define)', color: 'border-amber-300', headerBg: 'bg-amber-50 text-amber-800' },
    { status: 'Sedang Berjalan', title: 'Pengerjaan (Ideate & Prototype)', color: 'border-blue-300', headerBg: 'bg-blue-50 text-blue-800' },
    { status: 'Tahap Review', title: 'Review & Uji (Test)', color: 'border-purple-300', headerBg: 'bg-purple-50 text-purple-800' },
    { status: 'Selesai', title: 'Selesai & Terdokumentasi', color: 'border-emerald-300', headerBg: 'bg-emerald-50 text-emerald-800' },
  ];

  // Flatten prokers
  const allProkers = teams.flatMap(t =>
    t.prokers.map(p => ({
      ...p,
      teamName: t.name,
      teamShortName: t.shortName,
      teamId: t.id,
      teamAccent: t.accentColor,
    }))
  );

  const filteredProkers = allProkers.filter(p => {
    if (selectedTeamFilter === 'all') return true;
    return p.teamId === selectedTeamFilter;
  });

  const handleMoveStatus = (teamId: string, prokerId: string, newStatus: ProkerStatus) => {
    onUpdateProkerStatus(teamId, prokerId, newStatus);
    if (newStatus === 'Selesai') {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
  };

  const getNextStatus = (current: ProkerStatus): ProkerStatus | null => {
    switch (current) {
      case 'Belum Dimulai': return 'Dalam Perencanaan';
      case 'Dalam Perencanaan': return 'Sedang Berjalan';
      case 'Sedang Berjalan': return 'Tahap Review';
      case 'Tahap Review': return 'Selesai';
      default: return null;
    }
  };

  const getPrevStatus = (current: ProkerStatus): ProkerStatus | null => {
    switch (current) {
      case 'Selesai': return 'Tahap Review';
      case 'Tahap Review': return 'Sedang Berjalan';
      case 'Sedang Berjalan': return 'Dalam Perencanaan';
      case 'Dalam Perencanaan': return 'Belum Dimulai';
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Board Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Visual Kanban Board — Design Thinking Workflow
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geser alur kerja dari tahap Empathize & Perencanaan hingga Prototype, Review, dan Selesai
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="all">Semua Tim ({teams.length} Divisi)</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenAddProker()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Proker
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const prokersInCol = filteredProkers.filter(p => {
            if (col.status === 'Belum Dimulai') {
              return p.status === 'Belum Dimulai' || p.status === 'Terkendala';
            }
            return p.status === col.status;
          });

          return (
            <div
              key={col.status}
              className="bg-slate-100/80 rounded-2xl border border-slate-200/80 p-3 space-y-3 min-h-[450px] flex flex-col"
            >
              {/* Column Header */}
              <div className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-between border ${col.headerBg}`}>
                <span>{col.title}</span>
                <span className="w-5 h-5 rounded-full bg-white/80 text-slate-900 flex items-center justify-center text-[11px] shadow-2xs">
                  {prokersInCol.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-0.5">
                {prokersInCol.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    Kosong
                  </div>
                ) : (
                  prokersInCol.map((proker) => {
                    const prev = getPrevStatus(proker.status);
                    const next = getNextStatus(proker.status);

                    return (
                      <div
                        key={proker.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm p-4 space-y-3 transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            {proker.teamShortName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {proker.targetMonth || '-'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs leading-snug">
                            {proker.title}
                          </h4>
                          {proker.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                              {proker.description}
                            </p>
                          )}
                        </div>

                        {/* PIC info */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-md">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="truncate font-medium">{proker.pic}</span>
                        </div>

                        {/* Quick Navigation Arrows */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          {prev ? (
                            <button
                              onClick={() => handleMoveStatus(proker.teamId, proker.id, prev)}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title={`Kembalikan ke: ${prev}`}
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : <div />}

                          <button
                            onClick={() => onOpenAI(proker.teamName, proker.title)}
                            className="p-1 rounded-md text-slate-400 hover:text-indigo-600"
                            title="Tanya AI"
                          >
                            <Sparkles className="w-3 h-3" />
                          </button>

                          {next ? (
                            <button
                              onClick={() => handleMoveStatus(proker.teamId, proker.id, next)}
                              className="p-1 rounded-md text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors font-bold"
                              title={`Majukan ke: ${next}`}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
