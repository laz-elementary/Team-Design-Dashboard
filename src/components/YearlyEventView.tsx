import React from 'react';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Award, 
  Palette, 
  ArrowRight,
  Plus,
  MessageSquare
} from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerStatus } from '../types';
import confetti from 'canvas-confetti';

interface YearlyEventViewProps {
  yearlyTeam: TeamCategory;
  onUpdateProkerStatus: (teamId: string, prokerId: string, newStatus: ProkerStatus) => void;
  onToggleSubtask: (teamId: string, prokerId: string, subtaskId: string) => void;
  onOpenAddReflection: (teamId: string, prokerId?: string, prokerTitle?: string) => void;
  onOpenAI: (teamName: string, prokerTitle?: string) => void;
}

export const YearlyEventView: React.FC<YearlyEventViewProps> = ({
  yearlyTeam,
  onUpdateProkerStatus,
  onToggleSubtask,
  onOpenAddReflection,
  onOpenAI,
}) => {
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
    onUpdateProkerStatus(yearlyTeam.id, prokerId, newStatus);
    if (newStatus === 'Selesai') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>8 Event Akbar Sekolah TA 2025/2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              PJ Yearly Event Dashboard
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manajemen komprehensif 8 program kerja akbar sekolah dengan alokasi Penanggung Jawab (PIC) khusus, timeline eksekusi, serta kebutuhan desain visual & operasional.
            </p>
          </div>

          <button
            onClick={() => onOpenAI('Yearly Event', 'Strategi Koordinasi 8 Event Akbar')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 shadow-md cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Event Advisor</span>
          </button>
        </div>

        {/* Members Roster Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-blue-200">Tim Yearly Event:</span>
          {yearlyTeam.members.map((m) => (
            <span key={m.id} className="bg-white/10 text-white px-2.5 py-1 rounded-lg border border-white/10">
              {m.name}
            </span>
          ))}
        </div>
      </div>

      {/* 8 Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {yearlyTeam.prokers.map((event, index) => {
          return (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center border border-blue-200">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">{event.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{event.description}</p>
                  </div>

                  <select
                    value={event.status}
                    onChange={(e) => handleStatusChange(event.id, e.target.value as ProkerStatus)}
                    className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${getStatusColor(event.status)}`}
                  >
                    <option value="Belum Dimulai">Belum Dimulai</option>
                    <option value="Dalam Perencanaan">Dalam Perencanaan</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Tahap Review">Tahap Review</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Terkendala">Terkendala</option>
                  </select>
                </div>

                {/* PIC Card */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Penanggung Jawab (PJ Event):</span>
                      <strong className="text-slate-900 font-bold">{event.pic}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 text-[11px] block">Target Bulan:</span>
                    <strong className="text-indigo-600 font-semibold">{event.targetMonth || '-'}</strong>
                  </div>
                </div>

                {/* Deliverables Checklist */}
                {event.deliverables && event.deliverables.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Kebutuhan Desain & Logistik:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {event.deliverables.map((d, i) => (
                        <span key={i} className="text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                          🎨 {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenAddReflection(yearlyTeam.id, event.id, event.title)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Tulis Refleksi Event
                </button>

                <button
                  onClick={() => onOpenAI('Yearly Event', event.title)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Saran AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
