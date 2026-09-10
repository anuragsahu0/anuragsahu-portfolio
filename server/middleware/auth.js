const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');

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
 * Validates session cookie or Bearer token, enforces active account status,
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

    // If MongoDB is connected and user id exists, check database for active status
    if (isDbConnected() && decoded.id && decoded.id !== 'admin-user' && decoded.id !== 'env-admin') {
      try {
        const user = await User.findById(decoded.id).select('isActive role email name');
        if (user) {
          if (!user.isActive) {
            return res.status(401).json({
              success: false,
              error: {
                code: 'ACCOUNT_DISABLED',
                message: 'Your administrator account has been disabled. Please contact the site owner.',
              },
            });
          }
          req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name || 'Anurag Sahu',
          };
          return next();
        }
      } catch (dbErr) {
        // Database offline/disconnected, proceed with verified decoded token payload
      }
    }

    // Default to verified decoded JWT payload
    if (decoded.isActive === false) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Your administrator account has been disabled.',
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
 * Role-based Authorization Middleware
 * Usage: requireRole(['admin', 'super_admin'])
 */
const requireRole = (...allowedRoles) => {
  const roles = allowedRoles.flat();
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

    if (roles.length > 0 && !roles.includes(req.user.role)) {
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

module.exports = {
  verifyToken,
  requireAuth: verifyToken,
  requireRole,
};

