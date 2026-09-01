import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Filter
} from 'lucide-react';
import { TeamCategory, ProgramKerja } from '../types';
import { getProkerProgress, isProkerNeedsAttention } from '../utils/storage';

interface TimelineViewProps {
  teams: TeamCategory[];
  onSelectProgram: (teamId: string, prokerId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  teams,
  onSelectProgram,
}) => {
  const months = [
    'Juli 2026',
    'Agustus 2026',
    'September 2026',
    'Oktober 2026',
    'November 2026',
    'Desember 2026',
    'Januari 2027',
    'Februari 2027',
    'Maret 2027',
    'April 2027',
    'Mei 2027',
    'Juni 2027',
  ];

  const [activeMonth, setActiveMonth] = useState<string>('September 2026');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');

  const allProkers = teams.flatMap(t => 
    t.prokers.map(p => ({ ...p, teamShortName: t.shortName, teamName: t.name }))
  );

  // Group prokers by month keyword
  const getProkersForMonth = (monthName: string) => {
    const rawMonth = monthName.split(' ')[0].toLowerCase();
    return allProkers.filter(p => {
      const matchTeam = selectedTeamFilter === 'all' || p.teamId === selectedTeamFilter;
      if (!matchTeam) return false;

      const targetM = (p.targetMonth || '').toLowerCase();
      const targetD = (p.targetDate || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();

      if (rawMonth === 'juli' && (targetM.includes('juli') || targetD.includes('-07-') || targetM.includes('jul'))) return true;
      if (rawMonth === 'agustus' && (targetM.includes('agustus') || targetD.includes('-08-') || targetM.includes('aug'))) return true;
      if (rawMonth === 'september' && (targetM.includes('september') || targetD.includes('-09-') || targetM.includes('sep'))) return true;
      if (rawMonth === 'oktober' && (targetM.includes('oktober') || targetD.includes('-10-') || targetM.includes('oct'))) return true;
      if (rawMonth === 'november' && (targetM.includes('november') || targetD.includes('-11-') || targetM.includes('nov'))) return true;
      if (rawMonth === 'desember' && (targetM.includes('desember') || targetD.includes('-12-') || targetM.includes('dec'))) return true;
      if (rawMonth === 'januari' && (targetM.includes('januari') || targetD.includes('-01-') || targetM.includes('jan'))) return true;
      if (rawMonth === 'februari' && (targetM.includes('februari') || targetD.includes('-02-') || targetM.includes('feb'))) return true;
      if (rawMonth === 'maret' && (targetM.includes('maret') || targetD.includes('-03-') || targetM.includes('mar'))) return true;
      if (rawMonth === 'april' && (targetM.includes('april') || targetD.includes('-04-') || targetM.includes('apr'))) return true;
      if (rawMonth === 'mei' && (targetM.includes('mei') || targetD.includes('-05-') || targetM.includes('may'))) return true;
      if (rawMonth === 'juni' && (targetM.includes('juni') || targetD.includes('-06-') || targetM.includes('jun'))) return true;

      if (targetM.includes('rutin') || targetM.includes('sepanjang') || targetM.includes('semester')) {
        return true; // Routine prokers show in all months
      }

      return false;
    });
  };

  const monthProkers = getProkersForMonth(activeMonth);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Timeline Kalender Program (2026/2027)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi roadmap eksekusi program per bulan sepanjang tahun ajaran
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="all">Semua Tim</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Month Tabs Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {months.map((m) => {
          const isSelected = m === activeMonth;
          const count = getProkersForMonth(m).length;
          return (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{m}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Month Content Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-black text-slate-900">
              Agenda & Target: {activeMonth}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {monthProkers.length} Kegiatan Terjadwal
          </span>
        </div>

        {monthProkers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Clock className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-medium">Tidak ada target program khusus yang dijadwalkan di bulan {activeMonth}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthProkers.map((proker) => {
              const prog = getProkerProgress(proker);
              const hasIssue = isProkerNeedsAttention(proker);

              return (
                <div
                  key={proker.id}
                  onClick={() => onSelectProgram(proker.teamId, proker.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    hasIssue
                      ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                      : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                        {proker.teamShortName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {proker.targetDate ? proker.targetDate.slice(5) : (proker.targetMonth || 'Bulan ini')}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs hover:text-indigo-600 transition-colors">
                      {proker.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      PIC: <strong className="text-slate-700">{proker.pic}</strong>
                      {proker.description ? ` — ${proker.description}` : ''}
                    </p>
                  </div>

                  {/* Progress info */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Progress:</span>
                      <span className="font-bold text-slate-800">{prog}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          prog === 100 ? 'bg-emerald-500' : prog >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
