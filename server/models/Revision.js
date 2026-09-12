const mongoose = require('mongoose');

const RevisionSchema = new mongoose.Schema(
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
    version: {
      type: Number,
      required: [true, 'Version number is required'],
      index: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Content snapshot is required'],
    },
    state: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'RESTORED', 'AUTOSAVED'],
      default: 'PUBLISHED',
      index: true,
    },
    changeSummary: {
      type: String,
      default: '',
      trim: true,
    },
    changedFields: [{ type: String }],
    restoredFromVersion: {
      type: Number,
      default: null,
    },
    createdBy: {
      type: String,
      default: 'admin',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast ordered revision lookup
RevisionSchema.index({ entityType: 1, entityId: 1, version: -1 });

module.exports = mongoose.models.Revision || mongoose.model('Revision', RevisionSchema);
