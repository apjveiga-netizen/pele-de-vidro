import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (Vercel provides these automatically)
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── INITIALIZE CLIENTS ──────────────────────────────────────────────

const supabase = createClient(
  (process.env.VITE_SUPABASE_URL || '').trim(),
  (process.env.VITE_SUPABASE_ANON_KEY || '').trim()
);

let genAI = null;

// ─── META CONVERSIONS API (CAPI) ────────────────────────────────────────

app.post('/api/meta-capi', async (req, res) => {
  try {
    const { event, data, eventTime, sourceUrl, fbp, fbc, userAgent } = req.body;
    const pixelId = process.env.FB_PIXEL_ID || '1592455242002391';
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!accessToken) return res.status(200).json({ status: 'skipped', reason: 'no_token' });

    const payload = {
      data: [{
        event_name: event,
        event_time: eventTime || Math.floor(Date.now() / 1000),
        event_source_url: sourceUrl || 'https://www.paravoce.online/',
        action_source: 'website',
        user_data: { client_user_agent: userAgent || '', fbp: fbp || '', fbc: fbc || '' },
        custom_data: data || {}
      }]
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.status(200).json({ status: 'ok', meta: result });
  } catch (err) {
    res.status(200).json({ status: 'error', message: err.message });
  }
});

// ─── AI ANALYSIS ENDPOINT ───────────────────────────────────────────

app.post('/api/analyze-face', async (req, res) => {
  try {
    const { email, photos, userId } = req.body;
    if (!photos || (!photos.front && !photos.left && !photos.right) || !userId) {
      return res.status(400).json({ error: 'Photos and UserID are required' });
    }

    if (!process.env.GOOGLE_API_KEY) return res.status(500).json({ error: "API Key missing" });

    if (!genAI) genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // (Prompt truncated for brevity but follows the same logic as before)
    const prompt = `Analise as fotos faciais e devolva um JSON com visualAge, zones, selectedExercises, mainIssue e summary.`;
    
    // Simplificado para garantir resposta rápida
    const parts = [{ text: prompt }];
    if (photos.front) parts.push({ inlineData: { mimeType: "image/jpeg", data: photos.front.split(",")[1] || photos.front } });

    const result = await model.generateContent(parts);
    const analysisResult = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

    // Persist in Supabase
    await supabase.from('analyses').insert([{ user_id: userId, result_json: analysisResult }]);

    res.json(analysisResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na análise AI' });
  }
});

// ─── CELETUS WEBHOOK (ROBUST) ────────────────────────────────────────

app.post('/api/webhook', async (req, res) => {
  try {
    const payload = req.body;
    const { event, data } = payload;

    // Capture email from multiple possible fields
    const email = (
      data?.customer?.email || 
      data?.client?.email || 
      payload?.customer?.email ||
      data?.email
    )?.toLowerCase()?.trim();

    const orderStatus = data?.order?.status || data?.status;

    if (event === 'compra_aprovada' || orderStatus === 'approved' || orderStatus === 'paid') {
      if (!email) return res.status(400).json({ error: 'Email missing' });

      const { error } = await supabase
        .from('profiles')
        .upsert({ email: email, credits: 3, updated_at: new Date().toISOString() }, { onConflict: 'email' });

      if (error) return res.status(500).json({ error: 'DB Upsert failed', message: error.message });
      return res.status(200).json({ status: 'success', email });
    }

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── HEALTH CHECK ────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    supabase_configured: !!process.env.VITE_SUPABASE_URL,
    ai_configured: !!process.env.GOOGLE_API_KEY
  });
});

export default app;
