/**
 * ANTI GRAVITY — Analytics Utility Layer
 * Supports Google Analytics (GA4), Plausible, and Microsoft Clarity safely via VITE_ environment variables.
 */

export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;

  // 1. Google Analytics 4 (GA4)
  if (gaId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', gaId);
  }

  // 2. Plausible Privacy-Friendly Analytics
  if (plausibleDomain) {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  // 3. Microsoft Clarity
  if (clarityId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", clarityId);
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};
