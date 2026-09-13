const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      default: 'admin',
      trim: true,
    },
    adminEmail: {
      type: String,
      default: 'anuragsahu@anuragsahu.dev',
      trim: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      index: true,
    },
    resourceType: {
      type: String,
      default: '',
      index: true,
    },
    resourceId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
