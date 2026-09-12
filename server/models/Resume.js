const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: [true, 'Version label is required (e.g. v1.0, v2.0)'],
      trim: true,
    },
    title: {
      type: String,
      default: 'Anurag Sahu — Software Engineer Resume',
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Download URL is required'],
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ARCHIVED',
      index: true,
    },
    uploadedBy: {
      type: String,
      default: 'admin',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helper static method to get the current active resume
ResumeSchema.statics.getActive = async function () {
  return this.findOne({ status: 'ACTIVE' }).sort({ updatedAt: -1 }).lean();
};

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
