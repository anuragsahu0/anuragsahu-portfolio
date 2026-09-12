const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
      maxlength: [254, 'Email cannot exceed 254 characters'],
    },
    company: {
      type: String,
      default: '',
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [10000, 'Message cannot exceed 10000 characters'],
    },
    status: {
      type: String,
      enum: [
        'NEW',
        'READ',
        'REPLIED',
        'ARCHIVED',
        'SPAM',
        'UNREAD',
        'unread',
        'read',
        'replied',
        'archived',
        'spam',
      ],
      default: 'NEW',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    replySentAt: {
      type: Date,
      default: null,
    },
    replySubject: {
      type: String,
      default: '',
    },
    replyMessage: {
      type: String,
      default: '',
    },
    emailNotificationStatus: {
      type: String,
      enum: ['SENT', 'FAILED', 'PENDING'],
      default: 'PENDING',
    },
    emailError: {
      type: String,
      default: '',
    },
    ipHash: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.pre('save', function (next) {
  if (!this.name && this.fullName) this.name = this.fullName;
  if (!this.fullName && this.name) this.fullName = this.name;
  if (this.status) {
    const s = this.status.toUpperCase();
    this.status = s === 'UNREAD' ? 'NEW' : s;
    this.isRead = this.status !== 'NEW';
  }
  next();
});

ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ isRead: 1, createdAt: -1 });
ContactSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
