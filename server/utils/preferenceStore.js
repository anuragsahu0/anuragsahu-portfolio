/**
 * Phase 15: Preference & Recents Store
 * In-memory fallback and cache for user preferences, recent items, and pinned shortcuts.
 */

// Keyed by user identifier (email or user ID)
const IN_MEMORY_RECENT_ITEMS = new Map();
const IN_MEMORY_PINNED_ITEMS = new Map();

const MAX_RECENT_ITEMS = 10;

/**
 * Get recent items for a user
 */
function getRecentItemsForUser(userKey) {
  if (!userKey) return [];
  return IN_MEMORY_RECENT_ITEMS.get(userKey) || [];
}

/**
 * Add a recent item for a user (capped at MAX_RECENT_ITEMS, deduplicated by entityType+entityId)
 */
function addRecentItemForUser(userKey, item) {
  if (!userKey || !item) return [];
  const entityType = item.entityType || item.category || 'GENERAL';
  const entityId = item.entityId || item.id;
  if (!entityId) return [];

  const existing = IN_MEMORY_RECENT_ITEMS.get(userKey) || [];
  // Remove if item already exists to move to top
  const filtered = existing.filter(
    i => !(i.entityType === entityType && String(i.entityId) === String(entityId))
  );

  const entry = {
    id: item.id || `${entityType}-${entityId}`,
    entityType,
    entityId: String(entityId),
    title: item.title || 'Untitled',
    subtitle: item.subtitle || '',
    url: item.url || '',
    action: item.action || 'open',
    tab: item.tab || '',
    timestamp: new Date().toISOString(),
  };

  filtered.unshift(entry);
  const capped = filtered.slice(0, MAX_RECENT_ITEMS);
  IN_MEMORY_RECENT_ITEMS.set(userKey, capped);
  return capped;
}

/**
 * Clear all recent items for a user
 */
function clearRecentItemsForUser(userKey) {
  if (!userKey) return true;
  IN_MEMORY_RECENT_ITEMS.set(userKey, []);
  return true;
}

/**
 * Get pinned items for a user
 */
function getPinnedItemsForUser(userKey) {
  if (!userKey) return [];
  return IN_MEMORY_PINNED_ITEMS.get(userKey) || [];
}

/**
 * Add a pinned item for a user
 */
function addPinnedItemForUser(userKey, item) {
  if (!userKey || !item) return [];
  const entityType = item.entityType || item.category || 'GENERAL';
  const entityId = item.entityId || item.id;

  const existing = IN_MEMORY_PINNED_ITEMS.get(userKey) || [];
  const id = item.id || `${entityType}-${entityId || Date.now()}`;

  // Check duplicate
  if (existing.some(p => p.id === id || (p.entityType === entityType && p.entityId && String(p.entityId) === String(entityId)))) {
    return existing;
  }

  const pinned = {
    id,
    entityType,
    entityId: entityId ? String(entityId) : null,
    title: item.title || 'Pinned Item',
    subtitle: item.subtitle || '',
    url: item.url || '',
    tab: item.tab || '',
    icon: item.icon || 'bookmark',
    pinnedAt: new Date().toISOString(),
  };

  existing.push(pinned);
  IN_MEMORY_PINNED_ITEMS.set(userKey, existing);
  return existing;
}

/**
 * Remove a pinned item for a user
 */
function removePinnedItemForUser(userKey, pinId) {
  if (!userKey || !pinId) return [];
  const existing = IN_MEMORY_PINNED_ITEMS.get(userKey) || [];
  const updated = existing.filter(p => p.id !== pinId);
  IN_MEMORY_PINNED_ITEMS.set(userKey, updated);
  return updated;
}

module.exports = {
  IN_MEMORY_RECENT_ITEMS,
  IN_MEMORY_PINNED_ITEMS,
  MAX_RECENT_ITEMS,
  getRecentItemsForUser,
  addRecentItemForUser,
  clearRecentItemsForUser,
  getPinnedItemsForUser,
  addPinnedItemForUser,
  removePinnedItemForUser,
};
