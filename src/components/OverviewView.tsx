import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Calculator,
  Palette,
  HeartHandshake,
  GraduationCap,
  Building2,
  Layers,
  ShieldCheck,
  MoonStar,
  Check,
  Plus,
  Send,
  UserCheck
} from 'lucide-react';
import { TeamCategory, ProgramKerja, DashboardStats, RecentActivity } from '../types';
import { getProkerProgress, getTeamProgress, isProkerNeedsAttention } from '../utils/storage';

interface OverviewViewProps {
  teams: TeamCategory[];
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  onSelectTeam: (teamId: string) => void;
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onOpenAddProker: (defaultTeamId?: string) => void;
  onOpenAttentionTab: () => void;
  onResolveIssue: (teamId: string, prokerId: string) => void;
  onAddPrincipalComment: (teamId: string, prokerId: string, comment: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  teams,
  stats,
  recentActivities,
  onSelectTeam,
  onSelectProgram,
  onOpenAddProker,
  onOpenAttentionTab,
  onResolveIssue,
  onAddPrincipalComment,
}) => {
  const [commentingProkerId, setCommentingProkerId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

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

  // Compile all prokers with needs attention
  const attentionProkers: { proker: ProgramKerja; team: TeamCategory }[] = [];
  teams.forEach(t => {
    t.prokers.forEach(p => {
      if (isProkerNeedsAttention(p)) {
        attentionProkers.push({ proker: p, team: t });
      }
    });
  });

  // Compile upcoming deadlines (Sorted by date or nearest)
  const upcomingProkers: { proker: ProgramKerja; team: TeamCategory; formattedDate: string }[] = [
    {
      proker: teams.find(t => t.id === 'numerasi')?.prokers.find(p => p.id === 'num-p-1') || teams[0].prokers[0],
      team: teams.find(t => t.id === 'numerasi') || teams[0],
      formattedDate: '2 Sep',
    },
    {
      proker: teams.find(t => t.id === 'special_task')?.prokers.find(p => p.id === 'stk-p-1') || teams[0].prokers[0],
      team: teams.find(t => t.id === 'special_task') || teams[0],
      formattedDate: '4 Sep',
    },
    {
      proker: teams.find(t => t.id === 'literasi')?.prokers.find(p => p.id === 'lit-p-6') || teams[0].prokers[0],
      team: teams.find(t => t.id === 'literasi') || teams[0],
      formattedDate: '6 Sep',
    },
    {
      proker: teams.find(t => t.id === 'yearly_event')?.prokers.find(p => p.id === 'ye-p-2') || teams[0].prokers[0],
      team: teams.find(t => t.id === 'yearly_event') || teams[0],
      formattedDate: '8 Sep',
    },
    {
      proker: teams.find(t => t.id === 'yearly_event')?.prokers.find(p => p.id === 'ye-p-1') || teams[0].prokers[0],
      team: teams.find(t => t.id === 'yearly_event') || teams[0],
      formattedDate: '10 Sep',
    },
  ].filter(item => item.proker !== undefined);

  const handleSendComment = (teamId: string, prokerId: string) => {
    if (!commentText.trim()) return;
    onAddPrincipalComment(teamId, prokerId, commentText.trim());
    setCommentText('');
    setCommentingProkerId(null);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Executive Dashboard
            </span>
            <span className="text-xs font-semibold text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Academic Year 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            TEAM DESIGN MONITORING
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dashboard monitoring terpusat untuk Kepala Sekolah & Koordinator. Pantau progres, kendala, dan tindak lanjut program sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onOpenAddProker()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
          </button>
        </div>
      </div>

      {/* 2. Overall Progress Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Overall Progress Program Kerja
            </h2>
            <p className="text-xs text-slate-500">Total akumulasi pencapaian seluruh milestone program kerja lintas tim</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-medium text-slate-500">Overall Completion:</span>
            <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
              {stats.overallCompletionRate}%
            </span>
          </div>
        </div>

        {/* Progress Visual Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 flex">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs" 
              style={{ width: `${stats.overallCompletionRate}%` }}
              title={`Selesai: ${stats.overallCompletionRate}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 5 Status Metric Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Program</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalProker}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stats.totalTeams} divisi aktif</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Selesai
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{stats.completedProker}</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Refleksi siap direview</div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              Berjalan
            </div>
            <div className="text-2xl font-black text-blue-700 mt-1">{stats.inProgressProker}</div>
            <div className="text-[10px] text-blue-600 mt-0.5">On-track & in-review</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              Belum Mulai
            </div>
            <div className="text-2xl font-black text-slate-700 mt-1">{stats.notStartedProker}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Tahap perencanaan</div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 shadow-xs">
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse inline-block" />
              🔴 Perlu Perhatian
            </div>
            <div className="text-2xl font-black text-rose-700 mt-1">{stats.needsAttentionProker}</div>
            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Memerlukan bantuan</div>
          </div>
        </div>
      </div>

      {/* 3. 🔴 NEEDS ATTENTION (Top Priority Section for Principal) */}
      <div className="bg-rose-50/50 rounded-2xl p-5 sm:p-6 border border-rose-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              🔴
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                Needs Attention ({attentionProkers.length})
              </h2>
              <p className="text-xs text-slate-600">
                Program yang mengalami kendala, belum ada update berkala, atau membutuhkan keputusan pimpinan
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAttentionTab}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-white px-3 py-1.5 rounded-lg border border-rose-200 shadow-2xs hover:bg-rose-50 transition-colors inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Buka Detail Kendala</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table of Needs Attention */}
        <div className="overflow-x-auto bg-white rounded-xl border border-rose-200 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-rose-50/80 border-b border-rose-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Program Kerja</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">PIC</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Kendala / Issue</th>
                <th className="py-3 px-4 text-right">Aksi Pimpinan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attentionProkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    🎉 Luar biasa! Tidak ada program yang terkendala saat ini.
                  </td>
                </tr>
              ) : (
                attentionProkers.map(({ proker, team }) => (
                  <React.Fragment key={proker.id}>
                    <tr className="hover:bg-rose-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectProgram(team.id, proker.id)}
                          className="font-bold text-slate-900 hover:text-indigo-600 text-left block text-xs"
                        >
                          {proker.title}
                        </button>
                        {proker.targetMonth && (
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{proker.targetMonth}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {team.shortName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800">{proker.pic}</span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-rose-700 whitespace-nowrap">
                        {proker.targetDate ? proker.targetDate.slice(5) : (proker.nextActionDueDate || '-')}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {proker.issue?.category && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-sm">
                                {proker.issue.category}
                              </span>
                            )}
                            <span className="text-slate-800 font-medium text-[11px] line-clamp-1">
                              {proker.issue?.description || 'Memerlukan tindak lanjut koordinasi tim'}
                            </span>
                          </div>
                          {proker.issue?.principalComment && (
                            <div className="text-[10px] text-indigo-700 bg-indigo-50/70 p-1.5 rounded-md border border-indigo-100 flex items-start gap-1">
                              <MessageSquare className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
                              <span className="italic line-clamp-1">
                                <strong>Kepsek:</strong> {proker.issue.principalComment}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setCommentingProkerId(commentingProkerId === proker.id ? null : proker.id)}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-[11px] font-bold border border-indigo-200 transition-colors cursor-pointer"
                          >
                            💬 Comment
                          </button>
                          <button
                            onClick={() => onResolveIssue(team.id, proker.id)}
                            className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            ✅ Resolve
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline Comment Box */}
                    {commentingProkerId === proker.id && (
                      <tr className="bg-indigo-50/60">
                        <td colSpan={6} className="p-3">
                          <div className="flex items-center gap-2 max-w-2xl">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder={`Tulis arahan/solusi Kepala Sekolah untuk ${proker.pic}...`}
                              className="flex-1 text-xs bg-white border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendComment(team.id, proker.id);
                              }}
                            />
                            <button
                              onClick={() => handleSendComment(team.id, proker.id)}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              Kirim
                            </button>
                            <button
                              onClick={() => setCommentingProkerId(null)}
                              className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Progress per Team Section (Clean Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Progress per Team
            </h2>
            <p className="text-xs text-slate-500">Pantau warna dan persentase capaian per divisi secara ringkas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const teamProg = getTeamProgress(team);
            const selesaiCount = team.prokers.filter(p => p.status === 'Selesai').length;
            const berjalanCount = team.prokers.filter(p => p.status === 'Sedang Berjalan' || p.status === 'Tahap Review').length;
            const attentionCount = team.prokers.filter(p => isProkerNeedsAttention(p)).length;

            return (
              <div
                key={team.id}
                onClick={() => onSelectTeam(team.id)}
                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        {getTeamIcon(team.iconName)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                          {team.name}
                        </h3>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {team.members.length} Anggota • Leader: {team.members[0]?.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">{teamProg}%</span>
                      <span className="text-[10px] text-slate-400 block">Complete</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        teamProg >= 80 ? 'bg-emerald-500' : teamProg >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${teamProg}%` }}
                    />
                  </div>

                  {/* Program Breakdown Count */}
                  <div className="mt-4 bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-700 text-[11px] mb-1">
                      {team.prokers.length} Program Kerja:
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {selesaiCount > 0 && (
                        <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          ✅ {selesaiCount} selesai
                        </span>
                      )}
                      {berjalanCount > 0 && (
                        <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          🟡 {berjalanCount} berjalan
                        </span>
                      )}
                      {attentionCount > 0 && (
                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          🔴 {attentionCount} perlu perhatian
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={team.driveFolderUrl || `https://drive.google.com/drive/folders/team-${team.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-200 transition-colors"
                    title="Buka Folder Google Drive Tim"
                  >
                    <span>📁 Drive Tim</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  <span className="font-bold text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Detail Tim →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom 2-Column: Upcoming Deadlines & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upcoming Deadlines (7 Hari ke Depan) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Upcoming Deadlines (7 Hari ke Depan)
                </h3>
                <p className="text-xs text-slate-400">Agenda dan target kegiatan yang segera berlangsung</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {upcomingProkers.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectProgram(item.team.id, item.proker.id)}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-xs font-black text-indigo-600 leading-none">{item.formattedDate.split(' ')[0]}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mt-0.5">{item.formattedDate.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs hover:text-indigo-600 transition-colors">
                      {item.proker.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.team.shortName} • PIC: <span className="text-slate-700 font-medium">{item.proker.pic}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.proker.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.proker.status === 'Terkendala' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.proker.status}
                  </span>
                  <div className="text-[10px] font-semibold text-slate-400 mt-1">
                    {getProkerProgress(item.proker)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Updates Feed (Tanpa harus tanya di WhatsApp) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Recent Updates
                </h3>
                <p className="text-xs text-slate-400">Aktivitas & log pekerjaan terbaru seluruh tim</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                onClick={() => onSelectProgram(act.teamId, act.prokerId)}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-sm">
                      {act.dateStr} — {act.prokerTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">{act.teamName}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                    {act.actionText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
