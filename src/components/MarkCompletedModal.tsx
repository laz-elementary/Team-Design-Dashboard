import React, { useState } from 'react';
import { X, CheckCircle2, Award, Sparkles, Link as LinkIcon, Star } from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerReflection, ActivityLogItem } from '../types';
import { getFormattedCurrentTime } from '../utils/storage';

interface MarkCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamCategory | null;
  proker: ProgramKerja | null;
  onSubmit: (teamId: string, updatedProker: ProgramKerja) => void;
}

export const MarkCompletedModal: React.FC<MarkCompletedModalProps> = ({
  isOpen,
  onClose,
  team,
  proker,
  onSubmit,
}) => {
  if (!isOpen || !team || !proker) return null;

  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatNeedsImprovement, setWhatNeedsImprovement] = useState('');
  const [recommendationNextYear, setRecommendationNextYear] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceTitle, setEvidenceTitle] = useState('Dokumentasi & Laporan Akhir');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = getFormattedCurrentTime();
    const newLogs: ActivityLogItem[] = [...(proker.activityLogs || [])];
    
    newLogs.unshift({
      id: `log-complete-${Date.now()}`,
      timestamp,
      author: proker.pic,
      actionText: `${proker.pic} menandai program '${proker.title}' SELESAI dan mengirimkan refleksi ke Kepala Sekolah.`,
      type: 'completed',
    });

    const reflection: ProkerReflection = {
      submittedBy: proker.pic,
      submittedAt: timestamp,
      whatWentWell: whatWentWell.trim() || 'Semua target kegiatan terlaksana dengan baik.',
      whatNeedsImprovement: whatNeedsImprovement.trim() || 'Perlu koordinasi lebih awal dengan seluruh stakeholder.',
      recommendationNextYear: recommendationNextYear.trim() || 'Persiapan dapat dimulai minimal 3-4 minggu sebelum jadwal.',
      evidenceUrl: evidenceUrl.trim() || undefined,
      evidenceTitle: evidenceTitle.trim() || undefined,
      isReviewed: false,
    };

    const updated: ProgramKerja = {
      ...proker,
      status: 'Selesai',
      lastUpdatedAt: timestamp,
      lastUpdateText: `${proker.pic} menyelesaikan program dan mengirimkan refleksi.`,
      activityLogs: newLogs,
      reflection,
      milestones: (proker.milestones || []).map(m => ({ ...m, isCompleted: true, completedAt: m.completedAt || timestamp })),
    };

    onSubmit(team.id, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Penyelesaian Program
              </span>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                Mark Program as Completed
              </h2>
              <p className="text-xs text-slate-500">{proker.title} ({team.shortName})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Short Reflection Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-emerald-800 text-[11px] leading-relaxed">
            ✨ <strong>Bukan laporan panjang.</strong> Cukup tuliskan poin intisari evaluasi agar tersimpan sebagai rujukan kepanitiaan tahun depan dan Kepala Sekolah dapat langsung memberi feedback.
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 text-xs">
              1. Yang Berjalan Baik (What went well)
            </label>
            <textarea
              required
              rows={2}
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              placeholder="Contoh: Koordinasi antarwali kelas berjalan efektif, partisipasi siswa 95%."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 text-xs">
              2. Yang Perlu Diperbaiki (What needs improvement)
            </label>
            <textarea
              required
              rows={2}
              value={whatNeedsImprovement}
              onChange={(e) => setWhatNeedsImprovement(e.target.value)}
              placeholder="Contoh: Publikasi perlu dilakukan lebih awal agar orang tua siap."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 text-xs">
              3. Recommendation Next Year
            </label>
            <textarea
              required
              rows={2}
              value={recommendationNextYear}
              onChange={(e) => setRecommendationNextYear(e.target.value)}
              placeholder="Contoh: Timeline persiapan dimulai minimal empat minggu sebelumnya."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 text-xs">
              4. Link Evidence / Dokumentasi (Google Drive / Canva / Dokumen)
            </label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-100 transition-colors cursor-pointer"
            >
              Submit Reflection & Selesai
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
