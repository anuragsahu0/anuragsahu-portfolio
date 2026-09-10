const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuing authority is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

CertificateSchema.index({ displayOrder: 1, isVisible: 1 });

module.exports = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
