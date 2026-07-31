const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    event: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
    badge: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
