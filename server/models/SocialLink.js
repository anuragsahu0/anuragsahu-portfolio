const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: 'link' },
    color: { type: String, default: '#06b6d4' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.SocialLink || mongoose.model('SocialLink', SocialLinkSchema);
