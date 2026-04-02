import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── INITIALIZE CLIENTS ─────────────────────────────────────────────────────

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 },
});

let genAI = null;

// ─── HELPERS ────────────────────────────────────────────────────────────────

async function hashValue(value) {
  if (!value) return '';
  const { createHash } = await import('crypto');
  return createHash('sha256').update(value).digest('hex');
}

// ─── HEALTH CHECK ───────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    ai_configured: !!process.env.GOOGLE_API_KEY,
    mp_configured: !!process.env.MP_ACCESS_TOKEN,
  });
});

// ─── META CONVERSIONS API (CAPI) ────────────────────────────────────────────

app.post('/api/meta-capi', async (req, res) => {
  try {
    const { event, data, eventTime, sourceUrl, fbp, fbc, userAgent } = req.body;

    const pixelId = process.env.FB_PIXEL_ID || '1592455242002391';
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!accessToken) {
      console.warn('[CAPI] FB_ACCESS_TOKEN não configurado');
      return res.status(200).json({ status: 'skipped', reason: 'no_token' });
    }

    const payload = {
      data: [{
        event_name: event,
        event_time: eventTime || Math.floor(Date.now() / 1000),
        event_source_url: sourceUrl || 'https://www.paravoce.online/analise',
        action_source: 'website',
        user_data: {
          client_user_agent: userAgent || '',
          fbp: fbp || '',
          fbc: fbc || '',
          ...(data?.name && { fn: await hashValue(data.name.toLowerCase().trim()) }),
        },
        custom_data: data || {},
      }],
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (result.error) {
      console.error('[CAPI] Erro Meta:', result.error);
    } else {
      console.log(`[CAPI] Evento "${event}" enviado. events_received: ${result.events_received}`);
    }

    res.status(200).json({ status: 'ok', meta: result });
  } catch (err) {
    console.error('[CAPI] Exceção:', err.message);
    res.status(200).json({ status: 'error', message: err.message });
  }
});

// ─── AI FACE ANALYSIS ───────────────────────────────────────────────────────

