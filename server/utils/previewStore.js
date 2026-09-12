/**
 * PREVIEW STORE
 * Shared store for short-lived draft preview sessions (avoids circular dependencies)
 */
const PREVIEW_SESSIONS = new Map();

module.exports = {
  PREVIEW_SESSIONS,
};
