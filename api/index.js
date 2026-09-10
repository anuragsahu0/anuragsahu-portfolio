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

const app = express();

// Ensure DB Connection on serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {}
  next();
});

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
