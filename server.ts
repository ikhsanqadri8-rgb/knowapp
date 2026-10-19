import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'KNOW',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Gemini AI Recommendations Endpoint
app.post('/api/gemini/recommendations', async (req: Request, res: Response) => {
  try {
    const { sessionId, className, gradeLevel, major, responsesSummary, teacherContext } = req.body;

    if (!sessionId || !className) {
      return res.status(400).json({
        error: 'Parameter tidak lengkap: sessionId dan className wajib disertakan.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di lingkungan server. Silakan set kunci API pada panel Secrets AI Studio.'
      });
    }

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Anda adalah Spesialis Pembelajaran dan Pedagogi Pendidikan Vokasi (SMK) Informatika untuk platform KNOW (Interactive Diagnostic Assessment & Learning Insights Platform).

Tugas Anda:
Menganalisis bukti respons asesmen diagnostik murid dan menghasilkan rekomendasi strategi pembelajaran yang berbasis bukti untuk guru.

Prinsip Etika & Pedagogis Wajib:
1. Dasarkan analisis HANYA pada data respons dan indikator yang diberikan. Jangan mengarang skor atau data murid.
2. Bedakan antara fakta respons empiris dan interpretasi pedagogis.
3. JANGAN PERNAH memberikan label permanen, peyoratif, atau kaku seperti "murid lemah", "lambat", "tidak berbakat", atau klaim pseudo-ilmiah seperti "tipe visual/auditori murni".
4. Gunakan pendekatan Teaching at the Right Level (TaRL), Scaffolding & Zone of Proximal Development (ZPD), Pembelajaran Berdiferensiasi (konten, proses, produk), dan Universal Design for Learning (UDL).
5. Jika bukti belum mencukupi untuk suatu indikator, nyatakan secara eksplisit "Data belum cukup untuk menarik kesimpulan indikator ini".
6. Rekomendasi harus realistis dan dapat diterapkan dalam konteks SMK (Informatika / RPL / TKJ / Bisnis Digital).
7. Format keluaran HARUS JSON murni tanpa markdown pembungkus (backtick).`;

    const prompt = `Analisis data asesmen diagnostik berikut untuk Kelas: ${className} (${gradeLevel || 'Kelas X'}, Jurusan: ${major || 'Informatika'}).

Konteks Guru: ${teacherContext || 'Merancang strategi pembelajaran awal semester berdasarkan kesiapan, minat, preferensi aktivitas, dan kebutuhan dukungan murid.'}

Ringkasan Bukti Respons Asesmen:
${JSON.stringify(responsesSummary, null, 2)}

Format JSON yang wajib dihasilkan:
{
  "executiveSummary": "Ringkasan eksekutif 2-3 paragraf mengenai kesiapan awal murid di kelas ini berdasarkan bukti empiris.",
  "observedPatterns": [
    {
      "dimension": "Kemampuan Awal | Minat & Konteks | Preferensi Aktivitas | Kebutuhan Dukungan",
      "pattern": "Deskripsi pola yang teramati",
      "evidenceSummary": "Bukti konkret dari data pengerjaan murid"
    }
  ],
  "misconceptions": [
    {
      "concept": "Konsep yang menjadi tantangan",
      "observedError": "Bentuk kesalahan atau miskonsepsi yang sering muncul",
      "suggestedCorrection": "Tindakan guru untuk meluruskan pemahaman"
    }
  ],
  "suggestedStrategies": [
    {
      "title": "Nama strategi konkret",
      "rationale": "Alasan pedagogis berbasis TaRL / Scaffolding / UDL",
      "actionSteps": ["Langkah 1", "Langkah 2", "Langkah 3"],
      "differentiationType": "Konten | Proses | Produk | Lingkungan Belajar"
    }
  ],
  "tarlGrouping": {
    "readyForExtension": ["Nama murid atau kriteria pengelompokan yang sudah mandiri"],
    "needGuidedPractice": ["Nama murid atau kriteria yang memerlukan latihan terarah"],
    "needIntensiveScaffolding": ["Nama murid atau kriteria yang memerlukan pendampingan intensif"],
    "groupingStrategy": "Rasional pengelompokan fleksibel untuk 1-2 pekan pertama"
  },
  "scaffoldingSteps": [
    "Langkah scaffolding bertahap 1",
    "Langkah scaffolding bertahap 2",
    "Langkah scaffolding bertahap 3"
  ],
  "limitations": "Catatan keterbatasan data asesmen diagnostik ini."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Tidak ada respons yang diterima dari Gemini API.');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      // Clean possible markdown code fence
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedResult,
      generatedAt: new Date().toISOString(),
      model: 'gemini-2.5-flash'
    });
  } catch (error: any) {
    console.error('Error generating AI recommendations:', error);
    const errorMessage = error?.message || 'Gagal memproses rekomendasi AI.';
    return res.status(500).json({
      error: errorMessage,
      details: error?.status || 'INTERNAL_ERROR'
    });
  }
});

// Vite or Static file middleware
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, host, () => {
    console.log(`[KNOW Server] Running at http://${host}:${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

setupServer().catch((err) => {
  console.error('[KNOW Server] Fatal error starting server:', err);
  process.exit(1);
});
