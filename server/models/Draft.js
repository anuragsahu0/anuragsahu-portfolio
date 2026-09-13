const mongoose = require('mongoose');

const DraftSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      enum: [
        'Project',
        'Hero',
        'Profile',
        'About',
        'Skill',
        'Experience',
        'Education',
        'Certificate',
        'Roadmap',
        'SocialLink',
        'Navigation',
        'Settings',
        'SEO',
      ],
      index: true,
    },
    entityId: {
      type: String,
      required: [true, 'Entity ID is required'],
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Draft payload is required'],
    },
    baseVersion: {
      type: Number,
      default: 1,
    },
    adminEmail: {
      type: String,
      default: 'anuragsahu@anuragsahu.dev',
      trim: true,
    },
    lastSavedAt: {
      type: Date,
      default: Date.now,
    },
    isDirty: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one active draft per entity instance
DraftSchema.index({ entityType: 1, entityId: 1 }, { unique: true });

module.exports = mongoose.models.Draft || mongoose.model('Draft', DraftSchema);
