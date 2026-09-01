import React, { useState } from 'react';
import { 
  FolderOpen, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Edit3, 
  ChevronRight,
  Search,
  Check,
  Calendar,
  User,
  MessageSquareQuote,
  Layers,
  BookOpen,
  Calculator,
  Palette,
  HeartHandshake,
  GraduationCap,
  Building2,
  MoonStar,
  Users,
  Clock,
  Sparkles,
  PartyPopper,
  Radio,
  ArrowRight
} from 'lucide-react';
import { TeamCategory, ProgramKerja, UserRole } from '../types';
import { getProkerProgress, getTeamProgress, isProkerNeedsAttention } from '../utils/storage';

interface SimpleDashboardViewProps {
  teams: TeamCategory[];
  userRole: UserRole;
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onOpenUpdateProgress: (teamId: string, prokerId: string) => void;
  onOpenAddProker: (teamId?: string) => void;
  onOpenEditDrive: (team: TeamCategory) => void;
  onOpenMarkCompleted: (teamId: string, prokerId: string) => void;
  onToggleMilestone: (teamId: string, prokerId: string, milestoneId: string) => void;
  onResolveIssue: (teamId: string, prokerId: string) => void;
  onOpenAIChat: (context?: { teamName?: string; prokerTitle?: string }) => void;
}

