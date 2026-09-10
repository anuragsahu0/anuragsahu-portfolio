const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'AI/ML', 'Tools', 'Other'],
      required: [true, 'Category is required'],
      index: true,
    },
    icon: {
      type: String,
      default: 'Code2',
    },
    description: {
      type: String,
      default: '',
    },
    proficiency: {
      type: Number,
      min: [0, 'Proficiency must be at least 0'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 80,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ─── Backward Compatibility ──────────────────────────────────────────
    id: { type: String, trim: true },
    practicalUsage: { type: String, default: '' },
    highlights: [{ type: String }],
    status: {
      type: String,
      enum: ['Building Projects With', 'Learning', 'Explored'],
      default: 'Building Projects With',
    },
    levelLabel: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

SkillSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  if (!this.description && this.practicalUsage) {
    this.description = this.practicalUsage;
  }
  this.order = this.displayOrder;
  this.isActive = Boolean(this.isVisible);
  next();
});

// Composite index for fast category-based rendering
SkillSchema.index({ category: 1, displayOrder: 1, isVisible: 1 });

module.exports = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
