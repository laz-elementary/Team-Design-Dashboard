import React, { useState } from 'react';
import { 
  Users, 
  ArrowLeft, 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  BookOpen,
  Calculator,
  Palette,
  HeartHandshake,
  GraduationCap,
  Building2,
  ShieldCheck,
  MoonStar,
  FolderOpen,
  Edit3
} from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerStatus } from '../types';
import { getProkerProgress, getTeamProgress, isProkerNeedsAttention } from '../utils/storage';

interface TeamsViewProps {
  teams: TeamCategory[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onOpenAddProker: (teamId: string) => void;
  onOpenAddMember: (teamId: string) => void;
  onOpenEditDrive?: (team: TeamCategory) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  onSelectProgram,
  onOpenAddProker,
  onOpenAddMember,
  onOpenEditDrive,
}) => {
  const currentTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const getTeamIcon = (iconName: string) => {
    switch (iconName) {
      case 'MoonStar': return <MoonStar className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

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
            🟢 Completed
          </span>
        );
      case 'Sedang Berjalan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            🟡 On Progress
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

  const teamLeader = currentTeam.members.find(m => m.role.toLowerCase().includes('ketua') || m.role.toLowerCase().includes('koordinator'))?.name || currentTeam.members[0]?.name;
  const memberNames = currentTeam.members.map(m => m.name.split(' ')[0]).join(', ');

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Top Team Navigation Pills */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {teams.map(t => {
          const isSelected = t.id === currentTeam.id;
          const prog = getTeamProgress(t);
          return (
            <button
              key={t.id}
              onClick={() => onSelectTeam(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{t.shortName}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {prog}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Team Header & Roster */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              {getTeamIcon(currentTeam.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentTeam.name.toUpperCase()}
                </h1>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {getTeamProgress(currentTeam)}% Complete
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentTeam.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={currentTeam.driveFolderUrl || `https://drive.google.com/drive/folders/team-${currentTeam.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors shadow-2xs"
              title="Buka Folder Google Drive Tim untuk melihat berkas & laporan"
            >
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span>Google Drive Tim</span>
              <ExternalLink className="w-3 h-3 text-amber-600 ml-0.5" />
            </a>

            {onOpenEditDrive && (
              <button
                onClick={() => onOpenEditDrive(currentTeam)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Atur URL Google Drive Tim"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onOpenAddProker(currentTeam.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program</span>
            </button>
            <button
              onClick={() => onOpenAddMember(currentTeam.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>+ Anggota</span>
            </button>
          </div>
        </div>

        {/* Team Leader & Members Bar (As requested by User) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Team Leader: </span>
              <span className="font-bold text-indigo-900">{teamLeader}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Members: </span>
              <span className="font-medium text-slate-700">{memberNames}</span>
            </div>
          </div>

          {currentTeam.designThinkingGoal && (
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <strong className="text-indigo-600">Design Thinking Goal:</strong> {currentTeam.designThinkingGoal}
            </div>
          )}
        </div>
      </div>

      {/* Program Kerja Table (Exact specification from User) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Program Kerja Tim {currentTeam.shortName}
            </h2>
            <p className="text-xs text-slate-500">Klik baris program untuk melihat milestone, issue, evidence, dan update</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">PIC</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Update</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentTeam.prokers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada program kerja di tim ini. Klik tombol "Tambah Program" di atas.
                  </td>
                </tr>
              ) : (
                currentTeam.prokers.map((proker) => {
                  const prog = getProkerProgress(proker);
                  return (
                    <tr
                      key={proker.id}
                      onClick={() => onSelectProgram(currentTeam.id, proker.id)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                        <div>{proker.title}</div>
                        {proker.description && (
                          <div className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {proker.description}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
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

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {proker.lastUpdatedAt || 'Hari ini'}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
                          Detail →
                        </span>
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
