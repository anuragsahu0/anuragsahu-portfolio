const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
      default: '',
    },
    startYear: {
      type: String,
      trim: true,
      default: '',
    },
    endYear: {
      type: String,
      trim: true,
      default: '',
    },
    cgpa: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    relevantCoursework: [{ type: String }],
    highlights: [{ type: String }],
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
    type: { type: String, default: 'degree' },
    duration: { type: String, default: '' },
    currentStatus: { type: String, default: '' },
    location: { type: String, default: 'India' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

EducationSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this.degree.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  if (!this.duration && this.startYear && this.endYear) {
    this.duration = `${this.startYear} — ${this.endYear}`;
  }
  this.order = this.displayOrder;
  this.isActive = Boolean(this.isVisible);
  next();
});

EducationSchema.index({ displayOrder: 1, isVisible: 1 });

module.exports = mongoose.models.Education || mongoose.model('Education', EducationSchema);
