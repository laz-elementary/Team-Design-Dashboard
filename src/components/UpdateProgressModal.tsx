import React, { useState } from 'react';
import { 
  X, 
  Check, 
  AlertTriangle, 
  Link as LinkIcon, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Plus,
  Trash2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerStatus, IssueCategory, EvidenceItem, MilestoneItem, ActivityLogItem } from '../types';
import { getFormattedCurrentTime } from '../utils/storage';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamCategory | null;
  proker: ProgramKerja | null;
  onSave: (teamId: string, updatedProker: ProgramKerja) => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  team,
  proker,
  onSave,
}) => {
  if (!isOpen || !team || !proker) return null;

  // 1. Apa yang sudah dikerjakan
  const [workDone, setWorkDone] = useState<string>('');

  // 2. Milestones checklist
  const [milestones, setMilestones] = useState<MilestoneItem[]>(
    proker.milestones ? JSON.parse(JSON.stringify(proker.milestones)) : []
  );

  // 3. Ada kendala?
  const [hasIssue, setHasIssue] = useState<boolean>(proker.issue?.hasIssue || false);
  const [issueCategory, setIssueCategory] = useState<IssueCategory>(proker.issue?.category || 'Koordinasi');
  const [issueDescription, setIssueDescription] = useState<string>(proker.issue?.description || '');

  // 4. Next Action
  const [nextAction, setNextAction] = useState<string>(proker.nextAction || '');
  const [nextActionDueDate, setNextActionDueDate] = useState<string>(proker.nextActionDueDate || '');

  // 5. Evidence (Optional)
  const [evidenceTitle, setEvidenceTitle] = useState<string>('');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<string>('Google Drive');

  // Calculate live progress %
  const completedMilestonesCount = milestones.filter(m => m.isCompleted).length;
  const currentProgressPercent = milestones.length > 0
    ? Math.round((completedMilestonesCount / milestones.length) * 100)
    : (proker.status === 'Selesai' ? 100 : 50);

  const toggleMilestone = (mId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === mId) {
        const nextDone = !m.isCompleted;
        return {
          ...m,
          isCompleted: nextDone,
          completedAt: nextDone ? 'Hari ini' : undefined,
        };
      }
      return m;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = getFormattedCurrentTime();
    const newLogs: ActivityLogItem[] = [...(proker.activityLogs || [])];

    // Build log message
    let actionSummary = workDone.trim();
    if (!actionSummary) {
      if (hasIssue) {
        actionSummary = `${proker.pic} melaporkan kendala ${issueCategory.toLowerCase()}: ${issueDescription}`;
      } else {
        actionSummary = `${proker.pic} memperbarui progres (${completedMilestonesCount}/${milestones.length} milestone).`;
      }
    } else {
      actionSummary = `${proker.pic}: ${actionSummary}`;
    }

    newLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp,
      author: proker.pic,
      actionText: actionSummary,
      type: hasIssue ? 'issue_reported' : 'progress',
    });

    // Evidence links
    const updatedEvidenceLinks: EvidenceItem[] = [...(proker.evidenceLinks || proker.evidences || [])];
    if (evidenceUrl.trim()) {
      const newEv: EvidenceItem = {
        id: `ev-${Date.now()}`,
        title: evidenceTitle.trim() || 'Dokumen Pendukung / Evidence',
        url: evidenceUrl.trim(),
        type: evidenceType,
        uploadedAt: timestamp,
      };
      updatedEvidenceLinks.unshift(newEv);
      newLogs.unshift({
        id: `log-ev-${Date.now()}`,
        timestamp,
        author: proker.pic,
        actionText: `${proker.pic} mengunggah evidence: ${newEv.title}.`,
        type: 'evidence',
      });
    }

    const allMilestonesDone = milestones.length > 0 && milestones.every(m => m.isCompleted);
    let finalStatus: ProkerStatus = proker.status;
    if (hasIssue) {
      finalStatus = 'Terkendala';
    } else if (allMilestonesDone && proker.status !== 'Selesai') {
      finalStatus = 'Sedang Berjalan';
    } else if (proker.status === 'Belum Dimulai') {
      finalStatus = 'Sedang Berjalan';
    }

    const updated: ProgramKerja = {
      ...proker,
      status: finalStatus,
      milestones,
      lastUpdatedAt: timestamp,
      lastUpdatedAtISO: new Date().toISOString(),
      daysSinceLastUpdate: 0,
      lastUpdateText: actionSummary,
      activityLogs: newLogs,
      issue: {
        hasIssue,
        category: hasIssue ? issueCategory : undefined,
        description: hasIssue ? issueDescription.trim() : undefined,
        isResolved: !hasIssue,
        createdAt: hasIssue ? (proker.issue?.createdAt || timestamp) : undefined,
        principalComment: proker.issue?.principalComment,
        principalCommentedAt: proker.issue?.principalCommentedAt,
      },
      nextAction: nextAction.trim() || proker.nextAction,
      nextActionDueDate: nextActionDueDate.trim() || proker.nextActionDueDate,
      evidenceLinks: updatedEvidenceLinks,
      evidences: updatedEvidenceLinks,
    };

    onSave(team.id, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                Form Cepat &lt; 1 Menit
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">Tim: {team.name}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Update Progress: {proker.title}
            </h2>
            <p className="text-xs text-slate-500">
              PIC: <strong className="text-slate-800">{proker.pic}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Short Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* STEP 1: Apa yang sudah dikerjakan? */}
          <div className="space-y-1.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <label className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                1
              </span>
              <span>Apa yang sudah dikerjakan?</span>
            </label>
            <textarea
              rows={2}
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              placeholder="Contoh: Konsep kegiatan sudah selesai dan sudah didiskusikan dengan anggota tim."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* STEP 2: Milestone yang selesai */}
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                <span>Milestone yang Selesai</span>
              </label>
              <div className="text-right">
                <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Progress Otomatis: {currentProgressPercent}%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Centang milestone yang telah tuntas. Persentase progres dihitung otomatis tanpa perlu menebak angka.
            </p>

            {milestones.length === 0 ? (
              <div className="text-slate-400 italic text-xs py-1">Belum ada milestone terdaftar.</div>
            ) : (
              <div className="space-y-1.5 pt-1">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      m.isCompleted ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                      m.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {m.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`font-semibold text-xs flex-1 ${m.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {m.title}
                    </span>
                    {m.targetDate && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        Target: {m.targetDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: Ada kendala? */}
          <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                  3
                </span>
                <span>Ada kendala?</span>
              </label>
              
              {/* Radio: Tidak / Ya */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-slate-700">
                  <input
                    type="radio"
                    name="hasIssueRadio"
                    checked={!hasIssue}
                    onChange={() => setHasIssue(false)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Tidak</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-rose-600">
                  <input
                    type="radio"
                    name="hasIssueRadio"
                    checked={hasIssue}
                    onChange={() => setHasIssue(true)}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <span>Ya (Ada Kendala)</span>
                </label>
              </div>
            </div>

            {hasIssue && (
              <div className="space-y-3 p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Otomatis diteruskan ke halaman Need Attention Kepala Sekolah</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Jenis Kendala
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
                    className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Koordinasi">Koordinasi</option>
                    <option value="Approval">Approval</option>
                    <option value="Waktu">Waktu</option>
                    <option value="SDM">SDM</option>
                    <option value="Sarana">Sarana</option>
                    <option value="Budget">Budget</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Contoh: Masih menunggu konfirmasi penggunaan aula dari bagian sarpras..."
                    className="w-full bg-white border border-rose-300 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-800"
                    required={hasIssue}
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: Next Action */}
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <label className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                4
              </span>
              <span>Next Action (Langkah Berikutnya)</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Supaya Kepala Sekolah mengetahui apa pekerjaan tim selanjutnya, bukan hanya angka persen progres.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="Contoh: Finalisasi rundown bersama anggota tim."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={nextActionDueDate}
                  onChange={(e) => setNextActionDueDate(e.target.value)}
                  placeholder="Target: e.g. 8 September"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* STEP 5: Evidence (Optional) */}
          <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-black">
                  5
                </span>
                <span>Evidence & Tautan Google Drive Tim</span>
              </label>
              <a
                href={team.driveFolderUrl || `https://drive.google.com/drive/folders/team-${team.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200"
              >
                <span>📁 Buka Drive Tim</span>
                <LinkIcon className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Guru mengunggah file/foto ke folder Drive tim di atas. Masukkan judul dan link berkas yang relevan ke kolom di bawah ini.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="Nama Dokumen: Draf Modul"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="Link Google Drive: https://drive.google.com/..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

