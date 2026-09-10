/**
 * ANTI GRAVITY PORTFOLIO — VERCEL SERVERLESS API HANDLER
 * Exports Express server application as a Vercel serverless function.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('../server/config/db');

// Import routes
const authRoutes = require('../server/routes/authRoutes');
const contactRoutes = require('../server/routes/contactRoutes');
const analyticsRoutes = require('../server/routes/analyticsRoutes');
const adminRoutes = require('../server/routes/adminRoutes');
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
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Register routes with dual mounting (/api and root) for Vercel serverless flexibility
[authRoutes, contactRoutes, analyticsRoutes, adminRoutes, projectRoutes, skillRoutes, educationRoutes, roadmapRoutes, socialLinkRoutes, settingsRoutes].forEach(route => {
  app.use('/api', route);
  app.use('/', route);
});

app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    success: true,
    status: 'online',
    system: 'ANTI GRAVITY BACKEND ENGINE (SERVERLESS)',
    candidate: 'Anurag Sahu',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

module.exports = app;
