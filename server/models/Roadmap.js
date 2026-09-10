const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Roadmap title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Roadmap description is required'],
    },
    status: {
      type: String,
      enum: ['PLANNING', 'WORKING', 'COMPLETED', 'COMING_SOON', 'PAUSED'],
      default: 'PLANNING',
      index: true,
    },
    progress: {
      type: Number,
      min: [0, 'Progress must be at least 0'],
      max: [100, 'Progress cannot exceed 100'],
      default: 0,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    targetDate: {
      type: String,
      default: '',
      trim: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ─── Backward Compatibility ──────────────────────────────────────────
    number: { type: String, default: '01' },
    name: { type: String, trim: true },
    subtitle: { type: String, default: '' },
    statusVariant: {
      type: String,
      enum: ['cyan', 'amber', 'emerald', 'purple', 'red'],
      default: 'cyan',
    },
    statusSymbol: { type: String, default: '🟢' },
    progressLabel: { type: String, default: '' },
    lastUpdated: { type: String, default: '' },
    currentFocus: [{ type: String }],
    plannedModules: [{ type: String }],
    technologies: [{ type: String }],
    category: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

RoadmapSchema.pre('save', function (next) {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;
  this.order = this.displayOrder;
  this.isActive = Boolean(this.isVisible);
  next();
});

RoadmapSchema.index({ displayOrder: 1, isVisible: 1 });

module.exports = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);
