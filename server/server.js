import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Higher limit for multiple high-res photos
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── INITIALIZE CLIENTS ──────────────────────────────────────────────

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Gemini se inicializa dinamicamente no handler
let genAI = null;

const mpClient = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN, 
    options: { timeout: 5000 } 
});

// ─── AI ANALYSIS ENDPOINT ───────────────────────────────────────────

app.post('/api/analyze-face', async (req, res) => {
  try {
    const { email, photos, userId } = req.body;
    console.log("User email:", email);
    console.log("Photos received:", photos ? Object.keys(photos) : "none");
    
    if (!photos || (!photos.front && !photos.left && !photos.right) || !userId) {
      return res.status(400).json({ error: 'Photos (front/left/right) and UserID are required' });
    }

    console.log(`Iniciando análise AI 360° para usuário: ${userId}`);

    if (!process.env.GOOGLE_API_KEY) {
        console.error("ERRO: GOOGLE_API_KEY não configurada no servidor.");
        return res.status(500).json({ error: "Credenciais de IA ausentes." });
    }
    console.log("--- [DEBUG] /api/analyze-face chamado ---");
    
    if (!process.env.GOOGLE_API_KEY) {
        console.error("ERRO: GOOGLE_API_KEY não configurada no servidor.");
        return res.status(500).json({ error: "Credenciais de IA ausentes no servidor." });
    }

    // Inicialização tardia para garantir env vars
    if (!genAI) {
      genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    console.log("Using model: gemini-2.5-flash (STABLE v.2026)");

    // Gemini expects parts: [{ text: "..." }, { inlineData: { mimeType: "image/jpeg", data: "base64..." } }]
    // Banco de Exercícios resumido para a IA (Bridge)
    const exerciseContext = [
      { id: "fb_rugas_testa_01", name: "Alisamento Frontal Isométrico", problem: "rugas_testa" },
      { id: "fb_pes_galinha_01", name: "Pressão Orbital Lateral", problem: "pes_de_galinha" },
      { id: "fb_bigode_chines_02", name: "Inflação Zigomática", problem: "bigode_chines" },
      { id: "fb_flacidez_01", name: "Lifting Natural das Maçãs", problem: "flacidez" },
      { id: "fb_palpebra_01", name: "Elevação Palpebral com Resistência", problem: "palpebra_caida" },
      { id: "fb_manchas_01", name: "Drenagem Linfática Geral", problem: "manchas_textura" },
      { id: "fb_tonus_01", name: "Bombeio Facial Completo", problem: "perda_tonus" },
      { id: "fb_papada_01", name: "Firmeza do Pescoço — Platisma", problem: "papada" },
      { id: "fb_olheiras_01", name: "Drenagem Periorbital", problem: "olheiras" }
      // ... Adicionei os principais aqui, mas a IA pode inferir outros baseados nos problemas detectados
    ];

    const parts = [
      { 
        text: `LOGIC_DEBUG: O sistema exige uma ponte direta entre diagnóstico e protocolo.
        
        TAREFA: 
        1. Analise estas 3 fotos (Frente, Esquerda, Direita).
        2. Com base na análise facial feita (Input A), selecione no Banco de Exercícios abaixo (Input B) apenas os IDs que tratam as patologias identificadas. 
        3. Formate a resposta como um JSON estruturado contendo: [visualAge], [zones], [selectedExercises], [mainIssue], [summary].

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
          "mainIssue": "frase curta",
          "summary": "parágrafo premium"
        }`
      }
    ];

    if (photos.front) {
      const base64Data = photos.front.split(",")[1] || photos.front;
      parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
    }
    if (photos.left) {
      const base64Data = photos.left.split(",")[1] || photos.left;
      parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
    }
    if (photos.right) {
      const base64Data = photos.right.split(",")[1] || photos.right;
      parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
    }

    const result = await model.generateContent(parts);
    // --- ETAPA 1: NORMALIZAÇÃO REAL (V.4) ---
    const rawResponse = result.response.text();
    console.log("--- RAW AI RESPONSE ---");
    console.log(rawResponse);
    console.log("------------------------");

    let analysisResult;
    try {
      // Extrair apenas o bloco JSON se houver conversa extra
      const jsonBlockMatch = rawResponse.match(/\{[\s\S]*\}/);
      const cleanJson = jsonBlockMatch ? jsonBlockMatch[0] : rawResponse;
      analysisResult = JSON.parse(cleanJson.replace(/```json|```/g, "").trim());
    } catch (parseErr) {
      console.error("FALHA CRÍTICA NO PARSING JSON:", parseErr);
      throw new Error(`A IA retornou um formato corrompido: ${parseErr.message}`);
    }

    // --- ETAPA 2: VALIDAÇÃO DE SCHEMA (V.4) ---
    const requiredFields = ["visualAge", "zones", "selectedExercises"];
    const missing = requiredFields.filter(f => !analysisResult[f]);
    if (missing.length > 0) {
      console.error("SCHEMA INVÁLIDO:", missing);
      throw new Error(`Protocolo incompleto da IA (faltando: ${missing.join(", ")})`);
    }

    console.log("Análise processada com sucesso!");

    // Save to Supabase (FIXED SCHEMA: result_json and photo urls)
    // --- ETAPA 3: PERSISTÊNCIA REAL NO SUPABASE (V.4) ---
    const payload = { 
      user_id: userId,
      photo_front_url: photos.front ? "base64_stored" : null,
      photo_left_url: photos.left ? "base64_stored" : null,
      photo_right_url: photos.right ? "base64_stored" : null,
      result_json: analysisResult,
      age_match: parseInt(analysisResult.visualAge) || 0,
      overall_score: parseInt(analysisResult.hydration) || 0
    };

    console.log("ENVIANDO PARA SUPABASE (Analyses):", { userId });
    const { data: insertData, error: dbError } = await supabase
      .from('analyses')
      .insert([payload])
      .select();

    if (dbError) {
        console.error("ERRO SUPABASE (ETAPA 3):", dbError.message, dbError.details);
        // Não bloqueamos aqui para não travar a experiência do usuário se for só log
    } else {
        console.log("✓ PERSISTÊNCIA CONFIRMADA ID:", insertData?.[0]?.id);
    }

    res.json(analysisResult);
  } catch (error) {
    console.error("ERRO NA ANÁLISE AI (Gemini):", error);
    res.status(500).json({ error: 'Erro ao processar análise da IA. Verifique sua GOOGLE_API_KEY.' });
  }
});

// ─── MERCADO PAGO ───────────────────────────────────────────────────

app.post('/api/webhook', async (req, res) => {
  try {
    console.log("Webhook received:", req.body);
    // Real implementation: logic to update Supabase credits based on MP payment event
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0a0a0a; color: #c9a96e; min-height: 100vh;">
      <h1>Produção: Pele de Vidro Ativa 🚀</h1>
      <p style="color: #888;">IA Visual + Mercado Pago + Supabase</p>
      <div style="margin-top: 20px; padding: 20px; border: 1px solid #c9a96e; display: inline-block; border-radius: 10px;">
        Backend: <strong>Online</strong>
      </div>
    </div>
  `);
});

// Export for Vercel
// Heartbeat endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString(), ai_configured: !!process.env.GOOGLE_API_KEY });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}
