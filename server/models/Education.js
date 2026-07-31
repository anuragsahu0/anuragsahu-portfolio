const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['degree', 'certification', 'achievement', 'coursework', 'roadmap'],
      required: true,
    },
    institution: { type: String, default: '' },
    degree: { type: String, required: true },
    duration: { type: String, default: '' },
    currentStatus: { type: String, default: '' },
    location: { type: String, default: '' },
    relevantCoursework: [{ type: String }],
    highlights: [{ type: String }],
    platform: { type: String, default: '' }, // for certifications
    status: { type: String, default: '' }, // Completed / In Progress
    date: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Education || mongoose.model('Education', EducationSchema);
