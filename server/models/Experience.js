const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    technologies: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
      trim: true,
    },
    endDate: {
      type: String,
      default: 'Present',
      trim: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.index({ displayOrder: 1, isVisible: 1 });

module.exports = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
