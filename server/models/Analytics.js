const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'project_view',
        'project_click',
        'resume_download',
        'resume_click',
        'github_click',
        'linkedin_click',
        'contact_submission',
        'contact_submit',
        'external_link_click',
        'heartbeat',
      ],
      index: true,
    },
    path: {
      type: String,
      default: '/',
      index: true,
    },
    referrer: {
      type: String,
      default: '',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    deviceType: {
      type: String,
      enum: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
      default: 'Desktop',
    },
    ipHash: {
      type: String,
      default: '',
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

AnalyticsSchema.index({ type: 1, createdAt: -1 });
AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ path: 1, createdAt: -1 });
AnalyticsSchema.index({ ipHash: 1, createdAt: -1 });

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
