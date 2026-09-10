const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Asset URL is required'],
      trim: true,
    },
    type: {
      type: String,
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
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['PROFILE', 'PROJECT', 'CERTIFICATE', 'RESUME', 'SEO', 'OTHER'],
      default: 'OTHER',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.models.Media || mongoose.model('Media', MediaSchema);
