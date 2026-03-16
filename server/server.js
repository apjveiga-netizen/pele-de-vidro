import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Initialize MP Client with env variable
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN, 
    options: { timeout: 5000 } 
});

// DB Setup
const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    credits INTEGER DEFAULT 0,
    password TEXT,
    name TEXT,
    age INTEGER,
    avatar_url TEXT
  )`);
  
  // Ensure columns exist for existing DBs
  const columns = ['password', 'name', 'age', 'avatar_url'];
  columns.forEach(col => {
    db.run(`ALTER TABLE users ADD COLUMN ${col} ${col === 'age' ? 'INTEGER' : 'TEXT'}`, (err) => {
      // Ignore if column exists
    });
  });
});

const plans = {
  'BÁSICO': { price: 47, credits: 1 },
  'PRÓ': { price: 97, credits: 3 },
  'PREMIUM': { price: 117, credits: 10 }
};

app.post('/api/checkout', async (req, res) => {
  try {
    const { email, planName } = req.body;
    if (!email || !planName || !plans[planName]) {
      return res.status(400).json({ error: 'Email and valid planName are required' });
    }

    // Upsert user if not exists
    db.run(`INSERT OR IGNORE INTO users (email, credits) VALUES (?, 0)`, [email]);

    const plan = plans[planName];

    // Create Preference
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: planName,
            title: `Pacote de Créditos - ${planName}`,
            quantity: 1,
            unit_price: parseFloat(plan.price),
            currency_id: 'BRL'
          }
        ],
        payer: {
          email: email
        },
        metadata: {
          email: email,
          planName: planName,
          credits: plan.credits
        },
        back_urls: {
          success: 'http://localhost:5173/dashboard',
          failure: 'http://localhost:5173/offer',
          pending: 'http://localhost:5173/offer'
        },
        auto_return: 'approved',
        // In local development we can't easily receive webhooks without ngrok.
        // For production, configure the notification_url.
      }
    });

    res.json({ init_point: result.init_point });
  } catch (error) {
    console.error("ERRO MERCADO PAGO:", error);
    if (error.response) {
      console.error("DETALHES DO ERRO:", error.response);
    }
    res.status(500).json({ error: 'Error creating checkout preference', details: error.message });
  }
});

app.post('/api/webhook', async (req, res) => {
  try {
    console.log("Webhook received:", req.body);
    // Real implementation would verify the webhook and payment status here
    // based on req.query.id and topic="payment"
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Since local webhooks are hard, let's create a hacky endpoint to simulate payment success for testing
app.post('/api/simulate-payment', (req, res) => {
  const { email, planName } = req.body;
  if (!email || !plans[planName]) return res.sendStatus(400);
  
  const creditsToAdd = plans[planName].credits;
  db.run(`UPDATE users SET credits = credits + ? WHERE email = ?`, [creditsToAdd, email], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ success: true, added: creditsToAdd });
  });
});

app.get('/api/credits/:email', (req, res) => {
  const { email } = req.params;
  db.get(`SELECT credits FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ credits: row ? row.credits : 0 });
  });
});

app.post('/api/use_credit', (req, res) => {
  const { email } = req.body;
  db.get(`SELECT credits FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row || row.credits <= 0) return res.status(400).json({ error: 'No credits available' });
    
    db.run(`UPDATE users SET credits = credits - 1 WHERE email = ?`, [email], function(err) {
      if (err) return res.status(500).json({error: err.message});
      res.json({ success: true, remaining: row.credits - 1 });
    });
  });
});

// Authentication Endpoints
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if user exists (purchased)
    db.get(`SELECT email, credits FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Rigorous check: only allow if they have credits (paid) or already exists
      if (row && row.credits > 0) {
        db.run(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, message: 'Acesso configurado! Use seu e-mail e senha para entrar.' });
        });
      } else {
        res.status(403).json({ error: 'E-mail não autorizado. Por favor, use o e-mail utilizado na compra do produto.' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar segurança' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado. Use o e-mail da compra.' });
    if (!user.password) return res.status(401).json({ error: 'Primeiro acesso? Clique em "Definir Senha" abaixo.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

    res.json({ 
      success: true, 
      user: { email: user.email, credits: user.credits } 
    });
  });
});

app.post('/api/change-password', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  db.get(`SELECT password FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) return res.status(401).json({ error: 'Senha atual incorreta' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    db.run(`UPDATE users SET password = ? WHERE email = ?`, [hashedNewPassword, email], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: 'Senha alterada com sucesso' });
    });
  });
});

app.get('/api/profile/:email', (req, res) => {
  const { email } = req.params;
  db.get(`SELECT email, credits, name, age, avatar_url FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(row);
  });
});

app.post('/api/profile/update', (req, res) => {
  const { email, name, age } = req.body;
  db.run(`UPDATE users SET name = ?, age = ? WHERE email = ?`, [name, age, email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  const { email } = req.body;
  if (!req.file || !email) return res.status(400).json({ error: 'Arquivo e e-mail são obrigatórios' });

  const avatarUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  db.run(`UPDATE users SET avatar_url = ? WHERE email = ?`, [avatarUrl, email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, avatarUrl });
  });
});

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0a0a0a; color: #c9a96e; min-height: 100vh;">
      <h1>Servidor Pele de Vidro Ativo</h1>
      <p style="color: #888;">Backend processando pagamentos via Mercado Pago</p>
      <div style="margin-top: 20px; padding: 20px; border: 1px solid #c9a96e; display: inline-block; border-radius: 10px;">
        Status da Integração: <strong>CONECTADO</strong>
      </div>
    </div>
  `);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
