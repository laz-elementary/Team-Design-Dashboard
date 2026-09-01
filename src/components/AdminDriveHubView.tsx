import React, { useState } from 'react';
import { 
  FolderOpen, 
  ExternalLink, 
  Plus, 
  Link2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Edit3, 
  Layers, 
  Search, 
  Filter, 
  CheckSquare, 
  Upload, 
  ChevronRight,
  Shield,
  BookOpen,
  Calculator,
  Palette,
  HeartHandshake,
  GraduationCap,
  Building2,
  MoonStar
} from 'lucide-react';
import { TeamCategory, ProgramKerja } from '../types';
import { getProkerProgress, getTeamProgress, isProkerNeedsAttention } from '../utils/storage';

interface AdminDriveHubViewProps {
  teams: TeamCategory[];
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onOpenUpdateProgress: (teamId: string, prokerId: string) => void;
  onOpenAddProker: (teamId?: string) => void;
  onOpenEditDrive: (team: TeamCategory) => void;
  onOpenAssignTask?: (teamId: string, prokerId: string) => void;
  onOpenMarkCompleted?: (teamId: string, prokerId: string) => void;
  onToggleMilestone?: (teamId: string, prokerId: string, milestoneId: string) => void;
}

export const AdminDriveHubView: React.FC<AdminDriveHubViewProps> = ({
  teams,
  onSelectProgram,
  onOpenUpdateProgress,
  onOpenAddProker,
  onOpenEditDrive,
  onOpenAssignTask,
  onOpenMarkCompleted,
  onToggleMilestone,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTeams = selectedTeamId === 'all' 
    ? teams 
    : teams.filter(t => t.id === selectedTeamId);

  // All prokers across selected teams
  const allProkers: { proker: ProgramKerja; team: TeamCategory }[] = [];
  filteredTeams.forEach(t => {
    t.prokers.forEach(p => {
      const matchSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || 
        (statusFilter === 'attention' && isProkerNeedsAttention(p)) ||
        (statusFilter === 'running' && p.status === 'Sedang Berjalan') ||
        (statusFilter === 'completed' && p.status === 'Selesai');

      if (matchSearch && matchStatus) {
        allProkers.push({ proker: p, team: t });
      }
    });
  });

  // Calculate total linked evidence files
  const totalEvidences = teams.reduce((acc, t) => 
    acc + t.prokers.reduce((pAcc, p) => pAcc + (p.evidenceLinks?.length || 0) + (p.evidences?.length || 0), 0)
  , 0);

  const getTeamIcon = (iconName: string) => {
    switch (iconName) {
      case 'MoonStar': return <MoonStar className="w-4 h-4" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Calculator': return <Calculator className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Top Banner: Admin & Google Drive Hub */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-black text-2xl text-indigo-300 shrink-0">
              📁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Admin & Google Drive Hub
                </h1>
                <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-md">
                  Koordinator Tim & Input Data
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Guru mengunggah berkas/tugas langsung ke folder <strong>Google Drive masing-masing tim</strong>. Admin dapat mengatur link folder, menambah program kapan saja, memperbarui checklist milestone (progress terhitung otomatis), serta menautkan bukti kerja (*evidence*).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAddProker()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program Baru</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats for Admin */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Total Folder Tim</div>
            <div className="text-lg font-black text-white mt-0.5">{teams.length} Folder Drive</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Total Program Kerja</div>
            <div className="text-lg font-black text-indigo-300 mt-0.5">
              {teams.reduce((acc, t) => acc + t.prokers.length, 0)} Inisiatif
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Berkas Evidence Terhubung</div>
            <div className="text-lg font-black text-emerald-400 mt-0.5">{totalEvidences} Link Drive</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Kalkulasi Progress</div>
            <div className="text-lg font-black text-amber-300 mt-0.5">Otomatis / Task-Based</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Google Drive Folder Direktori Per Tim */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-600" />
              <span>Direktori Google Drive Folder Setiap Tim</span>
            </h2>
            <p className="text-xs text-slate-500">
              Klik "Buka Folder" untuk membuka Google Drive tim, atau "Atur Link" untuk memperbarui URL folder
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => {
            const prog = getTeamProgress(team);
            const driveUrl = team.driveFolderUrl || `https://drive.google.com/drive/folders/team-${team.id}`;
            const totalProkers = team.prokers.length;
            const evidenceCount = team.prokers.reduce((acc, p) => acc + (p.evidenceLinks?.length || 0) + (p.evidences?.length || 0), 0);

            return (
              <div 
                key={team.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        {getTeamIcon(team.iconName)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{team.name}</h3>
                        <p className="text-[11px] text-slate-400">{team.members.length} Anggota • {totalProkers} Program</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 shrink-0">
                      {prog}%
                    </span>
                  </div>

                  {/* Drive Folder Box */}
                  <div className="mt-3.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-600 flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                        <span>Folder Input Guru:</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-100">
                        {evidenceCount} File Terhubung
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-mono bg-white px-2 py-1 rounded border border-slate-200">
                      {driveUrl}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    <span>Buka Folder Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onOpenEditDrive(team)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    title="Atur / Ubah URL Google Drive Tim"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenAddProker(team.id)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    title="Tambah Program ke Tim Ini"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Fast Program Kerja & Task Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              <span>Manajemen Program Kerja & Update Task</span>
            </h2>
            <p className="text-xs text-slate-500">
              Centang milestone/task untuk memperbarui persentase progress secara otomatis tanpa input manual
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari program / PIC / tim..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Tim</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.shortName}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Status</option>
              <option value="running">Sedang Berjalan</option>
              <option value="attention">Perlu Perhatian</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
        </div>

        {/* Program Table with Inline Task Check & Drive Link Actions */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Program & Tim</th>
                <th className="py-3 px-4">PIC</th>
                <th className="py-3 px-4">Milestone Checklist (Progress Otomatis)</th>
                <th className="py-3 px-4">Evidence Drive</th>
                <th className="py-3 px-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProkers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Tidak ada program kerja yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                allProkers.map(({ proker, team }) => {
                  const prog = getProkerProgress(proker);
                  const completedM = (proker.milestones || []).filter(m => m.isCompleted).length;
                  const totalM = (proker.milestones || []).length;
                  const evidences = proker.evidenceLinks || proker.evidences || [];

                  return (
                    <tr key={proker.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="py-4 px-4 align-top">
                        <div className="font-extrabold text-slate-900 group-hover:text-indigo-600 text-sm">
                          {proker.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {team.shortName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Target: {proker.targetMonth || proker.targetDate || '-'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="font-bold text-slate-800">{proker.pic}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{proker.status}</div>
                      </td>

                      {/* Milestone checklist & progress bar */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    prog === 100 ? 'bg-emerald-500' : prog >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${prog}%` }}
                                />
                              </div>
                              <span className="font-extrabold text-slate-900 text-xs">{prog}%</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {completedM}/{totalM} Milestone Selesai
                            </span>
                          </div>

                          {/* Quick checklist pills */}
                          <div className="flex flex-wrap gap-1">
                            {(proker.milestones || []).slice(0, 3).map(m => (
                              <button
                                key={m.id}
                                onClick={() => onToggleMilestone && onToggleMilestone(team.id, proker.id, m.id)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                                  m.isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 line-through opacity-80'
                                    : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
                                }`}
                                title={m.isCompleted ? 'Klik untuk batalkan selesai' : 'Klik untuk tandai milestone selesai'}
                              >
                                <CheckCircle2 className={`w-3 h-3 ${m.isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <span className="truncate max-w-[120px]">{m.title}</span>
                              </button>
                            ))}
                            {(proker.milestones || []).length > 3 && (
                              <button
                                onClick={() => onSelectProgram(team.id, proker.id)}
                                className="text-[10px] font-bold text-indigo-600 px-1.5 py-1 hover:underline cursor-pointer"
                              >
                                +{(proker.milestones || []).length - 3} lainnya
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Evidence Link Section */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        {evidences.length === 0 ? (
                          <div className="text-[11px] text-slate-400 italic">
                            Belum ada link berkas
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {evidences.slice(0, 2).map((ev, idx) => (
                              <a
                                key={ev.id || idx}
                                href={ev.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 hover:underline bg-indigo-50/60 px-2 py-1 rounded-md border border-indigo-100 truncate max-w-[180px]"
                              >
                                <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                                <span className="truncate">{ev.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Fast Action Buttons */}
                      <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenUpdateProgress(team.id, proker.id)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Update Cepat & Tambah Link Evidence"
                          >
                            Update
                          </button>

                          {proker.status !== 'Selesai' && onOpenMarkCompleted && (
                            <button
                              onClick={() => onOpenMarkCompleted(team.id, proker.id)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                              title="Tandai Selesai & Kirim Refleksi"
                            >
                              Selesai
                            </button>
                          )}

                          <button
                            onClick={() => onSelectProgram(team.id, proker.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Lihat Detail Lengkap"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
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
