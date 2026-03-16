import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import OpenAI from 'openai';
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const mpClient = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN, 
    options: { timeout: 5000 } 
});

// ─── AI ANALYSIS ENDPOINT ───────────────────────────────────────────

app.post('/api/analyze-face', async (req, res) => {
  try {
    const { email, photoBase64, userId } = req.body;
    
    if (!photoBase64 || !userId) {
      return res.status(400).json({ error: 'Photo and UserID are required' });
    }

    console.log(`Iniciando análise AI para usuário: ${userId}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-vision-2024-07-18",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analise esta foto facial com extrema precisão estética. Devolva APENAS um objeto JSON com estes campos (use apenas números para as pontuações de 0 a 100):
              {
                "visualAge": "número estimado",
                "hydration": "0-100",
                "elasticity": "0-100",
                "spots": "0-100 (mais baixo é melhor)",
                "wrinkles": "0-100 (mais baixo é melhor)",
                "mainIssue": "uma frase curta descrevendo o maior problema",
                "summary": "um parágrafo curto de 3 frases com o diagnóstico geral em tom premium de consultoria"
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: photoBase64 // Expecting data:image/jpeg;base64,...
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const analysisResult = JSON.parse(response.choices[0].message.content);
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
    console.error("ERRO NA ANÁLISE AI:", error);
    res.status(500).json({ error: 'Erro ao processar análise da IA. Verifique sua chave da OpenAI e créditos.' });
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
export default app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}
