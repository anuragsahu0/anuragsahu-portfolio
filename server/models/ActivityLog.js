const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    adminId: { type: String, default: 'admin' },
    adminEmail: { type: String, default: 'admin@anuragsahu.dev' },
    action: { type: String, required: true }, // e.g. 'PROJECT_CREATED', 'SETTINGS_UPDATED', 'MESSAGE_READ'
    targetCollection: { type: String, default: 'general' },
    details: { type: Object, default: {} },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
