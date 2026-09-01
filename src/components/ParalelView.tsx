import React, { useState } from 'react';
import { 
  Users, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  MessageSquare,
  Plus
} from 'lucide-react';
import { TeamCategory, ProgramKerja, ProkerStatus } from '../types';
import confetti from 'canvas-confetti';

interface ParalelViewProps {
  paralelTeam: TeamCategory;
  onUpdateProkerStatus: (teamId: string, prokerId: string, newStatus: ProkerStatus) => void;
  onOpenAddReflection: (teamId: string, prokerId?: string, prokerTitle?: string) => void;
  onOpenAI: (teamName: string, prokerTitle?: string) => void;
}

export const ParalelView: React.FC<ParalelViewProps> = ({
  paralelTeam,
  onUpdateProkerStatus,
  onOpenAddReflection,
  onOpenAI,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const gradeLeaders = [
    { grade: 'Grade 1', teacher: 'Tr. Iin', color: 'from-pink-500 to-rose-500', focus: 'Transisi & Fondasi Karakter Siswa Baru' },
    { grade: 'Grade 2', teacher: 'Tr. Novilia', color: 'from-amber-500 to-orange-500', focus: 'Kemandirian Belajar & Literasi Dasar' },
    { grade: 'Grade 3', teacher: 'Tr. Mira', color: 'from-emerald-500 to-teal-500', focus: 'Kolaborasi Kelompok & Eksplorasi Proyek' },
    { grade: 'Grade 4', teacher: 'Tr. Aan', color: 'from-blue-500 to-cyan-500', focus: 'Berpikir Kritis & Penguatan Karakter' },
    { grade: 'Grade 5', teacher: 'Tr. Panca', color: 'from-indigo-500 to-violet-500', focus: 'Kesiapan Asesmen Nasional (AKM)' },
    { grade: 'Grade 6', teacher: 'Tr. Novi', color: 'from-purple-500 to-fuchsia-500', focus: 'Kelulusan, TKA & Wisuda Kelas 6' },
  ];

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
    onUpdateProkerStatus(paralelTeam.id, prokerId, newStatus);
    if (newStatus === 'Selesai') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 text-xs font-bold border border-teal-400/30">
              <Layers className="w-3.5 h-3.5" />
              <span>Koordinator Paralel Jenjang Grade 1 - 6</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              PJ Paralel Management Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Penyelarasan agenda lintas jenjang: Journey Weeks, Class Conference, AKM Kelas 5, TKA Kelas 6, Wisuda, Buka Bersama, dan Big Brother and Sister.
            </p>
          </div>

          <button
            onClick={() => onOpenAI('PJ Paralel', 'Sinkronisasi Agenda Jenjang Kelas 1-6')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 shadow-md cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Konsultasi Paralel</span>
          </button>
        </div>
      </div>

      {/* 6 Grades Coordinator Cards (Slide 13 layout) */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" />
          Koordinator Jenjang Paralel (Grade 1 - 6)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gradeLeaders.map((item) => (
            <div
              key={item.grade}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-center flex flex-col items-center justify-between"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-extrabold text-sm shadow-xs`}>
                {item.grade.replace('Grade ', 'G')}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs">{item.grade}</h3>
                <p className="text-xs font-bold text-teal-700 mt-0.5">{item.teacher}</p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Parallel Initiatives Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Program Kerja Lintas Paralel (7 Kegiatan)</h2>
            <p className="text-xs text-slate-500">Monitoring status pelaksanaan inisiatif paralel sekolah</p>
          </div>

          <button
            onClick={() => onOpenAddReflection(paralelTeam.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Tulis Refleksi Paralel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paralelTeam.prokers.map((proker) => (
            <div
              key={proker.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{proker.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{proker.description}</p>
                </div>

                <select
                  value={proker.status}
                  onChange={(e) => handleStatusChange(proker.id, e.target.value as ProkerStatus)}
                  className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${getStatusColor(proker.status)}`}
                >
                  <option value="Belum Dimulai">Belum Dimulai</option>
                  <option value="Dalam Perencanaan">Dalam Perencanaan</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Tahap Review">Tahap Review</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Terkendala">Terkendala</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400">PIC: </span>
                  <strong className="text-slate-800">{proker.pic}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Target: </span>
                  <strong className="text-teal-700">{proker.targetMonth || '-'}</strong>
                </div>
              </div>

              {proker.deliverables && proker.deliverables.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {proker.deliverables.map((d, i) => (
                    <span key={i} className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                      📄 {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
