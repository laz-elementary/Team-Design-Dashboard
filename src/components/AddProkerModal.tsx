import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { TeamCategory, ProgramKerja, DesignThinkingPhase, ProkerStatus } from '../types';

interface AddProkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamCategory[];
  defaultTeamId?: string;
  onAdd: (teamId: string, proker: ProgramKerja) => void;
}

export const AddProkerModal: React.FC<AddProkerModalProps> = ({
  isOpen,
  onClose,
  teams,
  defaultTeamId,
  onAdd,
}) => {
  if (!isOpen) return null;

  const [teamId, setTeamId] = useState<string>(defaultTeamId || teams[0]?.id || 'literasi');
  const [title, setTitle] = useState('');
  const [pic, setPic] = useState('');
  const [description, setDescription] = useState('');
  const [targetMonth, setTargetMonth] = useState('September 2026');
  const [targetDate, setTargetDate] = useState('');
  const [designPhase, setDesignPhase] = useState<DesignThinkingPhase>('Define');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [milestonesText, setMilestonesText] = useState('Penyusunan konsep kegiatan\nRapat koordinasi tim\nEksekusi & pelaksanaan\nEvaluasi & refleksi');

  const selectedTeam = teams.find(t => t.id === teamId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pic.trim()) return;

    const parsedMilestones = milestonesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: line,
        isCompleted: false,
      }));

    const newProker: ProgramKerja = {
      id: `p-${Date.now()}`,
      teamId,
      title: title.trim(),
      pic: pic.trim(),
      description: description.trim(),
      targetMonth,
      targetDate: targetDate || undefined,
      status: 'Sedang Berjalan',
      designPhase,
      priority,
      milestones: parsedMilestones,
      lastUpdatedAt: 'Hari ini',
      lastUpdateText: 'Program baru ditambahkan ke roadmap',
      evidences: [],
    };

    onAdd(teamId, newProker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-900">Tambah Program Kerja Baru</h2>
            <p className="text-xs text-slate-500">Daftarkan rencana kegiatan ke dalam sistem monitoring</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Team Select */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Pilih Tim / Divisi</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Nama Program Kerja</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Bulan Bahasa 2026 / Asesmen Diagnostik"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* PIC & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Penanggung Jawab (PIC)</label>
              <input
                type="text"
                required
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                placeholder="Contoh: Tika Destita"
                list="members-list"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <datalist id="members-list">
                {selectedTeam?.members.map(m => (
                  <option key={m.id} value={m.name} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="High">Tinggi (High Priority)</option>
                <option value="Medium">Sedang (Medium)</option>
                <option value="Low">Rendah (Low)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Deskripsi & Sasaran</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan dan output yang diharapkan dari program ini..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Target Month & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Target Bulan</label>
              <input
                type="text"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                placeholder="e.g. September 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Target Tanggal Spesifik (Opsional)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Milestones list textarea */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>Daftar Milestone / Tahapan (1 baris per milestone)</span>
            </label>
            <textarea
              rows={4}
              value={milestonesText}
              onChange={(e) => setMilestonesText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-400">
              Setiap baris akan menjadi checkbox checklist yang otomatis menghitung progress % program.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              Simpan Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
