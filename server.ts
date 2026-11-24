import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { analyzeLocallyFallback, inspectUrl, normalizeScanResult } from './src/utils/scamRules.ts';
import type { Language, ScanMode } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const LANGUAGE_NAME: Record<Language, string> = {
  en: 'English (simple, warm, reassuring Indian English)',
  hi: 'Hindi (Devanagari script, polite and respectful using "आप")',
  mr: 'Marathi (Devanagari script, polite and respectful using "तुम्ही")',
};

const SCAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    verdict: {
      type: Type.STRING,
      description: 'Must be exactly one of: SAFE, CAUTION, SCAM',
    },
    riskScore: {
      type: Type.INTEGER,
      description: 'Risk score from 0 (completely safe) to 100 (confirmed high-risk scam)',
    },
    scamCategory: {
      type: Type.STRING,
      description: 'Short category name like Fake KYC / Bank Impersonation, Digital Arrest Scam, Electricity Bill Fraud, or Legitimate Message',
    },
    sourceAuthenticity: {
      type: Type.STRING,
      description: 'Plain-language assessment of the sender, domain, or caller claim',
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 4 short, simple bullet points explaining why this is safe, risky, or a scam',
    },
    whatToDoNext: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 immediate, clear actionable steps for an Indian senior citizen',
    },
    simpleExplanation: {
      type: Type.STRING,
      description: 'Exactly 2 warm, reassuring sentences written at a 6th-grade reading level in the target language',
    },
  },
  required: [
    'verdict',
    'riskScore',
    'scamCategory',
    'sourceAuthenticity',
    'redFlags',
    'whatToDoNext',
    'simpleExplanation',
  ],
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'suraksha-sathi' });
  });

  app.post('/api/scan', async (req, res) => {
    const mode = (req.body?.mode || 'message') as ScanMode;
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    const imageBase64 = typeof req.body?.imageBase64 === 'string' ? req.body.imageBase64 : '';
    const imageMimeType = typeof req.body?.imageMimeType === 'string' ? req.body.imageMimeType : 'image/png';
    const language: Language = ['en', 'hi', 'mr'].includes(req.body?.language) ? req.body.language : 'en';

    if (!content && !imageBase64) {
      res.status(400).json({ error: 'Please enter a message, website link, call note, or upload a screenshot.' });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallback = analyzeLocallyFallback({
        mode,
        content,
        hasImage: Boolean(imageBase64),
        language,
      });
      res.json({
        result: {
          ...fallback,
          engine: 'local',
          engineNote: 'Analyzed with Suraksha Sathi offline cyber-safety pattern shield.',
        },
      });
      return;
    }

    try {
      const urlNote =
        mode === 'link'
          ? `\nDeterministic URL inspection notes: ${JSON.stringify(inspectUrl(content))}`
          : '';

      const systemInstruction = `You are Suraksha Sathi, a warm, trustworthy cyber-safety guardian built for Indian senior citizens and their families.
Analyze the user's submitted ${mode} carefully for Indian cybercrime patterns (MSEB/Mahavitaran electricity disconnection SMS, fake SBI/HDFC/ICICI KYC links, CBI/Mumbai Police "Digital Arrest" calls, fake UPI Collect/Cashback PIN traps, fake wedding invite .apk files, fake pension/life-certificate calls, customs parcel scams, or genuine bank OTP/legitimate official URLs).

CRITICAL RULES:
- Respond ONLY with valid JSON matching the schema.
- Every human-readable field (scamCategory, sourceAuthenticity, redFlags, whatToDoNext, simpleExplanation) MUST be written in ${LANGUAGE_NAME[language]}.
- "verdict" MUST always remain one of the exact English enum strings: "SAFE", "CAUTION", or "SCAM".
- Write simpleExplanation as 2 warm, calm, reassuring sentences at a 6th-grade reading level. Never panic the senior; empower them.
- Keep redFlags to 3-4 concise points and whatToDoNext to 2-3 clear steps (including mentioning Helpline 1930 if SCAM).`;

      const promptText = `Scan Mode: ${mode}
Submitted Content: ${content || '(User uploaded a screenshot image for visual scam inspection)'}${urlNote}

Analyze this thoroughly and return the structured safety verdict JSON in ${LANGUAGE_NAME[language]}.`;

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        parts.push({
          inlineData: {
            mimeType: imageMimeType,
            data: cleanBase64,
          },
        });
      }
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          responseMimeType: 'application/json',
          responseSchema: SCAN_RESPONSE_SCHEMA,
        },
      });

      const rawText = (response.text || '').trim();
      const parsed = JSON.parse(rawText);
      const normalized = normalizeScanResult(
        {
          ...parsed,
          engine: 'gemini',
          engineNote: 'Verified with Suraksha Sathi AI Deep Reasoning Shield.',
        },
        language
      );

      res.json({ result: normalized });
    } catch (err) {
      console.error('Gemini scan fallback triggered:', err instanceof Error ? err.message : err);
      const fallback = analyzeLocallyFallback({
        mode,
        content,
        hasImage: Boolean(imageBase64),
        language,
      });
      res.json({
        result: {
          ...fallback,
          engine: 'local',
          engineNote: 'AI service busy — verified instantly with Suraksha Sathi local scam shield.',
        },
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Suraksha Sathi server running at http://localhost:${PORT}`);
  });
}

startServer();
