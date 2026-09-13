const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { logLoginEvent, logActivity } = require('./adminController');
const { sendError } = require('../utils/apiResponse');
const { isDbConnected } = require('../config/db');
const {
  createSession,
  revokeSession,
  getRolePermissions,
  isAccountLocked,
  recordFailedLogin,
  recordSuccessfulLogin,
  logSecurityEvent,
} = require('../services/securityService');
const { IN_MEMORY_USERS } = require('../utils/securityStore');
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
 * Validates credentials against hashed password, tracks session & security audit, issues HTTP-only cookie and JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 'VALIDATION_ERROR', 400);
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check brute-force lockout status
    const lockStatus = isAccountLocked(cleanEmail);
    if (lockStatus.locked) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'ACCOUNT_TEMPORARILY_LOCKED',
          message: `Account temporarily locked due to multiple failed login attempts. Please try again in ${lockStatus.remainingMinutes || 15} minutes.`,
        },
      });
    }

    // 1. Try finding user in MongoDB if connected
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail }).select('+password');
        if (user) {
          if (user.isActive === false || user.status === 'DISABLED') {
            try {
              await logSecurityEvent({
                eventType: 'ACCOUNT_DISABLED',
                severity: 'MEDIUM',
                userEmail: cleanEmail,
                resource: 'Auth',
                action: 'LOGIN_ATTEMPT',
                details: { reason: 'Disabled account attempted login' },
                req,
              });
              await logActivity('ADMIN_LOGIN_DISABLED_ATTEMPT', 'User', { email: cleanEmail }, req);
            } catch (_) {}
            return sendError(
              res,
              'This administrator account has been disabled. Please contact the site owner.',
              'ACCOUNT_DISABLED',
              401
            );
          }

          if (user.status === 'SUSPENDED') {
            return sendError(
              res,
              'This administrator account has been temporarily suspended.',
              'ACCOUNT_SUSPENDED',
              401
            );
          }

          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            recordSuccessfulLogin(cleanEmail);
            user.lastLoginAt = new Date();
            user.lastActivityAt = new Date();
            user.failedLoginAttempts = 0;
            user.lockoutUntil = null;
            await user.save({ validateBeforeSave: false }).catch(() => {});

            // Generate session ID
            const session = await createSession({
              userId: user._id.toString(),
              userEmail: user.email,
              role: user.role,
              req,
              token: null, // Will hash after signing
            });

            const tokenPayload = {
              id: user._id.toString(),
              email: user.email,
              role: user.role,
              name: user.name || 'Anurag Sahu',
              sessionId: session.sessionId,
            };

            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            setAuthCookie(res, token);

            const permissions = await getRolePermissions(user.role);

            try {
              if (logLoginEvent) await logLoginEvent(user.email, 'success', req);
              await logActivity('ADMIN_LOGIN_SUCCESS', 'User', { email: user.email }, req);
              await logSecurityEvent({
                eventType: 'LOGIN_SUCCESS',
                severity: 'LOW',
                userId: user._id.toString(),
                userEmail: user.email,
                resource: 'Auth',
                action: 'LOGIN',
                details: { sessionId: session.sessionId, role: user.role },
                req,
              });
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
                  status: user.status || 'ACTIVE',
                  permissions,
                },
                sessionId: session.sessionId,
              },
              token,
            });
          }
        }
      } catch (dbErr) {
        console.warn('[Auth] MongoDB check bypassed or offline:', dbErr.message);
      }
    }

    // 2. Check In-Memory Users fallback (offline / test mode)
    const memUser = IN_MEMORY_USERS.find(u => u.email === cleanEmail);
    if (memUser) {
      if (memUser.isActive === false || memUser.status === 'DISABLED') {
        return sendError(
          res,
          'This administrator account has been disabled. Please contact the site owner.',
          'ACCOUNT_DISABLED',
          401
        );
      }
      const isMatch = memUser.password
        ? (memUser.password.startsWith('$2')
            ? await bcrypt.compare(password, memUser.password)
            : memUser.password === password)
        : false;

      if (isMatch) {
        recordSuccessfulLogin(cleanEmail);
        memUser.lastLoginAt = new Date();
        memUser.lastActivityAt = new Date();

        const session = await createSession({
          userId: memUser.id || memUser._id || 'mem-user',
          userEmail: memUser.email,
          role: memUser.role,
          req,
          token: null,
        });

        const tokenPayload = {
          id: memUser.id || memUser._id || 'mem-user',
          email: memUser.email,
          role: memUser.role,
          name: memUser.name || 'Admin User',
          sessionId: session.sessionId,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        setAuthCookie(res, token);

        const permissions = await getRolePermissions(memUser.role);

        try {
          if (logLoginEvent) await logLoginEvent(memUser.email, 'success', req);
          await logSecurityEvent({
            eventType: 'LOGIN_SUCCESS',
            severity: 'LOW',
            userEmail: memUser.email,
            resource: 'Auth',
            action: 'LOGIN',
            details: { sessionId: session.sessionId, role: memUser.role },
            req,
          });
        } catch (_) {}

        return res.status(200).json({
          success: true,
          message: 'Login successful. Welcome to Anurag Sahu Control Center.',
          data: {
            user: {
              id: tokenPayload.id,
              name: memUser.name || 'Admin User',
              email: memUser.email,
              role: memUser.role,
              status: memUser.status || 'ACTIVE',
              permissions,
            },
            sessionId: session.sessionId,
          },
          token,
        });
      }
    }

    // 3. Fallback check against provisioned environment administrator credentials (if configured)
    const envEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const envPassword = process.env.ADMIN_PASSWORD;

    if (envEmail && envPassword && cleanEmail === envEmail && password === envPassword) {
      recordSuccessfulLogin(cleanEmail);

      const session = await createSession({
        userId: 'env-admin',
        userEmail: envEmail,
        role: 'OWNER',
        req,
        token: null,
      });

      const tokenPayload = {
        id: 'env-admin',
        email: envEmail,
        role: 'OWNER',
        name: 'Anurag Sahu',
        sessionId: session.sessionId,
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      setAuthCookie(res, token);

      const permissions = await getRolePermissions('OWNER');

      try {
        if (logLoginEvent) await logLoginEvent(cleanEmail, 'success', req);
        await logActivity('ADMIN_LOGIN_SUCCESS', 'User', { email: cleanEmail }, req);
        await logSecurityEvent({
          eventType: 'LOGIN_SUCCESS',
          severity: 'LOW',
          userEmail: cleanEmail,
          resource: 'Auth',
          action: 'LOGIN',
          details: { sessionId: session.sessionId, role: 'OWNER' },
          req,
        });
      } catch (_) {}

      return res.status(200).json({
        success: true,
        message: 'Login successful. Welcome to Anurag Sahu Control Center.',
        data: {
          user: {
            id: 'env-admin',
            name: 'Anurag Sahu',
            email: envEmail,
            role: 'OWNER',
            status: 'ACTIVE',
            permissions,
          },
          sessionId: session.sessionId,
        },
        token,
      });
    }

    // 4. Failed authentication attempt
    await recordFailedLogin(cleanEmail, req);
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
 * Clears HTTP-only session cookie and invalidates server-side session.
 */
const logout = async (req, res, next) => {
  try {
    if (req.user && req.user.sessionId) {
      try {
        await revokeSession(req.user.sessionId, 'User initiated logout', req.user.email);
      } catch (_) {}
    }

    res.clearCookie('as_admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    if (req.user) {
      try {
        await logActivity('ADMIN_LOGOUT', 'User', { email: req.user.email }, req);
        await logSecurityEvent({
          eventType: 'LOGOUT',
          severity: 'LOW',
          userEmail: req.user.email,
          resource: 'Auth',
          action: 'LOGOUT',
          req,
        });
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
 * Returns current authenticated user profile and granular permissions.
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 'UNAUTHORIZED', 401);
    }

    const userRole = req.user.role || 'VIEWER';
    const permissions = await getRolePermissions(userRole);

    // If ID is env-admin or admin-user or MongoDB offline
    if (req.user.id === 'env-admin' || req.user.id === 'admin-user') {
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: req.user.id,
            name: req.user.name || 'Anurag Sahu',
            email: req.user.email,
            role: userRole,
            status: 'ACTIVE',
            permissions,
          },
        },
      });
    }

    if (isDbConnected()) {
      try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
          if (!user.isActive || user.status === 'DISABLED') {
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
                status: user.status || 'ACTIVE',
                permissions,
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
          role: userRole,
          status: 'ACTIVE',
          permissions,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, getMe };
