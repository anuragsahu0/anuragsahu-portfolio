/**
 * ANURAG SAHU CONTROL CENTER — IN-MEMORY SECURITY FALLBACK STORE
 * Provides deterministic offline, testing, and fallback support for
 * users, roles, sessions, security events, invitations, and security settings.
 */

const IN_MEMORY_USERS = [
  {
    id: 'primary-owner',
    name: 'Anurag Sahu',
    email: (process.env.ADMIN_EMAIL || 'admin@anuragsahu.dev').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'Admin@AntiGravity2026',
    role: 'OWNER',
    status: 'ACTIVE',
    isActive: true,
    isOwner: true,
    createdAt: new Date(),
    lastActivityAt: new Date(),
  },
];
const IN_MEMORY_ROLES = [];
const IN_MEMORY_SESSIONS = [];
const IN_MEMORY_SECURITY_EVENTS = [];
const IN_MEMORY_INVITATIONS = [];

const SECURITY_SETTINGS = {
  sessionTimeoutMinutes: 10080, // 7 days
  maxFailedLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  securityEventRetentionDays: 90,
  requirePasswordChangeDays: 0,
};

module.exports = {
  IN_MEMORY_USERS,
  IN_MEMORY_ROLES,
  IN_MEMORY_SESSIONS,
  IN_MEMORY_SECURITY_EVENTS,
  IN_MEMORY_INVITATIONS,
  SECURITY_SETTINGS,
};
