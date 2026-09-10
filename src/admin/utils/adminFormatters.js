/**
 * ANURAG SAHU CONTROL CENTER — Formatters Utility
 * Standardized data formatting helpers for admin dashboards and records.
 */

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: options.includeTime ? '2-digit' : undefined,
      minute: options.includeTime ? '2-digit' : undefined,
      ...options,
    }).format(d);
  } catch (_err) {
    return String(dateString);
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - d) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  } catch (_err) {
    return String(dateString);
  }
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};
