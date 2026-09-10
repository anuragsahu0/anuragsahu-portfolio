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
    contactEmail: {
      type: String,
      default: 'shivasahu0612@gmail.com',
      trim: true,
    },
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
    availability: {
      type: String,
      default: 'Open to Internship Opportunities',
      trim: true,
    },
    seoTitle: {
      type: String,
      default: 'Anurag Sahu — Personal Portfolio & Engineering Telemetry',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: 'Personal portfolio of Anurag Sahu, showcasing full-stack engineering, AI/ML research, and real-time systems.',
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
      default: '/assets/anurag-portrait-sm.jpg',
      trim: true,
    },
    footerText: {
      type: String,
      default: '© 2026 Anurag Sahu. All rights reserved.',
      trim: true,
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
