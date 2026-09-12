const mongoose = require('mongoose');

const BackupSchema = new mongoose.Schema(
  {
    backupId: {
      type: String,
      required: [true, 'backupId is required'],
      unique: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['MANUAL', 'SCHEDULED', 'PRE_DEPLOYMENT', 'PRE_RESTORE'],
      default: 'MANUAL',
      index: true,
    },
    status: {
      type: String,
      enum: ['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'EXPIRED', 'DELETED'],
      default: 'RUNNING',
      index: true,
    },
    scope: {
      type: String,
      enum: ['FULL', 'CONTENT', 'DATABASE', 'MEDIA'],
      default: 'FULL',
      index: true,
    },
    storageReference: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    checksum: {
      type: String,
      default: '',
    },
    integrity: {
      type: String,
      enum: ['VALID', 'INVALID', 'NOT_VERIFIED'],
      default: 'NOT_VERIFIED',
    },
    lastVerifiedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: 'admin',
      trim: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal queries
BackupSchema.index({ status: 1, createdAt: -1 });
BackupSchema.index({ type: 1, createdAt: -1 });
BackupSchema.index({ expiresAt: 1 });

module.exports = mongoose.models.Backup || mongoose.model('Backup', BackupSchema);
