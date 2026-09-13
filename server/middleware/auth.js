const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const { validateSession, hasPermission, logSecurityEvent } = require('../services/securityService');

const getJwtSecret = () => process.env.JWT_SECRET || 'fallback-secret-change-this';

/**
 * Extract token from HTTP-only Cookie or Authorization Header
 */
const extractToken = (req) => {
  // 1. Check HTTP-only cookie first (preferred browser session strategy)
  if (req.cookies && req.cookies.as_admin_token) {
    return req.cookies.as_admin_token;
  }

  // 2. Check Authorization Bearer Header (API / CLI fallback)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

/**
 * JWT Authentication Middleware
 * Validates session cookie or Bearer token, enforces session active state and account status,
 * and attaches decoded user to req.user.
 */
const verifyToken = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please log in to access this resource.',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    // Check active session validity if sessionId exists
    if (decoded.sessionId) {
      try {
        const sessionCheck = await validateSession(decoded.sessionId, token);
        if (!sessionCheck.valid) {
          if (sessionCheck.reason === 'SESSION_REVOKED') {
            return res.status(401).json({
              success: false,
              error: {
                code: 'SESSION_REVOKED',
                message: 'Your session has been revoked. Please log in again.',
              },
            });
          }
          if (sessionCheck.reason === 'SESSION_EXPIRED') {
            return res.status(401).json({
              success: false,
              error: {
                code: 'TOKEN_EXPIRED',
                message: 'Session expired. Please log in again.',
              },
            });
          }
        }
      } catch (_) {}
    }

    // If MongoDB is connected and user id exists, check database for active status
    if (isDbConnected() && decoded.id && decoded.id !== 'admin-user' && decoded.id !== 'env-admin') {
      try {
        const user = await User.findById(decoded.id).select('isActive status role email name');
        if (user) {
          if (user.isActive === false || user.status === 'DISABLED') {
            return res.status(401).json({
              success: false,
              error: {
                code: 'ACCOUNT_DISABLED',
                message: 'Your administrator account has been disabled. Please contact the site owner.',
              },
            });
          }
          if (user.status === 'SUSPENDED') {
            return res.status(401).json({
              success: false,
              error: {
                code: 'ACCOUNT_SUSPENDED',
                message: 'Your administrator account has been temporarily suspended.',
              },
            });
          }

          req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            status: user.status || 'ACTIVE',
            name: user.name || 'Anurag Sahu',
            sessionId: decoded.sessionId || null,
          };
          return next();
        }
      } catch (dbErr) {
        // Database offline/disconnected, proceed with verified decoded token payload
      }
    }

    // Default to verified decoded JWT payload
    if (decoded.isActive === false || decoded.status === 'DISABLED') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Your administrator account has been disabled.',
        },
      });
    }

    if (decoded.status === 'SUSPENDED') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_SUSPENDED',
          message: 'Your administrator account has been temporarily suspended.',
        },
      });
    }

    req.user = decoded;
    return next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      error: {
        code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        message: isExpired
          ? 'Session expired. Please log in again.'
          : 'Invalid or expired authentication session.',
      },
    });
  }
};

/**
 * Role-based Authorization Middleware (Legacy)
 * Usage: requireRole(['admin', 'owner'])
 */
const requireRole = (...allowedRoles) => {
  const roles = allowedRoles.flat().map(r => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
    }

    const userRole = (req.user.role || '').toUpperCase();
    if (userRole === 'OWNER') return next();

    if (roles.length > 0 && !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of the following roles: ${roles.join(', ')}.`,
        },
      });
    }

    next();
  };
};

/**
 * Granular Permission Authorization Middleware
 * Usage: requirePermission('projects.edit')
 */
const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
    }

    const userRole = req.user.role || 'VIEWER';
    const allowed = await hasPermission(userRole, requiredPermission);

    if (!allowed) {
      try {
        await logSecurityEvent({
          eventType: 'PERMISSION_DENIED',
          severity: 'MEDIUM',
          userId: req.user.id,
          userEmail: req.user.email,
          resource: req.originalUrl,
          action: req.method,
          details: {
            requiredPermission,
            userRole,
          },
          req,
        });
      } catch (_) {}

      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. You lack the required permission: ${requiredPermission}`,
        },
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireAuth: verifyToken,
  requireRole,
  requirePermission,
};
