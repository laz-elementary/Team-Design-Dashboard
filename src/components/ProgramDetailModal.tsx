import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  User, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  MessageSquare,
  Send,
  Edit3,
  Check,
  Flag,
  FileText,
  ThumbsUp,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Award,
  History,
  CheckSquare
} from 'lucide-react';
import { TeamCategory, ProgramKerja, MilestoneItem } from '../types';
import { getProkerProgress, isProkerNeedsAttention } from '../utils/storage';

interface ProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamCategory | null;
  proker: ProgramKerja | null;
  onToggleMilestone: (teamId: string, prokerId: string, milestoneId: string) => void;
  onToggleSubTask?: (teamId: string, prokerId: string, taskId: string) => void;
  onOpenUpdateProgress: (teamId: string, prokerId: string) => void;
  onOpenAssignTask?: (teamId: string, prokerId: string) => void;
  onOpenMarkCompleted?: (teamId: string, prokerId: string) => void;
  onResolveIssue: (teamId: string, prokerId: string) => void;
  onAddPrincipalComment: (teamId: string, prokerId: string, comment: string) => void;
  onOpenAI: (teamName?: string, prokerTitle?: string) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  isOpen,
  onClose,
  team,
  proker,
  onToggleMilestone,
  onToggleSubTask,
  onOpenUpdateProgress,
  onOpenAssignTask,
  onOpenMarkCompleted,
  onResolveIssue,
  onAddPrincipalComment,
  onOpenAI,
}) => {
  if (!isOpen || !team || !proker) return null;

  const [commentText, setCommentText] = useState<string>('');
  const progressPercent = getProkerProgress(proker);
  const hasIssue = isProkerNeedsAttention(proker);

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    onAddPrincipalComment(team.id, proker.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                Team: {team.name}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-200/80 px-2.5 py-0.5 rounded-md">
                PIC: {proker.pic}
              </span>
              {hasIssue && (
                <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200 animate-pulse">
                  🔴 Perlu Perhatian
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {proker.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAI(team.name, `${proker.title}: ${proker.description}`)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-100"
              title="Konsultasikan dengan AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Status & Progress Ribbon */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Status Saat Ini:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                  proker.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  proker.status === 'Terkendala' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {proker.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Progress:</span>
                <span className="text-base font-black text-indigo-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  progressPercent === 100 ? 'bg-emerald-500' : progressPercent >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Timeline: <strong>{proker.targetDate || proker.targetMonth || 'Sepanjang Semester'}</strong></span>
              </div>
              <div>
                <span>Phase: <strong>{proker.designPhase}</strong></span>
              </div>
            </div>
          </div>

          {/* Objective / Description */}
          {proker.description && (
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                Deskripsi & Sasaran Program
              </h3>
              <p className="text-slate-700 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-medium">
                {proker.description}
              </p>
            </div>
          )}

          {/* Milestones Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                Milestones & Checklist Pekerjaan ({proker.milestones?.filter(m => m.isCompleted).length || 0}/{proker.milestones?.length || 0})
              </h3>
              <span className="text-[11px] text-slate-400">Klik checkbox untuk centang selesai</span>
            </div>

            <div className="space-y-2">
              {(!proker.milestones || proker.milestones.length === 0) ? (
                <div className="p-3 text-center text-slate-400 bg-slate-50 rounded-xl">
                  Belum ada sub-milestone untuk program ini.
                </div>
              ) : (
                proker.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onToggleMilestone(team.id, proker.id, m.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      m.isCompleted 
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-700' 
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        m.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {m.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className={`font-semibold text-xs ${m.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {m.title}
                        </span>
                        {m.completedAt && (
                          <span className="text-[10px] text-emerald-600 block">Selesai: {m.completedAt}</span>
                        )}
                      </div>
                    </div>

                    {m.targetDate && (
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        Target: {m.targetDate}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subtasks (Delegasi Anggota) */}
          {proker.subTasks && proker.subTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                  Tugas Anggota Tim (Subtasks)
                </h3>
                {onOpenAssignTask && (
                  <button
                    onClick={() => onOpenAssignTask(team.id, proker.id)}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    + Tambah Tugas
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {proker.subTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onToggleSubTask && onToggleSubTask(team.id, proker.id, t.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      t.status === 'Done' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border ${
                        t.status === 'Done' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 bg-white'
                      }`}>
                        {t.status === 'Done' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className={`font-semibold text-xs ${t.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {t.title}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          Ditugaskan ke: <strong>{t.assignedTo}</strong> • Deadline: {t.dueDate}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      t.status === 'Done' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kendala / Issues Section */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            hasIssue ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${hasIssue ? 'text-rose-600' : 'text-slate-400'}`} />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Kendala & Hambatan Lapangan
                </h3>
              </div>

              {hasIssue && (
                <button
                  onClick={() => onResolveIssue(team.id, proker.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  ✅ Tandai Selesai (Resolve)
                </button>
              )}
            </div>

            {hasIssue ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                    Kategori: {proker.issue?.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-rose-200">
                  {proker.issue?.description}
                </p>

                {/* Principal comment */}
                {proker.issue?.principalComment && (
                  <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs">
                    <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      Arahan Kepala Sekolah:
                    </div>
                    <p className="text-slate-800 italic">"{proker.issue.principalComment}"</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Tidak ada kendala aktif pada program ini.
              </p>
            )}

            {/* Principal Instruction Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis arahan / catatan Kepala Sekolah untuk program ini..."
                className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendComment();
                }}
              />
              <button
                onClick={handleSendComment}
                className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </div>
          </div>

          {/* Next Action & Due Date */}
          {proker.nextAction && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Rencana Tindak Lanjut Berikutnya (Next Action):</span>
                {proker.nextActionDueDate && <span>Batas Waktu: {proker.nextActionDueDate}</span>}
              </div>
              <p className="text-xs font-medium text-slate-800 leading-relaxed">
                {proker.nextAction}
              </p>
            </div>
          )}

          {/* Evidence / Documentation Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                Dokumentasi & Evidence (Google Drive Tim)
              </h3>
              <a
                href={team.driveFolderUrl || `https://drive.google.com/drive/folders/team-${team.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
              >
                <span>📁 Buka Folder Drive Tim {team.shortName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(!proker.evidenceLinks && (!proker.evidences || proker.evidences.length === 0)) ? (
                <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 w-full">
                  Belum ada link spesifik yang ditautkan. Guru mengunggah berkas ke Google Drive Tim di atas, lalu Admin/PIC dapat menautkan link berkasnya melalui tombol Update di bawah.
                </div>
              ) : (
                (proker.evidenceLinks || proker.evidences || []).map((ev, idx) => (
                  <a
                    key={idx}
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-indigo-700 rounded-xl border border-slate-200 font-bold text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{ev.title}</span>
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Reflection if completed */}
          {proker.reflection && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Refleksi Pasca Program</span>
              </h3>
              <div className="space-y-1.5 text-xs text-slate-800">
                <p><strong>1. Yang berjalan baik:</strong> {proker.reflection.whatWentWell}</p>
                <p><strong>2. Yang perlu diperbaiki:</strong> {proker.reflection.whatNeedsImprovement}</p>
                {proker.reflection.recommendationNextYear && (
                  <p><strong>3. Rekomendasi tahun depan:</strong> {proker.reflection.recommendationNextYear}</p>
                )}
                {proker.reflection.evidenceUrl && (
                  <p>
                    <strong>Dokumentasi: </strong>
                    <a href={proker.reflection.evidenceUrl} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">
                      {proker.reflection.evidenceTitle || 'Buka Link Bukti'}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Activity Log stream */}
          {proker.activityLogs && proker.activityLogs.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Riwayat Aktivitas & Catatan Update</span>
              </h3>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
                {proker.activityLogs.map((log) => (
                  <div key={log.id} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-800">{log.actionText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Terakhir diupdate: <strong>{proker.lastUpdatedAt || 'Hari ini'}</strong>
          </span>

          <div className="flex items-center gap-2">
            {onOpenAssignTask && (
              <button
                onClick={() => onOpenAssignTask(team.id, proker.id)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Tugaskan Anggota</span>
              </button>
            )}

            {onOpenMarkCompleted && proker.status !== 'Selesai' && (
              <button
                onClick={() => onOpenMarkCompleted(team.id, proker.id)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Tandai Selesai</span>
              </button>
            )}

            <button
              onClick={() => onOpenUpdateProgress(team.id, proker.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Progress (&lt; 1 min)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

