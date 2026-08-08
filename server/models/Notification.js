const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['message', 'project', 'system', 'milestone', 'error'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
