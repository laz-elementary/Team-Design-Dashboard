import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  Sparkles, 
  Plus, 
  Star, 
  MessageSquare, 
  Paperclip, 
  CheckSquare, 
  Square, 
  Calendar, 
  Lightbulb, 
  ExternalLink,
  Trash2,
  Edit2,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { TeamCategory, ProgramKerja, TeamMember, TeamReflection, ProkerStatus, DesignThinkingPhase } from '../types';
import confetti from 'canvas-confetti';

interface TeamDetailViewProps {
  team: TeamCategory;
  onUpdateProkerStatus: (teamId: string, prokerId: string, newStatus: ProkerStatus) => void;
  onToggleSubtask: (teamId: string, prokerId: string, subtaskId: string) => void;
  onDeleteProker: (teamId: string, prokerId: string) => void;
  onOpenAddProker: (teamId: string) => void;
  onOpenAddReflection: (teamId: string, prokerId?: string, prokerTitle?: string) => void;
  onOpenAddMember: (teamId: string) => void;
  onOpenAI: (teamName: string, prokerTitle?: string) => void;
  onBackToOverview: () => void;
}

export const TeamDetailView: React.FC<TeamDetailViewProps> = ({
  team,
  onUpdateProkerStatus,
  onToggleSubtask,
  onDeleteProker,
  onOpenAddProker,
  onOpenAddReflection,
  onOpenAddMember,
  onOpenAI,
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<'proker' | 'refleksi' | 'anggota' | 'assets'>('proker');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const completedCount = team.prokers.filter(p => p.status === 'Selesai').length;
  const progressPercent = team.prokers.length > 0 ? Math.round((completedCount / team.prokers.length) * 100) : 0;

  const handleStatusChange = (prokerId: string, newStatus: ProkerStatus) => {
    onUpdateProkerStatus(team.id, prokerId, newStatus);
    if (newStatus === 'Selesai') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (e) {
        // ignore confetti errors
      }
    }
  };

  const filteredProkers = team.prokers.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={onBackToOverview} className="hover:text-indigo-600 cursor-pointer">
          Dashboard Utama
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900">{team.name}</span>
      </div>

      {/* Team Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60 uppercase tracking-wider">
                {team.shortName}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                {team.members.length} Anggota Terdaftar
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60">
                {completedCount} dari {team.prokers.length} Selesai ({progressPercent}%)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {team.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {team.description}
            </p>

            {team.designThinkingGoal && (
              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong className="font-semibold">Misi Design Thinking: </strong>
                  {team.designThinkingGoal}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions & Progress */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <button
              onClick={() => onOpenAI(team.name)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-700 hover:to-indigo-700 shadow-sm transition-all cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Asisten Tim {team.shortName}</span>
            </button>

            <button
              onClick={() => onOpenAddProker(team.id)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program Kerja</span>
            </button>

            <button
              onClick={() => onOpenAddReflection(team.id)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>Tulis Refleksi Baru</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('proker')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'proker'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Program Kerja & Tanggung Jawab ({team.prokers.length})
          </button>

          <button
            onClick={() => setActiveTab('refleksi')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'refleksi'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Refleksi & Evaluasi ({team.reflections.length})
          </button>

          <button
            onClick={() => setActiveTab('anggota')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'anggota'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Keterangan Anggota & PIC ({team.members.length})
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'assets'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            Deliverables & Asset Hub
          </button>
        </div>
      </div>

      {/* TAB 1: PROGRAM KERJA */}
      {activeTab === 'proker' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
              {['all', 'Sedang Berjalan', 'Dalam Perencanaan', 'Tahap Review', 'Selesai', 'Belum Dimulai'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterStatus === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st}
                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenAddProker(team.id)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              + Tambah Program Kerja Baru
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredProkers.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-400">
                Belum ada program kerja dalam kategori filter ini.
              </div>
            ) : (
              filteredProkers.map((proker) => {
                const completedSubtasks = proker.subTasks.filter(st => st.isCompleted).length;
                const subtaskProgress = proker.subTasks.length > 0 ? Math.round((completedSubtasks / proker.subTasks.length) * 100) : 0;

                return (
                  <div
                    key={proker.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">
                            {proker.title}
                          </h3>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Fase: {proker.designPhase}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Prioritas: {proker.priority}
                          </span>
                        </div>

                        {proker.description && (
                          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                            {proker.description}
                          </p>
                        )}
                      </div>

                      {/* Status Selector & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={proker.status}
                          onChange={(e) => handleStatusChange(proker.id, e.target.value as ProkerStatus)}
                          className="text-xs font-bold rounded-lg px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="Belum Dimulai">Belum Dimulai</option>
                          <option value="Dalam Perencanaan">Dalam Perencanaan</option>
                          <option value="Sedang Berjalan">Sedang Berjalan</option>
                          <option value="Tahap Review">Tahap Review</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Terkendala">Terkendala</option>
                        </select>

                        <button
                          onClick={() => onOpenAI(team.name, proker.title)}
                          className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                          title="Konsultasi AI Design Thinking untuk Proker ini"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenAddReflection(team.id, proker.id, proker.title)}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                          title="Tulis Refleksi Proker Ini"
                        >
                          <Star className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteProker(team.id, proker.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Proker"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Strip: PIC, Target Month, Deliverables */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 font-medium">Penanggung Jawab (PIC): </span>
                        <strong className="text-slate-800 font-semibold">{proker.pic}</strong>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium">Target Waktu: </span>
                        <strong className="text-indigo-700 font-semibold">{proker.targetMonth || '-'}</strong>
                      </div>
                    </div>

                    {/* Deliverables / Desain Kebutuhan */}
                    {proker.deliverables && proker.deliverables.length > 0 && (
                      <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Kebutuhan Desain / Deliverables:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {proker.deliverables.map((item, idx) => (
                            <span key={idx} className="text-xs bg-white text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                              🎨 {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subtasks Checklist */}
                    {proker.subTasks && proker.subTasks.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">
                            Checklist Tahapan Design Thinking & Sub-Tugas ({completedSubtasks}/{proker.subTasks.length})
                          </span>
                          <span className="text-slate-400 font-semibold">{subtaskProgress}%</span>
                        </div>

                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${subtaskProgress}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {proker.subTasks.map((st) => (
                            <div
                              key={st.id}
                              onClick={() => onToggleSubtask(team.id, proker.id, st.id)}
                              className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                st.isCompleted
                                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-500 line-through'
                                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              {st.isCompleted ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              )}
                              <span>{st.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REFLEKSI & EVALUASI */}
      {activeTab === 'refleksi' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Jurnal Refleksi & Evaluasi Berkala</h2>
              <p className="text-xs text-slate-500">Mencatat pembelajaran, tantangan di lapangan, dan ide perbaikan berikutnya</p>
            </div>

            <button
              onClick={() => onOpenAddReflection(team.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tulis Refleksi Baru
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {team.reflections.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                <p>Belum ada catatan refleksi untuk tim ini.</p>
                <button
                  onClick={() => onOpenAddReflection(team.id)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  + Mulai Tulis Refleksi Pertama
                </button>
              </div>
            ) : (
              team.reflections.map((ref) => (
                <div key={ref.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">
                          {ref.prokerTitle || 'Evaluasi Program Kerja'}
                        </h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {ref.period}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ditulis oleh <strong className="text-slate-700">{ref.author}</strong> pada {ref.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-800">{ref.rating}.0 / 5.0</span>
                    </div>
                  </div>

                  {/* 3 Pillars of Reflection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Apa yang Berhasil?
                      </div>
                      <p className="text-slate-700 leading-relaxed">{ref.whatWentWell}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/80 space-y-1">
                      <div className="font-bold text-rose-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Kendala & Tantangan
                      </div>
                      <p className="text-slate-700 leading-relaxed">{ref.challenges}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200/80 space-y-1">
                      <div className="font-bold text-indigo-800 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Rencana Perbaikan
                      </div>
                      <p className="text-slate-700 leading-relaxed">{ref.improvements}</p>
                    </div>
                  </div>

                  {ref.stakeholderFeedback && (
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-600">
                      <strong className="text-slate-800">Feedback Pengguna / Kepala Sekolah: </strong>
                      <span className="italic">"{ref.stakeholderFeedback}"</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onOpenAI(team.name, ref.prokerTitle || 'Refleksi Kegiatan')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Analisis Refleksi Ini dengan AI
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANGGOTA & PIC */}
      {activeTab === 'anggota' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Daftar Anggota & Matriks Tanggung Jawab</h2>
              <p className="text-xs text-slate-500">Anggota tim dari dokumen resmi Team Design TA 2025/2026</p>
            </div>

            <button
              onClick={() => onOpenAddMember(team.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Anggota
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.members.map((member) => {
              // Calculate how many prokers this member is assigned to as PIC
              const assignedProkers = team.prokers.filter(p => 
                p.pic.toLowerCase().includes(member.name.toLowerCase()) ||
                member.name.toLowerCase().includes(p.pic.toLowerCase())
              );

              return (
                <div
                  key={member.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{member.name}</h4>
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {member.specialty && (
                      <p className="text-xs text-slate-500 pt-1">
                        <span className="font-medium text-slate-700">Keahlian/Fokus: </span>
                        {member.specialty}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs">
                    <div className="text-slate-500 mb-1.5 font-medium">
                      Tanggung Jawab PIC ({assignedProkers.length}):
                    </div>
                    {assignedProkers.length === 0 ? (
                      <span className="text-slate-400 italic">Kontributor umum dalam tim</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {assignedProkers.map(p => (
                          <span key={p.id} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            {p.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: DELIVERABLES & ASSET HUB */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-indigo-600" />
              Pusat Tautan & Desain Deliverables Tim {team.shortName}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Arsip cepat link folder Google Drive, template Canva, Figma board, dan media sosial resmi untuk tim {team.name}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Folder Google Drive {team.shortName}</h4>
                  <p className="text-[11px] text-slate-400">Arsip foto, banner cetak & dokumen</p>
                </div>
                <button
                  onClick={() => alert(`Membuka folder arsip tim ${team.shortName}`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Drive
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Workspace Canva / Template Visual</h4>
                  <p className="text-[11px] text-slate-400">Template poster & presentasi terstandar</p>
                </div>
                <button
                  onClick={() => alert(`Membuka Canva workspace tim ${team.shortName}`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Canva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
