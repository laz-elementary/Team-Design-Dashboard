import React from 'react';
import { Lightbulb, CheckCircle2, X, Sparkles, ArrowRight, Heart, Target, Compass, Palette, TestTube } from 'lucide-react';

interface DesignThinkingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignThinkingGuideModal: React.FC<DesignThinkingGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      number: '1',
      title: 'Empathize (Memahami Pengguna)',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      color: 'border-rose-200 bg-rose-50/60 text-rose-900',
      description: 'Pahami kebutuhan riil siswa, guru pengajar, panitia acara, dan orang tua. Dengarkan masukan mengenai tantangan yang dihadapi pada acara tahun sebelumnya.',
      actionPoint: 'Wawancara singkat & observasi kebutuhan visual/fungsional.',
    },
    {
      number: '2',
      title: 'Define (Mendefinisikan Masalah)',
      icon: <Target className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-200 bg-indigo-50/60 text-indigo-900',
      description: 'Rumuskan masalah spesifik yang ingin diselesaikan melalui program kerja tim. Tetapkan tujuan utama acara dan pesan kunci yang harus tersampaikan.',
      actionPoint: 'Penyusunan brief acara, target audiens, dan tema utama.',
    },
    {
      number: '3',
      title: 'Ideate (Memunculkan Ide Kreatif)',
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-200 bg-amber-50/60 text-amber-900',
      description: 'Brainstorming bersama anggota tim untuk mengeksplorasi ragam konsep visual, format acara baru, desain publikasi interaktif, dan media inovatif.',
      actionPoint: 'Sketsa konsep, moodboard visual, dan alternatif rancangan.',
    },
    {
      number: '4',
      title: 'Prototype (Membuat Prototipe / Draf)',
      icon: <Palette className="w-5 h-5 text-fuchsia-500" />,
      color: 'border-fuchsia-200 bg-fuchsia-50/60 text-fuchsia-900',
      description: 'Buat draf nyata dari aset yang direncanakan: draf poster Canva/Figma, rundown visual, buku panduan, atau tata letak panggung.',
      actionPoint: 'Pembuatan draf awal sebelum diproduksi massal/dicetak.',
    },
    {
      number: '5',
      title: 'Test & Feedback (Menguji & Evaluasi)',
      icon: <TestTube className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
      description: 'Uji keterbacaan desain, simulasi teknis bersama panitia, kumpulkan feedback dari kepala sekolah & guru, lalu lakukan perbaikan sebelum hari H.',
      actionPoint: 'Review berkala & pengisian jurnal refleksi tim.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Panduan Proses Design Thinking</h3>
              <p className="text-xs text-slate-300">5 Tahapan Standar Team Design Lazuardi TA 2025/2026</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Tujuan Design Thinking:</strong> Memastikan setiap program kerja dan inisiatif sekolah tidak hanya berjalan lancar, tetapi juga memiliki daya tarik visual yang kuat, pesan tersampaikan dengan baik, dan beban kerja guru terstruktur secara konsisten.
          </p>

          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.number} className={`p-4 rounded-xl border ${step.color} space-y-1.5`}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white font-black text-xs flex items-center justify-center shadow-2xs">
                    {step.number}
                  </div>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  {step.description}
                </p>
                <div className="text-[11px] font-semibold text-slate-900 bg-white/60 p-2 rounded-lg border border-slate-200/50">
                  🎯 <strong>Aksi Utama: </strong> {step.actionPoint}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