app.post('/api/analyze-face', async (req, res) => {
  try {
    const { email, photos, userId } = req.body;
    console.log('User email:', email);
    console.log('Photos received:', photos ? Object.keys(photos) : 'none');

    if (!photos || (!photos.front && !photos.left && !photos.right) || !userId) {
      return res.status(400).json({ error: 'Photos (front/left/right) and UserID are required' });
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error('ERRO: GOOGLE_API_KEY não configurada no servidor.');
      return res.status(500).json({ error: 'Credenciais de IA ausentes.' });
    }

    if (!genAI) {
      genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Using model: gemini-2.5-flash');

    const parts = [
      {
        text: `IDENTIDADE: Você é uma Inteligência Artificial especialista em Rejuvenescimento Facial Natural e Dermatoscopia Estética.

TAREFA:
1. Analise estas fotos com máximo rigor técnico.
2. Identifique os PONTOS CRÍTICOS (rugas profundas, perda de tônus, flacidez tissular, ptose palpebral, etc).
3. Selecione os IDs de exercícios que tratam especificamente esses pontos.
4. NÃO INVENTE EXERCÍCIOS. Use apenas os IDs fornecidos. Priorize qualidade (3 a 5 exercícios).
5. Formate a resposta como JSON estruturado.

BANCO DE EXERCÍCIOS (IDs DISPONÍVEIS):
- rugas_testa: fb_rugas_testa_01, fb_rugas_testa_02, fb_rugas_testa_03, fb_rugas_testa_04, fb_rugas_testa_05
- pes_de_galinha: fb_pes_galinha_01, fb_pes_galinha_02, fb_pes_galinha_03, fb_pes_galinha_04
- bigode_chines: fb_bigode_chines_01, fb_bigode_chines_02, fb_bigode_chines_03, fb_bigode_chines_04, fb_bigode_chines_05
- flacidez: fb_flacidez_01, fb_flacidez_02, fb_flacidez_03, fb_flacidez_04, fb_flacidez_05
- palpebra_caida: fb_palpebra_01, fb_palpebra_02, fb_palpebra_03, fb_palpebra_04
- manchas_textura: fb_manchas_01, fb_manchas_02, fb_manchas_03, fb_manchas_04
- perda_tonus: fb_tonus_01, fb_tonus_02, fb_tonus_03, fb_tonus_04, fb_tonus_05
- papada: fb_papada_01, fb_papada_02, fb_papada_03, fb_papada_04
- olheiras: fb_olheiras_01, fb_olheiras_02, fb_olheiras_03

DEVOLVA APENAS UM JSON (SEM MARKDOWN OU TEXTO EXTRA):
{
  "visualAge": "número",
  "hydration": "0-100",
  "elasticity": "0-100",
  "spots": "0-100",
  "wrinkles": "0-100",
  "zones": { "Testa": 0, "Olhos": 0, "Sulco Nasogeniano": 0, "Mandíbula": 0, "Pescoço": 0 },
  "selectedExercises": ["id1", "id2", "id3", "id4", "id5"],
  "mainIssue": "Diagnóstico preciso em uma frase curta (estilo clínico)",
  "summary": "Resumo premium descrevendo o estado da pele e o objetivo do protocolo."
}`,
      },
    ];

    if (photos.front) {
      const base64Data = photos.front.split(',')[1] || photos.front;
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
    }
    if (photos.left) {
      const base64Data = photos.left.split(',')[1] || photos.left;
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
    }
    if (photos.right) {
      const base64Data = photos.right.split(',')[1] || photos.right;
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
    }

    const result = await model.generateContent(parts);
    const rawResponse = result.response.text();
    console.log('--- RAW AI RESPONSE ---');
    console.log(rawResponse);
    console.log('------------------------');

    let analysisResult;
    try {
      const jsonBlockMatch = rawResponse.match(/\{[\s\S]*\}/);
      const cleanJson = jsonBlockMatch ? jsonBlockMatch[0] : rawResponse;
      analysisResult = JSON.parse(cleanJson.replace(/```json|```/g, '').trim());
    } catch (parseErr) {
      console.error('FALHA CRÍTICA NO PARSING JSON:', parseErr);
      throw new Error(`A IA retornou um formato corrompido: ${parseErr.message}`);
    }

    const requiredFields = ['visualAge', 'zones', 'selectedExercises'];
    const missing = requiredFields.filter((f) => !analysisResult[f]);
    if (missing.length > 0) {
      throw new Error(`Protocolo incompleto da IA (faltando: ${missing.join(', ')})`);
    }

    // Persist to Supabase
    const payload = {
      user_id: userId,
      photo_front_url: photos.front ? 'base64_stored' : null,
      photo_left_url: photos.left ? 'base64_stored' : null,
      photo_right_url: photos.right ? 'base64_stored' : null,
      result_json: analysisResult,
      age_match: parseInt(analysisResult.visualAge) || 0,
      overall_score: parseInt(analysisResult.hydration) || 0,
    };

    const { data: insertData, error: dbError } = await supabase
      .from('analyses')
      .insert([payload])
      .select();

    if (dbError) {
      console.error('ERRO SUPABASE:', dbError.message, dbError.details);
    } else {
      console.log('✓ PERSISTÊNCIA CONFIRMADA ID:', insertData?.[0]?.id);
    }

    res.json(analysisResult);
  } catch (error) {
    console.error('ERRO NA ANÁLISE AI:', error);
    res.status(500).json({ error: 'Erro ao processar análise da IA.' });
  }
});

// ─── MERCADO PAGO WEBHOOK ────────────────────────────────────────────────────

app.post('/api/webhook', async (req, res) => {
  try {
    console.log('Webhook received:', req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// ─── VERCEL SERVERLESS EXPORT ────────────────────────────────────────────────

export default app;
