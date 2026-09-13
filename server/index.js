const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
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

// ─── Allowed Origins Whitelist ──────────────────────────────
const allowedOrigins = [
  'https://anuragsahu.com',
  'https://www.anuragsahu.com',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

// ─── Security Middleware ────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, origin);
      }
      return callback(new Error('CORS access denied: origin not allowed.'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Cookie & Body Parsing ─────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── CSRF Origin Check for State-Changing Requests ──────────
app.use((req, res, next) => {
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (isStateChanging && (req.originalUrl.includes('/admin') || req.originalUrl.includes('/auth'))) {
    const origin = req.headers['origin'] || (req.headers['referer'] ? new URL(req.headers['referer']).origin : null);
    if (req.cookies && req.cookies.as_admin_token && origin) {
      if (!allowedOrigins.includes(origin) && process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'CSRF_BLOCKED',
            message: 'Cross-site request blocked.',
          },
        });
      }
    }
  }
  next();
});

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

// ─── Static File Serving ────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

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
  const { initSchedulerWorker } = require('./services/schedulerService');
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 ANURAG SAHU CONTROL CENTER & BACKEND CMS ONLINE`);
    console.log(`   Port:     http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/api/health`);
    console.log(`   Public:   http://localhost:${PORT}/api/public/projects`);
    console.log(`   Admin:    http://localhost:${PORT}/api/admin/projects`);
    console.log(`==================================================\n`);

    // Start background scheduler worker
    initSchedulerWorker({ intervalMs: 30000 });
  });
}

module.exports = app;
