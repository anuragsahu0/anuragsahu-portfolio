import { useState, useEffect } from 'react';

/**
 * Custom Hook: Media Query Listener
 * @param {string} query - CSS Media Query string (e.g. '(max-width: 768px)')
 * @returns {boolean} Matches query state
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
