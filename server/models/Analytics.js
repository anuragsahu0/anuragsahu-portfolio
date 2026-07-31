const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'resume_download',
        'project_click',
        'github_click',
        'linkedin_click',
        'contact_submission',
      ],
    },
    path: { type: String, default: '/' },
    metadata: { type: Object, default: {} },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
