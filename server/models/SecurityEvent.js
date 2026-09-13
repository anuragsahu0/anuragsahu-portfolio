const mongoose = require('mongoose');

const SecurityEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      index: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      index: true,
    },
    userId: {
      type: String,
      default: '',
      index: true,
    },
    userEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
      index: true,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    userAgent: {
      type: String,
      default: '',
    },
    resource: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

SecurityEventSchema.index({ createdAt: -1 });
SecurityEventSchema.index({ eventType: 1, createdAt: -1 });
SecurityEventSchema.index({ severity: 1, createdAt: -1 });

module.exports = mongoose.models.SecurityEvent || mongoose.model('SecurityEvent', SecurityEventSchema);
