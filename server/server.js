// ═══════════════════════════════════════════════════
//  VOLTMATCH — server.js
//  Point d'entrée Express
// ═══════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const orderRouter = require('./routes/order');
const emailRouter = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS ─────────────────────────────────────────────
// Autorise uniquement le domaine frontend déclaré dans .env
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:8085').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqué pour l'origine : ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parser JSON ───────────────────────────────────
app.use(express.json());

// ── Routes ───────────────────────────────────────────
app.use('/api', orderRouter);   // POST /api/order
app.use('/api', emailRouter);   // (routes email annexes si besoin)

// ── Sanity check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Gestion des erreurs globale ───────────────────────
app.use((err, req, res, next) => {
  console.error('[VoltMatch Server Error]', err.message);
  res.status(500).json({
    error: 'Erreur serveur interne.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Démarrage ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ VoltMatch backend démarré sur http://localhost:${PORT}`);
  console.log(`   Mode : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   CORS autorisé pour : ${allowedOrigins.join(', ')}`);
});