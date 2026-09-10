const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logLoginEvent, logActivity } = require('./adminController');
const { sendError } = require('../utils/apiResponse');
const { isDbConnected } = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Helper to set secure HTTP-only authentication cookie
 */
const setAuthCookie = (res, token) => {
  res.cookie('as_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

/**
 * POST /api/auth/login
 * Validates credentials against hashed password, issues HTTP-only cookie and JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 'VALIDATION_ERROR', 400);
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try finding user in MongoDB if connected
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail }).select('+password');
      if (user) {
        if (user.isActive === false) {
          try {
            await logActivity('ADMIN_LOGIN_DISABLED_ATTEMPT', 'User', { email: cleanEmail }, req);
          } catch (_) {}
          return sendError(
            res,
            'This administrator account has been disabled. Please contact the site owner.',
            'ACCOUNT_DISABLED',
            401
          );
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          user.lastLoginAt = new Date();
          await user.save({ validateBeforeSave: false }).catch(() => {});

          const tokenPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name || 'Anurag Sahu',
          };

          const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

          setAuthCookie(res, token);

          try {
            if (logLoginEvent) await logLoginEvent(user.email, 'success', req);
            await logActivity('ADMIN_LOGIN_SUCCESS', 'User', { email: user.email }, req);
          } catch (_) {}

        return res.status(200).json({
            success: true,
            message: 'Login successful. Welcome to Anurag Sahu Control Center.',
            data: {
              user: {
                id: user._id.toString(),
                name: user.name || 'Anurag Sahu',
                email: user.email,
                role: user.role,
              },
            },
            token,
          });
        }
      }
    } catch (dbErr) {
      console.warn('[Auth] MongoDB check bypassed or offline:', dbErr.message);
    }
    }

    // 2. Fallback check against provisioned environment administrator credentials (if configured)
    const envEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const envPassword = process.env.ADMIN_PASSWORD;

    if (envEmail && envPassword && cleanEmail === envEmail && password === envPassword) {
      const tokenPayload = {
        id: 'env-admin',
        email: envEmail,
        role: 'admin',
        name: 'Anurag Sahu',
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      setAuthCookie(res, token);

      try {
        if (logLoginEvent) await logLoginEvent(cleanEmail, 'success', req);
        await logActivity('ADMIN_LOGIN_SUCCESS', 'User', { email: cleanEmail }, req);
      } catch (_) {}

      return res.status(200).json({
        success: true,
        message: 'Login successful. Welcome to Anurag Sahu Control Center.',
        data: {
          user: {
            id: 'env-admin',
            name: 'Anurag Sahu',
            email: envEmail,
            role: 'admin',
          },
        },
        token,
      });
    }

    // 3. Failed authentication attempt
    try {
      if (logLoginEvent) await logLoginEvent(cleanEmail, 'failure', req);
      await logActivity('ADMIN_LOGIN_FAILED', 'User', { email: cleanEmail }, req);
    } catch (_) {}

    return sendError(res, 'Invalid email or password.', 'INVALID_CREDENTIALS', 401);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Clears HTTP-only session cookie and invalidates client session.
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('as_admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    if (req.user) {
      try {
        await logActivity('ADMIN_LOGOUT', 'User', { email: req.user.email }, req);
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns current authenticated user profile.
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 'UNAUTHORIZED', 401);
    }

    // If ID is env-admin or MongoDB is offline, return decoded token user info
    if (req.user.id === 'env-admin' || req.user.id === 'admin-user') {
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: req.user.id,
            name: req.user.name || 'Anurag Sahu',
            email: req.user.email,
            role: req.user.role || 'admin',
          },
        },
      });
    }

    if (isDbConnected()) {
      try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
          if (!user.isActive) {
            return sendError(
              res,
              'This administrator account has been disabled.',
              'ACCOUNT_DISABLED',
              401
            );
          }

          return res.status(200).json({
            success: true,
            data: {
              user: {
                id: user._id.toString(),
                name: user.name || 'Anurag Sahu',
                email: user.email,
                role: user.role,
              },
            },
          });
        }
      } catch (dbErr) {}
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          name: req.user.name || 'Anurag Sahu',
          email: req.user.email,
          role: req.user.role || 'admin',
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, getMe };
