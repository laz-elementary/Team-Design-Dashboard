import React, { useState } from 'react';
import { X, CheckCircle, UserPlus, Calendar, FileText } from 'lucide-react';
import { TeamCategory, ProgramKerja, TaskSubItem, ActivityLogItem } from '../types';
import { getFormattedCurrentTime } from '../utils/storage';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamCategory | null;
  proker: ProgramKerja | null;
  onAssign: (teamId: string, updatedProker: ProgramKerja) => void;
}

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  isOpen,
  onClose,
  team,
  proker,
  onAssign,
}) => {
  if (!isOpen || !team || !proker) return null;

  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(
    team.members[1]?.name || team.members[0]?.name || ''
  );
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !assignedTo.trim()) return;

    const timestamp = getFormattedCurrentTime();
    const newTask: TaskSubItem = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      programId: proker.id,
      programTitle: proker.title,
      teamId: team.id,
      assignedTo: assignedTo.trim(),
      assignedBy: proker.pic,
      dueDate: dueDate.trim() || 'Sesuai jadwal',
      status: 'To Do',
      notes: notes.trim() || undefined,
    };

    const newLogs: ActivityLogItem[] = [...(proker.activityLogs || [])];
    newLogs.unshift({
      id: `log-task-${Date.now()}`,
      timestamp,
      author: proker.pic,
      actionText: `${proker.pic} menugaskan '${newTask.title}' ke ${newTask.assignedTo} (Tenggat: ${newTask.dueDate}).`,
      type: 'progress',
    });

    const updatedSubTasks = [...(proker.subTasks || []), newTask];

    const updated: ProgramKerja = {
      ...proker,
      subTasks: updatedSubTasks,
      activityLogs: newLogs,
      lastUpdatedAt: timestamp,
      lastUpdateText: `${proker.pic} membagi tugas ke ${newTask.assignedTo}`,
    };

    onAssign(team.id, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/70">
          <div>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded-md">
              Kewenangan PIC Program
            </span>
            <h2 className="text-base font-black text-slate-900 mt-1">
              Beri Tugas ke Anggota Tim
            </h2>
            <p className="text-xs text-slate-500">Program: {proker.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Judul Tugas / Pekerjaan</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Contoh: Membuat surat informasi orang tua"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Tugaskan Kepada (Anggota Tim)</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {team.members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Tenggat Waktu (Deadline Tugas)</label>
            <input
              type="text"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Contoh: 7 September 2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Catatan / Instruksi (Opsional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Gunakan template surat resmi dari Google Drive sekolah..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
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
              Tugaskan Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
