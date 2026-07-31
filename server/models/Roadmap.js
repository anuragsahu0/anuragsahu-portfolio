const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Working', 'Coming Soon', 'Planning', 'Completed', 'On Hold'],
      required: true,
    },
    statusVariant: {
      type: String,
      enum: ['cyan', 'amber', 'emerald', 'purple', 'red'],
      default: 'cyan',
    },
    statusSymbol: { type: String, default: '🟢' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    progressLabel: { type: String, default: '' },
    lastUpdated: { type: String, default: '' },
    description: { type: String, required: true },
    currentFocus: [{ type: String }],
    plannedModules: [{ type: String }],
    technologies: [{ type: String }],
    category: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);
