const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Anurag Sahu',
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      default: 'admin',
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INVITED', 'SUSPENDED', 'DISABLED', 'active', 'invited', 'suspended', 'disabled'],
      default: 'ACTIVE',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastActivityAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save bcrypt hash & status sync
UserSchema.pre('save', async function (next) {
  if (this.status) {
    const s = this.status.toUpperCase();
    this.status = s;
    if (s === 'DISABLED' || s === 'SUSPENDED') {
      this.isActive = false;
    } else if (s === 'ACTIVE') {
      this.isActive = true;
    }
  }

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ status: 1, role: 1 });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
