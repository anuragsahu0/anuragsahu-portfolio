const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['NEW_MESSAGE', 'SYSTEM', 'CONTENT_UPDATE', 'ERROR', 'SCHEDULE', 'BACKUP', 'RESTORE', 'SECURITY', 'USER', 'ROLE', 'message', 'project', 'system', 'milestone', 'error', 'schedule', 'backup', 'restore', 'security', 'user', 'role'],
      default: 'SYSTEM',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedResource: {
      resourceType: { type: String, default: '' },
      resourceId: { type: String, default: '' },
    },
    link: {
      type: String,
      default: '',
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
