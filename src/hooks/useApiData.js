import { useState, useEffect, useCallback } from 'react';

/**
 * useApiData — Generic data-fetching hook with graceful static fallback.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApiData(apiFn, fallbackData);
 *
 * Behavior:
 *   - On mount, calls `apiFn()` and sets data from API response.
 *   - If the API call fails (server offline, network error), falls back to `fallbackData`.
 *   - `error` is set only when both API and fallback are unavailable.
 *   - `loading` is true during the initial fetch.
 *
 * @param {Function} apiFn - Async function returning API data (e.g., apiService.getProjects)
 * @param {*} fallbackData - Static data to use when API is unavailable
 * @param {string} [dataKey] - Key in the API response object containing the data array (e.g., 'projects', 'skills')
 */
export function useApiData(apiFn, fallbackData, dataKey = null) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromApi, setIsFromApi] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      // Extract data from the response object using dataKey, or use result directly
      const extracted = dataKey ? result[dataKey] : result;
      setData(extracted);
      setIsFromApi(true);
    } catch (err) {
      // Graceful fallback to static data
      console.warn(`[useApiData] API unavailable, using static fallback. Reason: ${err.message}`);
      setData(fallbackData);
      setIsFromApi(false);
    } finally {
      setLoading(false);
    }
  }, [apiFn, dataKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, isFromApi, refetch: fetchData };
}
