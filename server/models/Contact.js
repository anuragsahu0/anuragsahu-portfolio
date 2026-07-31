const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    company: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
    },
    ipAddress: { type: String, default: '' },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
