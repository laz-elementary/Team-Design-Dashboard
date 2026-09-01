import React, { useState } from 'react';
import { X, FolderOpen, ExternalLink, Link2, Check, AlertCircle } from 'lucide-react';
import { TeamCategory } from '../types';

interface EditDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamCategory | null;
  onSaveDriveUrl: (teamId: string, driveUrl: string) => void;
}

export const EditDriveModal: React.FC<EditDriveModalProps> = ({
  isOpen,
  onClose,
  team,
  onSaveDriveUrl,
}) => {
  if (!isOpen || !team) return null;

  const [url, setUrl] = useState<string>(team.driveFolderUrl || '');
  const [copied, setCopied] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDriveUrl(team.id, url.trim());
    onClose();
  };

  const handleCopy = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="modal-edit-drive"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Google Drive Folder Tim {team.shortName}
              </h2>
              <p className="text-xs text-slate-500">
                Wadah penyimpanan berkas, dokumen, & evidence seluruh guru di tim ini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Petunjuk untuk Admin / Tim:</strong> Guru dapat mengunggah lembar kerja, modul, dokumentasi foto, dan laporan ke folder Google Drive tim ini. Tautan file kemudian dapat ditempelkan ke setiap Program Kerja sebagai <em>Evidence</em>.
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Link URL Google Drive Folder Tim:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Pastikan akses folder diatur ke <em>"Anyone with the link / Siapa saja dengan link dapat melihat"</em> di Google Drive sekolah.
            </p>
          </div>

          {url && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 overflow-hidden text-slate-600">
                <span className="font-semibold text-slate-700 whitespace-nowrap">Uji Akses:</span>
                <span className="truncate text-indigo-600 font-mono text-[11px]">{url}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : 'Salin'}
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <span>Buka</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Simpan Link Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
