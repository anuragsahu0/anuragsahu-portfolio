const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    // Singleton identifier
    singletonId: {
      type: String,
      default: 'global',
      unique: true,
      index: true,
    },

    // ─── General Configuration ──────────────────────────────────
    siteName: {
      type: String,
      default: 'Anurag Sahu',
      trim: true,
    },
    portfolioUrl: {
      type: String,
      default: 'https://anuragsahu.com',
      trim: true,
    },
    siteDescription: {
      type: String,
      default: 'Computer Science Engineer & Full-Stack Developer specializing in high-performance web systems and AI applications.',
      trim: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
      trim: true,
    },
    availability: {
      type: String,
      default: 'Open to Internship Opportunities',
      trim: true,
    },
    footerText: {
      type: String,
      default: '© 2026 Anurag Sahu. Engineered for performance and scale.',
      trim: true,
    },

    // ─── Branding & Icons ───────────────────────────────────────
    logoUrl: {
      type: String,
      default: '/assets/as-admin-icon.svg',
      trim: true,
    },
    faviconUrl: {
      type: String,
      default: '/assets/anurag-portrait-sm.webp',
      trim: true,
    },
    appleTouchIconUrl: {
      type: String,
      default: '/assets/anurag-portrait-sm.webp',
      trim: true,
    },

    // ─── Contact & Privacy ──────────────────────────────────────
    contactEmail: {
      type: String,
      default: 'shivasahu0612@gmail.com',
      trim: true,
    },
    contactFormEnabled: {
      type: Boolean,
      default: true,
    },
    publicEmailVisible: {
      type: Boolean,
      default: true,
    },

    // ─── Social & External Links ────────────────────────────────
    github: {
      type: String,
      default: 'https://github.com/anuragsahu0',
      trim: true,
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com/in/anuragsahu0',
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: '/assets/anurag-sahu-resume.pdf',
      trim: true,
    },

    // ─── Global SEO & Open Graph ────────────────────────────────
    seoTitle: {
      type: String,
      default: 'Anurag Sahu — Full-Stack Developer & B.Tech CSE (AI & ML) Sophomore',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: 'Portfolio of Anurag Sahu, Computer Science & Engineering (AI & ML) student specializing in Full-Stack Web Development, React, Node.js, Python, and practical Machine Learning applications. Open for Summer 2026 internships.',
      trim: true,
    },
    canonicalUrl: {
      type: String,
      default: 'https://anuragsahu.com/',
      trim: true,
    },
    keywords: {
      type: String,
      default: 'Anurag Sahu, Full-Stack Developer, AI ML Developer, React Developer, Node.js, Python, Computer Science, Portfolio, Software Engineering Intern',
      trim: true,
    },
    author: {
      type: String,
      default: 'Anurag Sahu',
      trim: true,
    },
    siteLanguage: {
      type: String,
      default: 'en',
      trim: true,
    },
    robotsDirective: {
      type: String,
      default: 'index, follow',
      trim: true,
    },
    ogTitle: {
      type: String,
      default: 'Anurag Sahu — Control Center & Developer Portfolio',
      trim: true,
    },
    ogDescription: {
      type: String,
      default: 'Explore engineering projects, interactive systems, and live telemetry for Anurag Sahu.',
      trim: true,
    },
    ogImage: {
      type: String,
      default: '/assets/anurag-portrait.webp',
      trim: true,
    },
    twitterCard: {
      type: String,
      default: 'summary_large_image',
      trim: true,
    },

    // ─── Feature Flags & Maintenance ────────────────────────────
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: 'System undergoing scheduled optimization. We will be back online shortly.',
      trim: true,
    },
    resumeButtonEnabled: {
      type: Boolean,
      default: true,
    },
    analyticsEnabled: {
      type: Boolean,
      default: true,
    },

    // Backward compatibility for generic key-value storage
    key: { type: String, trim: true },
    value: { type: mongoose.Schema.Types.Mixed },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
