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

// Connect DB
connectDB();

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

// Register routes
app.use('/api', authRoutes);
app.use('/api', contactRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', adminRoutes);
app.use('/api', projectRoutes);
app.use('/api', skillRoutes);
app.use('/api', educationRoutes);
app.use('/api', roadmapRoutes);
app.use('/api', socialLinkRoutes);
app.use('/api', settingsRoutes);

app.get('/api/health', (req, res) => {
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