export const SimpleDashboardView: React.FC<SimpleDashboardViewProps> = ({
  teams,
  userRole,
  onSelectProgram,
  onOpenUpdateProgress,
  onOpenAddProker,
  onOpenEditDrive,
  onOpenMarkCompleted,
  onToggleMilestone,
  onResolveIssue,
  onOpenAIChat,
}) => {
  // Navigation: 'overview' or specific team.id (e.g. 'literasi', 'numerasi', etc.)
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Status filter inside current view: 'all' | 'running' | 'attention' | 'completed'
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'attention' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Overall calculations
  const allProkersList: { proker: ProgramKerja; team: TeamCategory }[] = [];
  teams.forEach(t => {
    t.prokers.forEach(p => {
      allProkersList.push({ proker: p, team: t });
    });
  });

  const totalProkers = allProkersList.length;
  const completedProkers = allProkersList.filter(item => item.proker.status === 'Selesai').length;
  const attentionProkers = allProkersList.filter(item => isProkerNeedsAttention(item.proker));
  const runningProkers = allProkersList.filter(item => item.proker.status === 'Sedang Berjalan').length;
  
  const overallAvgProgress = totalProkers > 0
    ? Math.round(allProkersList.reduce((acc, item) => acc + getProkerProgress(item.proker), 0) / totalProkers)
    : 0;

  const getTeamIcon = (iconName: string) => {
    switch (iconName) {
      case 'MoonStar': return <MoonStar className="w-4 h-4" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Calculator': return <Calculator className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'PartyPopper': return <PartyPopper className="w-4 h-4" />;
      case 'Radio': return <Radio className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const selectedTeam = teams.find(t => t.id === activeTab);

  return (
    <div className="space-y-5 pb-16 max-w-7xl mx-auto">
      {/* 1. TOP MENU TABS (Horizontal, Compact, No endless scroll) */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Tab 1: Ringkasan Semua Tim */}
          <button
            onClick={() => {
              setActiveTab('overview');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📊 Ringkasan Semua Tim</span>
            {attentionProkers.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'overview' ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
              }`}>
                {attentionProkers.length} Perlu Aksi
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 shrink-0 mx-1" />

          {/* Teams Individual Tabs */}
          {teams.map(team => {
            const isActive = activeTab === team.id;
            const teamAttentionCount = team.prokers.filter(p => isProkerNeedsAttention(p)).length;
            const teamDoneCount = team.prokers.filter(p => p.status === 'Selesai').length;

            return (
              <button
                key={team.id}
                onClick={() => {
                  setActiveTab(team.id);
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-900 bg-slate-50 border border-slate-100'
                }`}
              >
                <span>{getTeamIcon(team.iconName)}</span>
                <span>{team.shortName || team.name}</span>
                
                {/* Team Status Badge */}
                {teamAttentionCount > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title={`${teamAttentionCount} program berkendala`} />
                ) : (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {teamDoneCount}/{team.prokers.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB VIEW: RINGKASAN SEMUA TIM (OVERVIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Program Kerja</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalProkers} <span className="text-xs font-normal text-slate-400">program</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">{teams.length} Divisi / Tim Design</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Program Selesai</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{completedProkers} <span className="text-xs font-normal text-emerald-600">tuntas</span></div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">{Math.round((completedProkers / (totalProkers || 1)) * 100)}% dari total target</div>
            </div>

            <div className={`rounded-2xl p-4 border shadow-2xs ${
              attentionProkers.length > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-white border-slate-200'
            }`}>
              <div className={`text-[11px] font-bold uppercase tracking-wider ${
                attentionProkers.length > 0 ? 'text-rose-700' : 'text-slate-400'
              }`}>
                Perlu Perhatian / Kendala
              </div>
              <div className="text-2xl font-black text-rose-700 mt-1">{attentionProkers.length} <span className="text-xs font-normal text-rose-500">butuh tindak lanjut</span></div>
              <div className="text-[11px] text-rose-600 mt-0.5">
                {attentionProkers.length > 0 ? 'Segera evaluasi & beri solusi' : 'Semua program berjalan lancar'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Rata-Rata Capaian</div>
              <div className="text-2xl font-black text-indigo-900 mt-1">{overallAvgProgress}%</div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${overallAvgProgress}%` }} />
              </div>
            </div>
          </div>

          {/* If no prokers exist yet */}
          {totalProkers === 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs text-center space-y-4 max-w-xl mx-auto my-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">Data Program Kerja Masih Kosong</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Semua data telah dikosongkan dan siap untuk diisi. Pilih tim di menu tab atas atau klik tombol di bawah untuk menambahkan program kerja baru.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => onOpenAddProker()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Program Kerja Pertama</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Alert: Programs Needing Attention */}
          {attentionProkers.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Daftar Program yang Mengalami Kendala ({attentionProkers.length})
                  </h3>
                </div>
                <span className="text-xs text-rose-600 font-semibold">Prioritas Tindak Lanjut</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {attentionProkers.map(({ proker, team }) => (
                  <div key={proker.id} className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100">
                          {team.shortName}
                        </span>
                        <h4 className="font-bold text-slate-900 mt-1">{proker.title}</h4>
                        <div className="text-slate-500 text-[11px]">PIC: {proker.pic}</div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab(team.id);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 font-bold rounded-lg border border-rose-200 transition-colors cursor-pointer shrink-0"
                      >
                        Lihat Tim →
                      </button>
                    </div>

                    {proker.issue && proker.issue.hasIssue && (
                      <div className="bg-white p-2.5 rounded-lg border border-rose-100 text-rose-900 font-medium">
                        <strong>Kendala:</strong> {proker.issue.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Directory of Teams (Grid with direct Google Drive buttons) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Direktori Tim & Google Drive</h3>
                <p className="text-xs text-slate-500">Pilih tim dari menu atas atau klik kartu di bawah untuk melihat program kerja & berkas.</p>
              </div>
              <button
                onClick={() => onOpenAddProker()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Program Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {teams.map(team => {
                const prog = getTeamProgress(team);
                const driveUrl = team.driveFolderUrl || `https://drive.google.com/drive/folders/team-${team.id}`;
                const doneCount = team.prokers.filter(p => p.status === 'Selesai').length;
                const hasIssue = team.prokers.some(p => isProkerNeedsAttention(p));

                return (
                  <div
                    key={team.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0">
                            {getTeamIcon(team.iconName)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{team.name}</h4>
                            <span className="text-[11px] text-slate-500">Koord: {team.coordinator || team.members[0]?.name || '-'}</span>
                          </div>
                        </div>

                        {hasIssue && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            Kendala
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Progres: {doneCount}/{team.prokers.length} selesai</span>
                          <span className="font-black text-slate-800">{prog}%</span>
                        </div>
                        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              prog === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <a
                        href={driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                        title="Buka folder Google Drive Tim"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>📁 Drive Tim</span>
                        <ExternalLink className="w-2.5 h-2.5 text-amber-600" />
                      </a>

                      <button
                        onClick={() => {
                          setActiveTab(team.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                      >
                        <span>Kelola Program</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB VIEW: INDIVIDUAL TEAM SCREEN (Compact & Focused) */}
      {/* ========================================================================= */}
      {selectedTeam && (
        <div className="space-y-4">
          {/* Team Header Panel */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  {getTeamIcon(selectedTeam.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {selectedTeam.name}
                    </h2>
                    <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      {selectedTeam.prokers.length} Program Kerja
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <strong>Koordinator:</strong> {selectedTeam.coordinator || selectedTeam.members[0]?.name || '-'} • <strong>Anggota:</strong> {selectedTeam.members.map(m => m.name).join(', ')}
                  </p>
                </div>
              </div>

              {/* Action Buttons for this Team */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Big Google Drive Link Button */}
                <a
                  href={selectedTeam.driveFolderUrl || `https://drive.google.com/drive/folders/team-${selectedTeam.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-extrabold transition-all shadow-2xs"
                  title="Buka folder Google Drive tim ini untuk melihat & upload berkas"
                >
                  <FolderOpen className="w-4 h-4 text-amber-600" />
                  <span>📁 Folder Google Drive Tim</span>
                  <ExternalLink className="w-3 h-3 text-amber-600 ml-0.5" />
                </a>

                {/* Edit Drive Link */}
                <button
                  onClick={() => onOpenEditDrive(selectedTeam)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Atur URL Google Drive Tim"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Add Proker */}
                <button
                  onClick={() => onOpenAddProker(selectedTeam.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Program</span>
                </button>
              </div>
            </div>

            {/* Sub Filter Chips & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Semua ({selectedTeam.prokers.length})
                </button>
                <button
                  onClick={() => setStatusFilter('running')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'running' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'
                  }`}
                >
                  Sedang Berjalan ({selectedTeam.prokers.filter(p => p.status === 'Sedang Berjalan').length})
                </button>
                <button
                  onClick={() => setStatusFilter('attention')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'attention' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-rose-50'
                  }`}
                >
                  Perlu Perhatian ({selectedTeam.prokers.filter(p => isProkerNeedsAttention(p)).length})
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  Selesai ({selectedTeam.prokers.filter(p => p.status === 'Selesai').length})
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari program di tim ini..."
                  className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-56"
                />
              </div>
            </div>
          </div>

          {/* Program Kerja List for this specific Team */}
          <div className="space-y-3">
            {selectedTeam.prokers
              .filter(p => {
                if (searchQuery) {
                  const q = searchQuery.toLowerCase();
                  if (!p.title.toLowerCase().includes(q) && !p.pic.toLowerCase().includes(q)) {
                    return false;
                  }
                }
                if (statusFilter === 'running') return p.status === 'Sedang Berjalan';
                if (statusFilter === 'attention') return isProkerNeedsAttention(p);
                if (statusFilter === 'completed') return p.status === 'Selesai';
                return true;
              })
              .map(proker => {
                const prog = getProkerProgress(proker);
                const hasAttention = isProkerNeedsAttention(proker);
                const milestones = proker.milestones || [];
                const evidences = proker.evidenceLinks || proker.evidences || [];

                return (
                  <div
                    key={proker.id}
                    className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-2xs ${
                      hasAttention
                        ? 'border-rose-200 bg-rose-50/20'
                        : proker.status === 'Selesai'
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : 'border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {/* Top Row: Title, PIC, Status, Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            {proker.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            proker.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : proker.status === 'Sedang Berjalan'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {proker.status}
                          </span>
                          {hasAttention && (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Perlu Perhatian
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            PIC: {proker.pic}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Target: {proker.targetMonth || proker.targetDate || '-'}
                          </span>
                          {proker.designPhase && (
                            <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded">
                              Fase: {proker.designPhase}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onOpenUpdateProgress(selectedTeam.id, proker.id)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Update catatan, kendala, atau link evidence"
                        >
                          📝 Update
                        </button>

                        {proker.status !== 'Selesai' && (
                          <button
                            onClick={() => onOpenMarkCompleted(selectedTeam.id, proker.id)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            title="Tandai program tuntas & isi refleksi"
                          >
                            ✓ Selesai
                          </button>
                        )}

                        <button
                          onClick={() => onSelectProgram(selectedTeam.id, proker.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                          title="Lihat detail lengkap & log aktivitas"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Interactive Milestone Checklist */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-700">
                          Checklist Milestone (Klik untuk mencentang):
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                prog === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-slate-900">{prog}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                        {milestones.map(m => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => onToggleMilestone(selectedTeam.id, proker.id, m.id)}
                            className={`flex items-start gap-2 p-2 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                              m.isCompleted
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-slate-50 hover:bg-indigo-50/40 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                              m.isCompleted ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                            }`}>
                              {m.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={`text-[11px] leading-tight ${m.isCompleted ? 'line-through text-emerald-700 opacity-90' : 'font-medium'}`}>
                              {m.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Issue Box (if any) */}
                    {proker.issue && proker.issue.hasIssue && (
                      <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-rose-800">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Kendala Lapangan:</span>
                          </div>
                          <button
                            onClick={() => onResolveIssue(selectedTeam.id, proker.id)}
                            className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            ✓ Selesaikan Kendala
                          </button>
                        </div>
                        <p className="text-rose-900 font-medium">{proker.issue.description}</p>
                      </div>
                    )}

                    {/* Linked Files / Evidence shortcut */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400">Berkas / Dokumen:</span>
                        {evidences.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">
                            Belum ada berkas ditautkan (unggah di Drive Tim)
                          </span>
                        ) : (
                          evidences.map((ev, idx) => (
                            <a
                              key={ev.id || idx}
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-semibold border border-indigo-100 transition-colors"
                            >
                              <FileText className="w-3 h-3 text-indigo-500" />
                              <span>{ev.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-indigo-400 ml-0.5" />
                            </a>
                          ))
                        )}
                      </div>

                      <a
                        href={selectedTeam.driveFolderUrl || `https://drive.google.com/drive/folders/team-${selectedTeam.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-amber-700 hover:text-amber-900 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Buka Drive Tim {selectedTeam.shortName}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}

            {selectedTeam.prokers.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Belum Ada Program Kerja di {selectedTeam.name}</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Mulai tambahkan rencana kegiatan atau target tim ini untuk tahun ajaran 2026/2027.
                  </p>
                </div>
                <button
                  onClick={() => onOpenAddProker(selectedTeam.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Program untuk {selectedTeam.shortName}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
