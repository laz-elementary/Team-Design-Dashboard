import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2, Lightbulb } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { TeamCategory } from '../types';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamCategory[];
  initialContext?: { teamName?: string; prokerTitle?: string };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  teams,
  initialContext,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: initialContext?.prokerTitle 
        ? `Halo! Saya AI Konsultan Program Sekolah. Terkait **${initialContext.prokerTitle}** (${initialContext.teamName || 'Tim'}), ada kendala atau rancangan yang ingin didiskusikan solusinya?`
        : `Halo Kepala Sekolah & Koordinator! Saya AI Asisten Monitoring Team Design. Saya siap membantu menganalisis kendala tim, memberikan rekomendasi solusi bottleneck, menyusun feedback refleksi, atau merancang milestone program baru.`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || input;
    if (!text.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build context of teams & issues
      const issuesSummary = teams.flatMap(t => 
        t.prokers.filter(p => p.issue?.hasIssue).map(p => `- [${t.shortName}] ${p.title} (PIC: ${p.pic}): ${p.issue?.description}`)
      ).join('\n');

      const systemPrompt = `Anda adalah AI Educational Leadership & Project Management Consultant untuk Kepala Sekolah & Koordinator Team Design Sekolah.
Data Sekolah Saat Ini:
- Tim Aktif: ${teams.map(t => `${t.shortName} (${t.prokers.length} proker)`).join(', ')}
- Kendala Aktif Saat Ini:
${issuesSummary || 'Tidak ada kendala berat saat ini.'}

Prinsip Anda:
1. Berikan rekomendasi manajerial yang solutif, empatik, dan praktis bagi Kepala Sekolah dan guru.
2. Jangan menghakimi guru, bantu carikan win-win solution (redistribusi tugas, penyesuaian timeline, fasilitasi sarana).
3. Gunakan bahasa Indonesia yang profesional, ramah, dan terstruktur.`;

      // Lazy genai init
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      
      if (!apiKey) {
        // Fallback friendly intelligent response if no API key is set
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: `**Rekomendasi Solusi:**\n\n1. **Fasilitasi Koordinasi Terfokus**: Lakukan *stand-up meeting* 15 menit bersama PIC terkait untuk mengurai beban kerja.\n2. **Redistribusi Milestone**: Pecah deliverable besar menjadi tugas-tugas kecil harian.\n3. **Dukungan Sarana & Approval**: Kepala Sekolah dapat segera memberikan instruksi tertulis atau disposisi percepatan.\n\n*(Catatan: Masukkan GEMINI_API_KEY di Settings untuk konsultasi AI real-time tingkat lanjut).*`
            }
          ]);
          setIsLoading(false);
        }, 800);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${text}` }] }
        ]
      });

      const reply = response.text || 'Maaf, tidak dapat menghasilkan jawaban saat ini.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      console.error('Gemini error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Terjadi sedikit kendala saat menghubungi asisten AI. Silakan periksa koneksi atau API key.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">AI Project Consultant</h2>
              <p className="text-[11px] text-slate-500">Asisten Kepemimpinan & Solusi Program</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend('Bagaimana cara mengatasi kendala Sports Day dan pembagian tugasnya?')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer font-medium"
          >
            💡 Solusi Sports Day
          </button>
          <button
            onClick={() => handleSend('Rangkum kendala paling mendesak yang butuh approval Kepala Sekolah')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer font-medium"
          >
            📋 Ringkasan Kendala
          </button>
          <button
            onClick={() => handleSend('Berikan draf feedback apresiasi untuk refleksi tim Literasi')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer font-medium"
          >
            ✍️ Draf Feedback
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AI sedang menyusun analisis solusi...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan analisis program, solusi kendala, feedback..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
