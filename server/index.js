require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const config = require('./config/emailConfig');
const errorHandler = require('./middleware/errorHandler');
const { publicLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
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
app.use(cors({
  origin: true, // Allow all origins for seamless developer control center access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Global Rate Limiter ───────────────────────────────────
app.use('/api', publicLimiter);

// ─── API Routes ────────────────────────────────────────────
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

// ─── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    system: 'ANTI GRAVITY BACKEND ENGINE v3.0',
    candidate: 'Anurag Sahu',
    email: process.env.RECIPIENT_EMAIL || 'shivasahu0612@gmail.com',
    database: 'MongoDB / Mongoose',
    auth: 'JWT / bcrypt',
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ───────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Centralized Error Handler (must be last) ──────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 ANTI GRAVITY BACKEND v3.0 ONLINE`);
  console.log(`   Port:     http://localhost:${PORT}`);
  console.log(`   Health:   http://localhost:${PORT}/api/health`);
  console.log(`   Projects: http://localhost:${PORT}/api/projects`);
  console.log(`   Skills:   http://localhost:${PORT}/api/skills`);
  console.log(`   Admin:    http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`==================================================\n`);
});
