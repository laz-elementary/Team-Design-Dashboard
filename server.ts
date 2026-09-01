import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI instance
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Design Thinking Assistant endpoint
app.post("/api/ai/design-thinking-assist", async (req, res) => {
  try {
    const { teamName, prokerTitle, currentStage, problemOrReflection, promptType } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Return smart fallback guidance if no API key is set
      return res.json({
        success: true,
        isFallback: true,
        advice: `[Saran Design Thinking Tim ${teamName || "Design"}]\n\n1. **Empathize & Define**: Lakukan observasi cepat dan dengarkan kebutuhan riil guru, panitia, atau siswa terkait ${prokerTitle || "kegiatan ini"}.\n2. **Ideate**: Buat 2-3 alternatif konsep visual dan alur yang fresh tanpa memberatkan tim.\n3. **Prototype**: Mulai dengan draf cepat (sketsa Canva/Figma atau rundown visual singkat) untuk dimintakan persetujuan awal.\n4. **Action Next**: Tentukan checklist tugas spesifik untuk tiap anggota agar beban kerja merata.`,
      });
    }

    let prompt = "";
    if (promptType === "reflection_analysis") {
      prompt = `Anda adalah konsultan pendidikan dan design management expert untuk sekolah.
Analisis refleksi kegiatan dari Tim "${teamName}" untuk program kerja "${prokerTitle}".
Konteks / Kendala / Catatan Refleksi: "${problemOrReflection}".

Berikan respon profesional, suportif, dan aplikatif dalam bahasa Indonesia dengan format terstruktur:
1. **Apresiasi & Kekuatan**: Hal positif yang patut dipertahankan.
2. **Diagnosa Masalah (Design Thinking Insight)**: Akar masalah utama (komunikasi, timeline, teknis desain, atau alokasi tim).
3. **Rekomendasi Tindakan Konkret (Next Steps)**: 3 langkah taktis dan terukur untuk pelaksanaan berikutnya.
4. **Tips Keseimbangan Beban Tim**: Cara agar anggota tidak burnout dan tetap termotivasi.`;
    } else {
      prompt = `Anda adalah mentor strategi "Team Design Sekolah" berbasis Design Thinking (Empathize, Define, Ideate, Prototype, Test).
Tim: "${teamName}"
Program Kerja: "${prokerTitle}"
Tahap Saat Ini: "${currentStage || "Ideate"}"
Tantangan/Pertanyaan: "${problemOrReflection || "Bagaimana merancang program kerja ini agar menarik, bermakna, dan terlaksana efisien?"}"

Berikan arahan taktis dalam bahasa Indonesia:
1. **Fokus Tahap ${currentStage || "Ini"}**: Apa yang harus diselesaikan segera.
2. **Ide Kreatif & Inovasi Visual/Fungsional**: Ide visual & praktis yang relevan untuk sekolah.
3. **Checklist Kesiapan Tim**: 3-4 butir checklist tugas untuk dibagikan ke anggota tim.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah asisten cerdas Team Design Management Dashboard untuk sekolah (Lazuardi School TA 2025/2026). Respon Anda selalu terstruktur, praktis, memberi semangat, dan berorientasi pada aksi nyata kolaboratif.",
      },
    });

    res.json({
      success: true,
      advice: response.text || "Tidak ada respon yang dihasilkan.",
    });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Gagal memproses rekomendasi AI.",
    });
  }
});

// Vite Middleware Integration
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Team Design Dashboard server listening on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
