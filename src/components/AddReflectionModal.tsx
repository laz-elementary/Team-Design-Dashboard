import React, { useState } from 'react';
import { Star, X, MessageSquare, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { TeamCategory, TeamReflection } from '../types';

interface AddReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamCategory[];
  defaultTeamId?: string;
  defaultProkerId?: string;
  defaultProkerTitle?: string;
  onSaveReflection: (teamId: string, reflection: Omit<TeamReflection, 'id' | 'createdAt'>) => void;
}

export const AddReflectionModal: React.FC<AddReflectionModalProps> = ({
  isOpen,
  onClose,
  teams,
  defaultTeamId,
  defaultProkerId,
  defaultProkerTitle,
  onSaveReflection,
}) => {
  const [teamId, setTeamId] = useState<string>(defaultTeamId || teams[0]?.id || 'agama');
  const [prokerTitle, setProkerTitle] = useState<string>(defaultProkerTitle || '');
  const [author, setAuthor] = useState<string>('');
  const [period, setPeriod] = useState<string>('Term 1 2025/2026');
  const [rating, setRating] = useState<number>(5);
  const [whatWentWell, setWhatWentWell] = useState<string>('');
  const [challenges, setChallenges] = useState<string>('');
  const [improvements, setImprovements] = useState<string>('');
  const [stakeholderFeedback, setStakeholderFeedback] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatWentWell.trim() || !improvements.trim()) return;

    onSaveReflection(teamId, {
      teamId,
      prokerId: defaultProkerId,
      prokerTitle: prokerTitle.trim() || 'Evaluasi Berkala Tim',
      author: author.trim() || 'Tim Desain',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      period,
      whatWentWell: whatWentWell.trim(),
      challenges: challenges.trim() || 'Tidak ada kendala berarti',
      improvements: improvements.trim(),
      rating,
      stakeholderFeedback: stakeholderFeedback.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Tulis Jurnal Refleksi & Evaluasi</h3>
              <p className="text-xs text-amber-100">Dokumentasikan pencapaian, kendala, dan rencana perbaikan tim</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Pilih Tim:</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Program Kerja / Kegiatan:</label>
              <input
                type="text"
                value={prokerTitle}
                onChange={(e) => setProkerTitle(e.target.value)}
                placeholder="Contoh: Super Camp, Sholat Berjamaah..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Penulis / PIC:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama Anda"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Periode Evaluasi:</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Term 1 / Bulanan"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Rating Kepuasan (1-5):</label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-emerald-800 block mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              1. Apa yang Berhasil & Berjalan Sangat Baik?*
            </label>
            <textarea
              required
              rows={2}
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              placeholder="Contoh: Keterlibatan siswa tinggi, materi visual selesai H-7, publikasi media sosial rapi..."
              className="w-full text-xs bg-emerald-50/40 border border-emerald-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-rose-800 block mb-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              2. Kendala, Tantangan & Hambatan di Lapangan:
            </label>
            <textarea
              rows={2}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Contoh: Waktu gladi bersih mepet, revisi naskah terlambat, koordinasi sound system..."
              className="w-full text-xs bg-rose-50/40 border border-rose-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-indigo-800 block mb-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              3. Rencana Perbaikan (Action Plan) ke Depan:*
            </label>
            <textarea
              required
              rows={2}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="Contoh: Membuat jadwal produksi H-14, gladi kotor 2 hari sebelum acara, standarisasi template..."
              className="w-full text-xs bg-indigo-50/40 border border-indigo-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Catatan / Feedback dari Kepala Sekolah / Stakeholder (Opsional):
            </label>
            <input
              type="text"
              value={stakeholderFeedback}
              onChange={(e) => setStakeholderFeedback(e.target.value)}
              placeholder="Kutipan atau apresiasi yang diterima dari pimpinan..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs"
            >
              Simpan Refleksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
