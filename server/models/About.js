const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'About Me',
    },
    description: {
      type: String,
      trim: true,
      default: 'Passionate about building modern web experiences and continuously growing as a software developer.',
    },
    personalNarrative: [
      {
        id: { type: String },
        text: { type: String, required: true },
        highlightWords: [{ type: String }],
      },
    ],
    learningJourney: {
      type: String,
      default: 'Continuously refining data structures, full-stack architecture, and machine learning models.',
    },
    engineeringValues: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: 'Code2' },
      },
    ],
    currentFocus: {
      type: String,
      default: 'Full-Stack Development with React, Node.js, and Modern Cloud Platforms.',
    },
    goals: [{ type: String }],
    interests: [{ type: String }],
    timelineStages: [
      {
        stage: { type: String },
        title: { type: String },
        period: { type: String },
        description: { type: String },
      },
    ],
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.About || mongoose.model('About', AboutSchema);
