import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  FileCheck, 
  Radio, 
  HeartHandshake, 
  Wallet, 
  Sprout, 
  BookOpen, 
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerStatus } from '../types';
import confetti from 'canvas-confetti';

interface SpecialTeamViewProps {
  specialTeam: TeamCategory;
  onUpdateProkerStatus: (teamId: string, prokerId: string, newStatus: ProkerStatus) => void;
  onOpenAddReflection: (teamId: string, prokerId?: string, prokerTitle?: string) => void;
  onOpenAI: (teamName: string, prokerTitle?: string) => void;
}

export const SpecialTeamView: React.FC<SpecialTeamViewProps> = ({
  specialTeam,
  onUpdateProkerStatus,
  onOpenAddReflection,
  onOpenAI,
}) => {
  const getTaskIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('photo')) return <Camera className="w-5 h-5 text-indigo-600" />;
    if (t.includes('progression') || t.includes('checkpoint')) return <FileCheck className="w-5 h-5 text-blue-600" />;
    if (t.includes('radio')) return <Radio className="w-5 h-5 text-rose-600" />;
    if (t.includes('amal')) return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
    if (t.includes('kas')) return <Wallet className="w-5 h-5 text-amber-600" />;
    if (t.includes('farm') || t.includes('kebun')) return <Sprout className="w-5 h-5 text-emerald-600" />;
    if (t.includes('raport') || t.includes('rapor')) return <BookOpen className="w-5 h-5 text-purple-600" />;
    return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
  };

  const getStatusColor = (status: ProkerStatus) => {
    switch (status) {
      case 'Selesai': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Sedang Berjalan': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Tahap Review': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Dalam Perencanaan': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Terkendala': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleStatusChange = (prokerId: string, newStatus: ProkerStatus) => {
    onUpdateProkerStatus(specialTeam.id, prokerId, newStatus);
    if (newStatus === 'Selesai') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-fuchsia-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/30 text-fuchsia-200 text-xs font-bold border border-fuchsia-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tanggung Jawab Spesifik & Operasional Sekolah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Team Khusus Workspace
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Tracking penugasan operasional krusial: Pas Photo (Pak Saidi), Progression Test (Tr. Mira), Checkpoint Test (Tr. Asti), Radio Sekolah (Tr. Sasa), Uang Amal (Tr. Nita), Uang Kas (Tr. Anggi), Mini Farm (Tr. Anam), dan Raport (Tr. Nining & Tr. Novi).
            </p>
          </div>

          <button
            onClick={() => onOpenAI('Team Khusus', 'Manajemen Operasional Sekolah')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 shadow-md cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-600" />
            <span>AI Konsultan Team Khusus</span>
          </button>
        </div>
      </div>

      {/* 8 Specific Tasks Grid (Slide 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialTeam.prokers.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                  {getTaskIcon(task.title)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                </div>
              </div>

              {/* PIC Highlight Box */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-fuchsia-50/50 border border-fuchsia-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Penanggung Jawab (PIC):</span>
                  <strong className="text-fuchsia-950 font-bold">{task.pic}</strong>
                </div>

                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as ProkerStatus)}
                  className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${getStatusColor(task.status)}`}
                >
                  <option value="Belum Dimulai">Belum Dimulai</option>
                  <option value="Dalam Perencanaan">Dalam Perencanaan</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Tahap Review">Tahap Review</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Terkendala">Terkendala</option>
                </select>
              </div>

              {task.deliverables && task.deliverables.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {task.deliverables.map((d, i) => (
                    <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => onOpenAddReflection(specialTeam.id, task.id, task.title)}
                className="inline-flex items-center gap-1 font-semibold text-amber-600 hover:text-amber-700"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Catat Refleksi / Kendala
              </button>

              <span className="text-slate-400 font-medium">{task.targetMonth || 'Rutin'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
