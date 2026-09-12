/**
 * ANURAG SAHU CONTROL CENTER — CENTRALIZED SECURITY UTILITIES
 * Enterprise Input Validation, Safe URL Enforcement, and XSS Sanitization
 */

/**
 * Validates whether a URL is safe for external or internal navigation.
 * Strictly blocks dangerous schemes (javascript:, data:, vbscript:, file:)
 * and only permits http, https, mailto, or safe relative paths.
 *
 * @param {string} url - The URL string to test.
 * @param {boolean} [allowEmpty=true] - Whether empty or null is considered valid (for optional fields).
 * @returns {boolean} True if the URL is safe; false otherwise.
 */
function isSafeUrl(url, allowEmpty = true) {
  if (url === null || url === undefined || url === "") {
    return Boolean(allowEmpty);
  }

  if (typeof url !== "string") return false;

  const trimmed = url.trim();
  if (trimmed === "") return Boolean(allowEmpty);

  // Normalize control characters and strip null bytes
  const normalized = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]/g, "").toLowerCase();

  // Explicit blacklisted protocols
  const dangerousProtocols = [
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
    "blob:",
    "about:",
    "intent:",
  ];

  for (const protocol of dangerousProtocols) {
    if (normalized.startsWith(protocol) || normalized.includes(protocol)) {
      return false;
    }
  }

  // Safe relative paths (e.g. /assets/resume.pdf, #projects, /)
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith(".")) {
    return true;
  }

  // Safe absolute protocols (http, https, mailto)
  try {
    const parsed = new URL(trimmed);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch (err) {
    // If URL parsing failed, check if it is a valid relative domain like "github.com/username"
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
      return true;
    }
    return false;
  }
}

/**
 * Strips executable HTML elements, script tags, event handlers, and malicious attributes.
 * Safe for rich-text descriptions, about narrative, and project highlights.
 *
 * @param {string} str - Raw string possibly containing HTML.
 * @returns {string} Sanitized string.
 */
function sanitizeHtmlContent(str) {
  if (!str || typeof str !== "string") return "";

  let clean = str;

  // 1. Remove script tags and content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove iframe, object, embed, applet, form, base, link tags
  clean = clean.replace(/<\/?(iframe|object|embed|applet|form|base|link|meta)\b[^>]*>/gi, "");

  // 3. Remove inline event handlers (onload, onerror, onclick, onmouseover, etc.)
  clean = clean.replace(/\son\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, "");

  // 4. Remove javascript: in attributes
  clean = clean.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, "href=\"#\"");
  clean = clean.replace(/src\s*=\s*["']\s*javascript:[^"']*["']/gi, "src=\"\"");

  return clean.trim();
}

/**
 * Recursively sanitizes string properties inside an input payload object.
 *
 * @param {object} obj - The input object.
 * @returns {object} Cleaned object.
 */
function sanitizeInputObject(obj) {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeInputObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // If it is a known URL key, check safety
      if (["url", "github", "githubUrl", "demo", "liveUrl", "credentialUrl", "profileImage", "resumeUrl", "ogImage", "faviconUrl"].includes(key)) {
        sanitized[key] = isSafeUrl(value) ? value.trim() : "";
      } else {
        sanitized[key] = sanitizeHtmlContent(value);
      }
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeInputObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

module.exports = {
  isSafeUrl,
  sanitizeHtmlContent,
  sanitizeInputObject,
};
