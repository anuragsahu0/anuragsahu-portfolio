const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      default: 'Anurag Sahu',
    },
    professionalHeadline: {
      type: String,
      trim: true,
      default: 'Computer Science Engineer & Full-Stack Developer',
    },
    shortIntroduction: {
      type: String,
      trim: true,
      default: 'Passionate about building modern web experiences and continuously growing as a software developer.',
    },
    profileImage: {
      type: String,
      default: '/assets/anurag-portrait-sm.webp',
    },
    secondaryImage: {
      type: String,
      default: '/assets/anurag-portrait-sm.jpg',
    },
    location: {
      type: String,
      trim: true,
      default: 'India',
    },
    availability: {
      type: String,
      trim: true,
      default: 'Open to Internship Opportunities',
    },
    currentFocus: {
      type: String,
      trim: true,
      default: 'Full-Stack Development',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    github: {
      type: String,
      trim: true,
      default: 'https://github.com/anuragsahu0',
    },
    linkedin: {
      type: String,
      trim: true,
      default: 'https://linkedin.com/in/anuragsahu0',
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: 'https://anuragsahu.com',
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '/assets/anurag-sahu-resume.pdf',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
