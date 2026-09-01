import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Download, 
  Trash2,
  FileSpreadsheet,
  Layers,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  userRole: UserRole;
  onRoleToggle: (role: UserRole) => void;
  onOpenAddProker: () => void;
  onOpenAIChat: () => void;
  onClearData: () => void;
  onLoadDemoData: () => void;
  onExportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  onRoleToggle,
  onOpenAddProker,
  onOpenAIChat,
  onClearData,
  onLoadDemoData,
  onExportData,
}) => {
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Branding & Controls Bar */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs font-black text-sm sm:text-base shrink-0">
              TD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight">TEAM DESIGN MONITORING</span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded-sm hidden sm:inline-block">
                  2026/2027
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none">
                Monitoring Program Kerja & Google Drive Tim
              </p>
            </div>
          </div>

          {/* Center Role Toggle (Kepsek vs Admin) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onRoleToggle('kepsek')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                userRole === 'kepsek'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👨‍💼 Kepala Sekolah</span>
            </button>
            <button
              onClick={() => onRoleToggle('admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                userRole === 'admin'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🛠️ Admin</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenAIChat}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
              title="Konsultasi Evaluasi & Solusi AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Consultant</span>
            </button>

            <button
              onClick={onOpenAddProker}
              className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Program Baru</span>
            </button>

            {/* Manage Data Dropdown / Action */}
            <div className="relative">
              <button
                onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                className="flex items-center gap-1 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                title="Kelola Data (Kosongkan / Muat Contoh / Ekspor)"
              >
                <Layers className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>

              {isDataMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDataMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Opsi Manajemen Data
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsDataMenuOpen(false);
                        onClearData();
                      }}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                      <span>Kosongkan Semua Data</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDataMenuOpen(false);
                        onLoadDemoData();
                      }}
                      className="w-full px-3 py-2 text-left text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                      <span>Muat Contoh Program (Demo)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDataMenuOpen(false);
                        onExportData();
                      }}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer border-t border-slate-100"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Unduh / Backup JSON</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
