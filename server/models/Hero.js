const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema(
  {
    mainHeading: {
      type: String,
      required: true,
      trim: true,
      default: 'ENGINEERING INTELLIGENT SYSTEMS',
    },
    highlightedText: {
      type: String,
      trim: true,
      default: 'FROM ZERO TO PRODUCTION',
    },
    subtitle: {
      type: String,
      trim: true,
      default: 'Anurag Sahu — Computer Science Engineer & Full-Stack Developer',
    },
    description: {
      type: String,
      trim: true,
      default:
        'Passionate about building production-grade full-stack platforms, deterministic financial engines, and modern distributed systems.',
    },
    primaryCtaLabel: {
      type: String,
      trim: true,
      default: 'Explore Flagship AI System',
    },
    primaryCtaUrl: {
      type: String,
      trim: true,
      default: '/AI-FINANCE-CONTROLLER',
    },
    secondaryCtaLabel: {
      type: String,
      trim: true,
      default: 'Download Resume',
    },
    secondaryCtaUrl: {
      type: String,
      trim: true,
      default: '/assets/resume.pdf',
    },
    profileImage: {
      type: String,
      default: '/assets/anurag-portrait-sm.webp',
    },
    availabilityBadge: {
      type: String,
      trim: true,
      default: 'OPEN TO INTERNSHIP OPPORTUNITIES',
    },
    supportingText: {
      type: String,
      trim: true,
      default: 'B.Tech CSE (AI & ML) • 2022–2026',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
