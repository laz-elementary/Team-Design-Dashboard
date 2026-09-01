import React from 'react';
import { Download, Printer, X, FileText, CheckCircle2, Star, Layers } from 'lucide-react';
import { TeamCategory, DashboardStats } from '../types';
import { exportDataAsJSON } from '../utils/storage';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamCategory[];
  stats: DashboardStats;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  teams,
  stats,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    exportDataAsJSON(teams);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Laporan Eksekutif Team Design</h3>
              <p className="text-xs text-slate-400">Ringkasan Program Kerja & Evaluasi TA 2025/2026</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              LAPORAN KINERJA TEAM DESIGN
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              SD LAZUARDI • TAHUN AJARAN 2025/2026
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Total Tim</span>
              <strong className="text-base text-slate-900 font-extrabold">{stats.totalTeams} Divisi</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Total Proker</span>
              <strong className="text-base text-slate-900 font-extrabold">{stats.totalProker} Kegiatan</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Proker Selesai</span>
              <strong className="text-base text-emerald-600 font-extrabold">{stats.completedProker} Selesai</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Indeks Kepuasan</span>
              <strong className="text-base text-amber-600 font-extrabold">{stats.averageSatisfaction} / 5.0</strong>
            </div>
          </div>

          {/* Teams Table Summary */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
              Rincian Tim & Status Progres
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Divisi Tim</th>
                    <th className="py-2.5 px-3">Jumlah Anggota</th>
                    <th className="py-2.5 px-3">Program Kerja</th>
                    <th className="py-2.5 px-3">Selesai</th>
                    <th className="py-2.5 px-3">Refleksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teams.map((t) => {
                    const done = t.prokers.filter(p => p.status === 'Selesai').length;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{t.name}</td>
                        <td className="py-2 px-3 text-slate-600">{t.members.length} Orang</td>
                        <td className="py-2 px-3 text-slate-600">{t.prokers.length} Agenda</td>
                        <td className="py-2 px-3 font-bold text-emerald-600">{done} ({t.prokers.length > 0 ? Math.round((done / t.prokers.length) * 100) : 0}%)</td>
                        <td className="py-2 px-3 text-slate-600">{t.reflections.length} Catatan</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Data JSON
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
