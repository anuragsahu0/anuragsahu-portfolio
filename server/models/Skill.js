const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'aiml', 'databases', 'languages', 'tools'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Building Projects With', 'Learning', 'Explored'],
      default: 'Learning',
    },
    proficiency: { type: Number, min: 0, max: 100, default: 50 },
    icon: { type: String, default: 'Code2' },
    practicalUsage: { type: String, default: '' },
    highlights: [{ type: String }],
    levelLabel: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
