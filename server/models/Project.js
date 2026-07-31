const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    category: { type: String, required: true },
    categoryLabel: { type: String, default: '' },
    badge: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    github: { type: String, default: '' },
    demo: { type: String, default: '' },
    image: { type: String, default: '' },
    metrics: [
      {
        label: { type: String },
        value: { type: String },
        change: { type: String },
      },
    ],
    techStack: [{ type: String }],
    recruiterHighlights: [{ type: String }],
    architecture: {
      frontend: { type: String, default: '' },
      backend: { type: String, default: '' },
      pipeline: { type: String, default: '' },
    },
    timeline: [
      {
        phase: { type: String },
        detail: { type: String },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
