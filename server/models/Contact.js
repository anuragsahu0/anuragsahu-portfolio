const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED', 'unread', 'read', 'archived'],
      default: 'UNREAD',
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.pre('save', function (next) {
  if (!this.name && this.fullName) this.name = this.fullName;
  if (!this.fullName && this.name) this.fullName = this.name;
  if (this.status) this.status = this.status.toUpperCase();
  next();
});

ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
