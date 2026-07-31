const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: '' },
    deviceType: { type: String, default: 'Desktop' },
    browser: { type: String, default: 'Chrome' },
    os: { type: String, default: 'macOS' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.LoginHistory || mongoose.model('LoginHistory', LoginHistorySchema);
