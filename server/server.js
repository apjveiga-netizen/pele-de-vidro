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
app.use(express.json({ limit: '10mb' })); // Allow high-res photo uploads
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Ou gemini-1.5-flash

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
        text: `Você é uma esteticista facial premium. Analise estas 3 fotos (Frente, Esquerda, Direita). 
        
        TAREFA: 
        1. Gere um diagnóstico técnico detalhado.
        2. PONTE DE PROTOCOLO: Com base nos problemas identificados, selecione EXATAMENTE entre 5 a 6 exercícios do banco abaixo que melhor tratam as patologias da cliente. 
        
        BANCO DE EXERCÍCIOS DISPONÍVEIS: 
        - rugas_testa: fb_rugas_testa_01 até 05
        - pes_de_galinha: fb_pes_galinha_01 até 04
        - bigode_chines: fb_bigode_chines_01 até 05
        - flacidez: fb_flacidez_01 até 05
        - palpebra_caida: fb_palpebra_01 até 04
        - manchas_textura: fb_manchas_01 até 04
        - perda_tonus: fb_tonus_01 até 05
        - papada: fb_papada_01 até 04
        - olheiras: fb_olheiras_01 até 03

        DEVOLVA APENAS UM JSON (sem markdown):
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
    const responseText = result.response.text();
    
    // Clean potential markdown from response
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const analysisResult = JSON.parse(jsonString);
    console.log("Análise Gemini concluída com sucesso!");
    console.log("Análise concluída com sucesso!");

    // Save to Supabase
    const { data, error } = await supabase
      .from('analyses')
      .insert([
        { 
          user_id: userId,
          photo_url: "upload_placeholder", // In a real production, you'd save the S3/Supabase Storage link
          result: analysisResult
        }
      ]);

    if (error) throw error;

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
