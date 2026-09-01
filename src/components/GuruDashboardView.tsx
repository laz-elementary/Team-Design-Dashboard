import React, { useState } from 'react';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Calendar, 
  Layers, 
  Check, 
  ChevronRight, 
  MessageSquare,
  Shield,
  CheckSquare,
  ListTodo,
  Bell,
  ArrowRight,
  UserCheck,
  Award,
  Filter,
  Eye
} from 'lucide-react';
import { TeamCategory, ProgramKerja, TaskSubItem } from '../types';
import { getProkerProgress, isProkerNeedsAttention, isNoUpdate7Days, isApproachingDeadline } from '../utils/storage';

interface GuruDashboardViewProps {
  teams: TeamCategory[];
  onSelectProgram: (teamId: string, prokerId: string) => void;
  onOpenUpdateProgress: (teamId: string, prokerId: string) => void;
  onOpenAddProker: (teamId: string) => void;
  onOpenAssignTask?: (teamId: string, prokerId: string) => void;
  onOpenMarkCompleted?: (teamId: string, prokerId: string) => void;
  onToggleSubTask?: (teamId: string, prokerId: string, taskId: string) => void;
  onToggleMilestone?: (teamId: string, prokerId: string, milestoneId: string) => void;
}

export const GuruDashboardView: React.FC<GuruDashboardViewProps> = ({
  teams,
  onSelectProgram,
  onOpenUpdateProgress,
  onOpenAddProker,
  onOpenAssignTask,
  onOpenMarkCompleted,
  onToggleSubTask,
  onToggleMilestone,
}) => {
  // Collect all unique PICs and members across all teams
  const allTeacherNames: string[] = Array.from(new Set<string>(
    teams.flatMap(t => t.prokers.map(p => p.pic).concat(t.members.map(m => m.name)))
  )).filter(Boolean).sort();

  const [selectedTeacher, setSelectedTeacher] = useState<string>(
    allTeacherNames.find(name => name.toLowerCase().includes('tika')) || allTeacherNames[0] || 'Tika Destita'
  );

  // Active view tab inside Guru portal
  const [guruTab, setGuruTab] = useState<'programs' | 'tasks' | 'activity'>('programs');

  // Currently expanded/selected inline program for quick detail
  const [selectedProkerId, setSelectedProkerId] = useState<string | null>(null);

  // Find the primary team for this teacher
  const myTeam = teams.find(t => 
    t.members.some(m => m.name.toLowerCase().includes(selectedTeacher.toLowerCase()) || selectedTeacher.toLowerCase().includes(m.name.toLowerCase()))
  ) || teams[0];

  // Programs in their team or where teacher is PIC / assigned
  const myTeamPrograms: { proker: ProgramKerja; team: TeamCategory; role: 'PIC' | 'Member' }[] = [];

  teams.forEach(team => {
    const isMemberOfThisTeam = team.members.some(m => 
      m.name.toLowerCase().includes(selectedTeacher.toLowerCase()) || selectedTeacher.toLowerCase().includes(m.name.toLowerCase())
    );

    team.prokers.forEach(proker => {
      const isPic = proker.pic.toLowerCase().includes(selectedTeacher.toLowerCase()) || selectedTeacher.toLowerCase().includes(proker.pic.toLowerCase());
      const hasAssignedTask = (proker.subTasks || []).some(t => 
        t.assignedTo.toLowerCase().includes(selectedTeacher.toLowerCase()) || selectedTeacher.toLowerCase().includes(t.assignedTo.toLowerCase())
      );

      if (isPic) {
        myTeamPrograms.push({ proker, team, role: 'PIC' });
      } else if (hasAssignedTask || isMemberOfThisTeam) {
        myTeamPrograms.push({ proker, team, role: 'Member' });
      }
    });
  });

  // Extract all specific tasks assigned directly to this teacher (Subtasks)
  const myDirectTasks: { task: TaskSubItem; proker: ProgramKerja; team: TeamCategory }[] = [];
  teams.forEach(team => {
    team.prokers.forEach(proker => {
      (proker.subTasks || []).forEach(task => {
        if (task.assignedTo.toLowerCase().includes(selectedTeacher.toLowerCase()) || 
            selectedTeacher.toLowerCase().includes(task.assignedTo.toLowerCase())) {
          myDirectTasks.push({ task, proker, team });
        }
      });
    });
  });

  // Proactive Reminders
  const noUpdatePrograms = myTeamPrograms.filter(({ proker }) => isNoUpdate7Days(proker));
  const deadlineApproachingPrograms = myTeamPrograms.filter(({ proker }) => isApproachingDeadline(proker));
  const activeIssues = myTeamPrograms.filter(({ proker }) => isProkerNeedsAttention(proker));

  // Determine the active inline detail proker
  const activeProkerEntry = myTeamPrograms.find(p => p.proker.id === selectedProkerId) || myTeamPrograms[0] || null;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Header & Persona Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-black text-xl text-indigo-300 shrink-0">
              {selectedTeacher.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-2.5 py-0.5 rounded-md">
                  Portal Guru • Tugas Saya
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-300">Tim: {myTeam.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white">
                Halo, {selectedTeacher}!
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Update progres mudah &lt; 1 menit. Centang milestone otomatis menghitung persentase tanpa beban administrasi.
              </p>
            </div>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 space-y-1 self-start lg:self-auto min-w-[240px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pilih Akun Guru / PIC:
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => {
                setSelectedTeacher(e.target.value);
                setSelectedProkerId(null);
              }}
              className="w-full bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {allTeacherNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Program Kerja
            </span>
            <span className="text-lg font-black text-white">{myTeamPrograms.length} Program</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Tugas Anggota (Subtasks)
            </span>
            <span className="text-lg font-black text-indigo-300">
              {myDirectTasks.filter(t => t.task.status === 'Done').length}/{myDirectTasks.length} Selesai
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Peran PIC
            </span>
            <span className="text-lg font-black text-emerald-400">
              {myTeamPrograms.filter(p => p.role === 'PIC').length} Program
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Perlu Perhatian
            </span>
            <span className={`text-lg font-black ${activeIssues.length > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {activeIssues.length} Kendala
            </span>
          </div>
        </div>
      </div>

      {/* PROACTIVE REMINDERS BANNER */}
      {(noUpdatePrograms.length > 0 || deadlineApproachingPrograms.length > 0 || activeIssues.length > 0) && (
        <div className="space-y-2.5">
          {noUpdatePrograms.map(({ proker, team }) => (
            <div 
              key={`no-up-${proker.id}`}
              className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-amber-900">
                    ⚠️ Pengingat: Program <strong>'{proker.title}'</strong> belum ada update selama {proker.daysSinceLastUpdate || 7} hari.
                  </div>
                  <div className="text-[11px] text-amber-700">
                    Cukup 1 menit untuk mencentang progres agar Kepala Sekolah mengetahui status terkini.
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenUpdateProgress(team.id, proker.id)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                + Update Sekarang (&lt; 1 min)
              </button>
            </div>
          ))}

          {deadlineApproachingPrograms.map(({ proker, team }) => (
            <div 
              key={`dl-${proker.id}`}
              className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-indigo-950">
                    ⏰ Mendekati Deadline: Target <strong>'{proker.title}'</strong> jatuh tempo ({proker.targetDate || proker.targetMonth}).
                  </div>
                  <div className="text-[11px] text-indigo-700">
                    {proker.nextAction ? `Next Action: ${proker.nextAction}` : 'Pastikan seluruh milestone sudah dipersiapkan.'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProkerId(proker.id);
                  onOpenUpdateProgress(team.id, proker.id);
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Cek Milestone
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setGuruTab('programs')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            guruTab === 'programs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Team – Program Kerja ({myTeamPrograms.length})</span>
        </button>

        <button
          onClick={() => setGuruTab('tasks')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            guruTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tugas Spesifik Saya ({myDirectTasks.length})</span>
        </button>
      </div>

      {/* TAB 1: MY TEAM & PROGRAMS (Main Table & Interactive Detail) */}
      {guruTab === 'programs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Programs Table / List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Daftar Program Kerja: {myTeam.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Klik baris program untuk melihat rincian milestone di sebelah kanan.
                  </p>
                </div>
                <button
                  onClick={() => onOpenAddProker(myTeam.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Proker</span>
                </button>
              </div>

              {/* Programs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Program</th>
                      <th className="py-3 px-3">Peran</th>
                      <th className="py-3 px-3">Deadline</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Progress</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myTeamPrograms.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Belum ada program terdaftar untuk tim ini.
                        </td>
                      </tr>
                    ) : (
                      myTeamPrograms.map(({ proker, team, role }) => {
                        const prog = getProkerProgress(proker);
                        const isSelected = activeProkerEntry?.proker.id === proker.id;
                        const hasIssue = isProkerNeedsAttention(proker);

                        return (
                          <tr
                            key={proker.id}
                            onClick={() => setSelectedProkerId(proker.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-indigo-50/70 font-semibold' 
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-slate-900 text-xs">
                                {proker.title}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span>PIC: {proker.pic}</span>
                                {proker.nextAction && (
                                  <>
                                    <span>•</span>
                                    <span className="text-amber-700 truncate max-w-[150px]">
                                      Next: {proker.nextAction}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                role === 'PIC'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {role}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap text-[11px]">
                              {proker.targetDate || proker.targetMonth || 'Ongoing'}
                            </td>

                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {hasIssue ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                                  🔴 Kendala
                                </span>
                              ) : (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  proker.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                                  proker.status === 'Sedang Berjalan' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {proker.status === 'Sedang Berjalan' ? '🟡 Berjalan' :
                                   proker.status === 'Selesai' ? '🟢 Selesai' :
                                   proker.status === 'Belum Dimulai' ? '⚪ Belum' : proker.status}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              <div className="font-extrabold text-slate-900 text-xs">{prog}%</div>
                              <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden ml-auto mt-1">
                                <div
                                  className={`h-full rounded-full ${
                                    prog === 100 ? 'bg-emerald-500' : prog >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${prog}%` }}
                                />
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onOpenUpdateProgress(team.id, proker.id)}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Update</span>
                              </button>
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

          {/* Right Column: Interactive Detail for Selected Program */}
          <div className="lg:col-span-5 space-y-4">
            {activeProkerEntry ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5 sticky top-20">
                {/* Detail Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {activeProkerEntry.team.shortName}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-500">
                        PIC: <strong className="text-slate-800">{activeProkerEntry.proker.pic}</strong>
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {activeProkerEntry.proker.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-black text-indigo-600">
                      {getProkerProgress(activeProkerEntry.proker)}%
                    </span>
                    <span className="block text-[10px] text-slate-400">Completion</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${getProkerProgress(activeProkerEntry.proker)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Deadline: {activeProkerEntry.proker.targetDate || activeProkerEntry.proker.targetMonth || 'Ongoing'}</span>
                    <span>Status: {activeProkerEntry.proker.status}</span>
                  </div>
                </div>

                {/* Milestones Checklist (Interactive directly on this page!) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Milestone Pekerjaan:
                    </h4>
                    <span className="text-[11px] text-indigo-600 font-semibold">
                      {activeProkerEntry.proker.milestones?.filter(m => m.isCompleted).length || 0} / {activeProkerEntry.proker.milestones?.length || 0} Selesai
                    </span>
                  </div>

                  {(!activeProkerEntry.proker.milestones || activeProkerEntry.proker.milestones.length === 0) ? (
                    <div className="p-3 text-slate-400 italic text-center bg-slate-50 rounded-xl text-xs">
                      Belum ada milestone tercatat.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {activeProkerEntry.proker.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => onToggleMilestone && onToggleMilestone(activeProkerEntry.team.id, activeProkerEntry.proker.id, m.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 text-xs ${
                            m.isCompleted 
                              ? 'bg-emerald-50/70 border-emerald-200' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                            m.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {m.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={`flex-1 font-semibold ${m.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {m.title}
                          </span>
                          {m.targetDate && (
                            <span className="text-[10px] text-slate-400">
                              {m.targetDate}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtasks assigned to members */}
                {activeProkerEntry.proker.subTasks && activeProkerEntry.proker.subTasks.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                        Tugas Anggota (Delegasi PIC):
                      </h4>
                    </div>
                    <div className="space-y-1.5">
                      {activeProkerEntry.proker.subTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => onToggleSubTask && onToggleSubTask(activeProkerEntry.team.id, activeProkerEntry.proker.id, t.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs cursor-pointer ${
                            t.status === 'Done' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                              t.status === 'Done' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 bg-white'
                            }`}>
                              {t.status === 'Done' && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <span className={`font-semibold ${t.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                {t.title}
                              </span>
                              <span className="block text-[10px] text-slate-500">
                                Ditugaskan ke: <strong>{t.assignedTo}</strong> • Due: {t.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Action Preview */}
                {activeProkerEntry.proker.nextAction && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-900 text-[11px] flex justify-between">
                      <span>Next Action:</span>
                      {activeProkerEntry.proker.nextActionDueDate && (
                        <span>Due: {activeProkerEntry.proker.nextActionDueDate}</span>
                      )}
                    </div>
                    <p className="text-slate-800 font-medium">{activeProkerEntry.proker.nextAction}</p>
                  </div>
                )}

                {/* Action Buttons for PIC / Member */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenUpdateProgress(activeProkerEntry.team.id, activeProkerEntry.proker.id)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-indigo-200 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>+ Update Progress (&lt; 1 min)</span>
                  </button>

                  {activeProkerEntry.role === 'PIC' && onOpenAssignTask && (
                    <button
                      onClick={() => onOpenAssignTask(activeProkerEntry.team.id, activeProkerEntry.proker.id)}
                      className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Beri tugas ke anggota"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Beri Tugas</span>
                    </button>
                  )}

                  {onOpenMarkCompleted && activeProkerEntry.proker.status !== 'Selesai' && (
                    <button
                      onClick={() => onOpenMarkCompleted(activeProkerEntry.team.id, activeProkerEntry.proker.id)}
                      className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Tandai Selesai & Refleksi"
                    >
                      <Award className="w-4 h-4" />
                      <span>Selesai</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                Pilih salah satu program di sebelah kiri untuk melihat detail milestone.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SPECIFIC MEMBER SUBTASKS */}
      {guruTab === 'tasks' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Daftar Tugas yang Ditugaskan Kepada {selectedTeacher} ({myDirectTasks.length})
              </h3>
              <p className="text-xs text-slate-500">
                Tugas spesifik dari PIC program. Cukup centang kotak untuk menandai tugas telah selesai dikerjakan.
              </p>
            </div>
          </div>

          {myDirectTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Tidak ada tugas anggota tertunda</h4>
              <p className="text-xs text-slate-500">Semua tugas didelegasikan sudah tuntas atau belum ada pembagian tugas baru.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myDirectTasks.map(({ task, proker, team }) => {
                const isDone = task.status === 'Done';
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleSubTask && onToggleSubTask(team.id, proker.id, task.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isDone 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center border transition-all ${
                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-1">
                        <div className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </div>
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            Program: {proker.title} ({team.shortName})
                          </span>
                          <span>•</span>
                          <span>Ditugaskan oleh: <strong>{task.assignedBy}</strong></span>
                          <span>•</span>
                          <span>Tenggat: <strong className="text-slate-800">{task.dueDate}</strong></span>
                        </div>
                        {task.notes && (
                          <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200 mt-1">
                            "{task.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                      isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isDone ? 'Selesai' : 'Perlu Dikerjakan'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

