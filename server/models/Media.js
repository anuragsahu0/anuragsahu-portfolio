const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      index: true,
    },
    originalName: {
      type: String,
      default: '',
      trim: true,
    },
    storageKey: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Asset URL is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['image', 'document', 'other'],
      default: 'image',
      index: true,
    },
    fileType: {
      type: String,
      enum: ['image', 'document', 'other'],
      default: 'image',
    },
    mimeType: {
      type: String,
      default: 'image/webp',
    },
    size: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['PROFILE', 'PROJECT', 'CERTIFICATE', 'RESUME', 'SEO', 'BRANDING', 'OTHER'],
      default: 'OTHER',
      index: true,
    },
    folder: {
      type: String,
      default: 'general',
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED', 'DELETED'],
      default: 'ACTIVE',
      index: true,
    },
    checksum: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: String,
      default: 'admin',
    },
    usedIn: [
      {
        module: { type: String },
        field: { type: String },
        title: { type: String },
        refId: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ category: 1, createdAt: -1 });
MediaSchema.index({ status: 1, type: 1, createdAt: -1 });

module.exports = mongoose.models.Media || mongoose.model('Media', MediaSchema);
