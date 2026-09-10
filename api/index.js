/**
 * ANURAG SAHU CONTROL CENTER & PORTFOLIO — VERCEL SERVERLESS API HANDLER
 * Exports Express server application as a Vercel serverless function.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, isDbConnected } = require('../server/config/db');

// Import routes
const publicRoutes = require('../server/routes/publicRoutes');
const adminRoutes = require('../server/routes/adminRoutes');
const authRoutes = require('../server/routes/authRoutes');
const contactRoutes = require('../server/routes/contactRoutes');
const analyticsRoutes = require('../server/routes/analyticsRoutes');

// Backward-compatible individual resource routes
const projectRoutes = require('../server/routes/projectRoutes');
const skillRoutes = require('../server/routes/skillRoutes');
const educationRoutes = require('../server/routes/educationRoutes');
const roadmapRoutes = require('../server/routes/roadmapRoutes');
const socialLinkRoutes = require('../server/routes/socialLinkRoutes');
const settingsRoutes = require('../server/routes/settingsRoutes');
const errorHandler = require('../server/middleware/errorHandler');

const cookieParser = require('cookie-parser');

const app = express();

// Ensure DB Connection on serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {}
  next();
});

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

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
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

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CSRF Origin Check for State-Changing Requests
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

// Health Check (Safe, no credentials leaked)
const handleHealth = (req, res) => {
  res.json({
    success: true,
    status: 'online',
    system: 'ANURAG SAHU CONTROL CENTER & BACKEND CMS (SERVERLESS)',
    version: '2.0.0',
    owner: 'Anurag Sahu',
    database: isDbConnected() ? 'connected' : 'fallback',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Register routes with dual mounting (/api and root) for Vercel serverless flexibility
const allRoutes = [
  publicRoutes,
  adminRoutes,
  authRoutes,
  contactRoutes,
  analyticsRoutes,
  projectRoutes,
  skillRoutes,
  educationRoutes,
  roadmapRoutes,
  socialLinkRoutes,
  settingsRoutes,
];

allRoutes.forEach((route) => {
  app.use('/api', route);
  app.use('/', route);
});

app.use(errorHandler);

module.exports = app;
