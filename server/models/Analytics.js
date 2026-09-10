const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'project_view',
        'resume_download',
        'github_click',
        'linkedin_click',
        'contact_submission',
      ],
      index: true,
    },
    path: {
      type: String,
      default: '/',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

AnalyticsSchema.index({ type: 1, createdAt: -1 });
AnalyticsSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
