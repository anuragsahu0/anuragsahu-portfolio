const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema(
  {
    invitationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      default: 'VIEWER',
      uppercase: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'],
      default: 'PENDING',
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    invitedBy: {
      type: String,
      default: 'admin',
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

InvitationSchema.index({ email: 1, status: 1 });

module.exports = mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema);
