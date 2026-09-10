const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    id: {
      type: String,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    gallery: [{ type: String }],
    technologies: [{ type: String, trim: true }],
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'fullstack',
      index: true,
    },
    categoryLabel: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['WORKING', 'COMPLETED', 'COMING_SOON', 'PAUSED', 'ARCHIVED'],
      default: 'WORKING',
      index: true,
    },
    progress: {
      type: Number,
      min: [0, 'Progress must be at least 0'],
      max: [100, 'Progress cannot exceed 100'],
      default: 0,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    visibility: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    startDate: {
      type: String,
      default: '',
    },
    completionDate: {
      type: String,
      default: '',
    },

    // ─── Backward Compatibility for Existing Public UI ────────────────
    badge: { type: String, default: '' },
    tagline: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    github: { type: String, default: '' },
    demo: { type: String, default: '' },
    image: { type: String, default: '' },
    metrics: [
      {
        label: { type: String },
        value: { type: String },
        change: { type: String },
      },
    ],
    techStack: [{ type: String }],
    recruiterHighlights: [{ type: String }],
    architecture: {
      frontend: { type: String, default: '' },
      backend: { type: String, default: '' },
      pipeline: { type: String, default: '' },
    },
    timeline: [
      {
        phase: { type: String },
        detail: { type: String },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save sync helper for compatibility
ProjectSchema.pre('save', function (next) {
  if (!this.id && this.slug) {
    this.id = this.slug;
  }
  if (!this.slug && this.id) {
    this.slug = this.id;
  }
  if (this.githubUrl && !this.github) this.github = this.githubUrl;
  if (this.liveUrl && !this.demo) this.demo = this.liveUrl;
  if (this.thumbnail && !this.image) this.image = this.thumbnail;
  if (this.technologies && this.technologies.length && (!this.techStack || !this.techStack.length)) {
    this.techStack = this.technologies;
  }
  this.isFeatured = Boolean(this.featured);
  this.order = this.displayOrder;
  this.isActive = this.visibility === 'PUBLISHED';
  next();
});

// Composite index for fast public retrieval
ProjectSchema.index({ visibility: 1, displayOrder: 1 });

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
