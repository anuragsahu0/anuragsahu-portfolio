const mongoose = require('mongoose');

const ScheduledActionSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      enum: [
        'Profile',
        'Hero',
        'About',
        'Skill',
        'Experience',
        'Education',
        'Project',
        'Certificate',
        'Roadmap',
        'SocialLink',
        'Navigation',
        'SEO',
        'Settings',
        'Resume',
      ],
      index: true,
    },
    entityId: {
      type: String,
      required: [true, 'Entity ID is required'],
      index: true,
    },
    entityTitle: {
      type: String,
      default: '',
      trim: true,
    },
    actionType: {
      type: String,
      required: [true, 'Action type is required'],
      enum: [
        'PUBLISH',
        'UNPUBLISH',
        'ACTIVATE_REVISION',
        'DEACTIVATE',
        'RESUME_ACTIVATE',
        'RESUME_DEACTIVATE',
      ],
      index: true,
    },
    revisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Revision',
      default: null,
    },
    revisionVersion: {
      type: Number,
      default: null,
    },
    scheduledFor: {
      type: Date,
      required: [true, 'Scheduled execution timestamp is required'],
      index: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'SCHEDULED',
        'PROCESSING',
        'COMPLETED',
        'FAILED',
        'FAILED_PERMANENTLY',
        'CANCELLED',
      ],
      default: 'SCHEDULED',
      index: true,
    },
    processingStartedAt: {
      type: Date,
      default: null,
    },
    executedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: '',
      trim: true,
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      id: { type: String, default: 'primary-owner' },
      email: { type: String, default: 'anuragsahu@anuragsahu.dev' },
      name: { type: String, default: 'Anurag Sahu' },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal query efficiency
ScheduledActionSchema.index({ status: 1, scheduledFor: 1 });
ScheduledActionSchema.index({ entityType: 1, entityId: 1, status: 1 });
ScheduledActionSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.ScheduledAction ||
  mongoose.model('ScheduledAction', ScheduledActionSchema);
