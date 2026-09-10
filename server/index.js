require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, isDbConnected } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { publicLimiter } = require('./middleware/rateLimiter');

// Routes
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Backward-compatible individual resource routes
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const educationRoutes = require('./routes/educationRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const socialLinkRoutes = require('./routes/socialLinkRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// ─── Security Middleware ────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
    credentials: true,
  })
);

// ─── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Global Rate Limiter ───────────────────────────────────
app.use('/api', publicLimiter);

// ─── Health Check (No secrets exposed) ──────────────────────
const handleHealth = (req, res) => {
  res.json({
    success: true,
    status: 'online',
    system: 'ANURAG SAHU CONTROL CENTER & BACKEND CMS',
    version: '2.0.0',
    owner: 'Anurag Sahu',
    database: isDbConnected() ? 'connected' : 'fallback',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// ─── API Routes ────────────────────────────────────────────
// Public CMS Routes
app.use('/api', publicRoutes);
app.use('/', publicRoutes);

// Auth & Session
app.use('/api', authRoutes);
app.use('/', authRoutes);

// Admin CMS Routes
app.use('/api', adminRoutes);
app.use('/', adminRoutes);

// Contact & Telemetry
app.use('/api', contactRoutes);
app.use('/api', analyticsRoutes);

// Backward-compatible routes
app.use('/api', projectRoutes);
app.use('/api', skillRoutes);
app.use('/api', educationRoutes);
app.use('/api', roadmapRoutes);
app.use('/api', socialLinkRoutes);
app.use('/api', settingsRoutes);

// ─── 404 Handler ───────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found.`,
    },
  });
});

// ─── Centralized Error Handler (must be last) ──────────────
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 ANURAG SAHU CONTROL CENTER & BACKEND CMS ONLINE`);
    console.log(`   Port:     http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/api/health`);
    console.log(`   Public:   http://localhost:${PORT}/api/public/projects`);
    console.log(`   Admin:    http://localhost:${PORT}/api/admin/projects`);
    console.log(`==================================================\n`);
  });
}

module.exports = app;
