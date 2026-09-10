import { useState, useEffect, useCallback } from 'react';

/**
 * Generic Admin Data Fetching Hook
 * Standardizes loading, error, empty, and data states across all admin screens.
 */
export const useAdminData = (fetcher, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res);
    } catch (err) {
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    isEmpty: data === null || (Array.isArray(data) && data.length === 0),
    refetch: execute,
  };
};
