import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * Custom hook for Admin Authentication state management.
 * Verifies active session with /api/auth/me on mount.
 */
export const useAdminAuth = () => {
  const [user, setUser] = useState(() => authService.getUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const verifiedUser = await authService.getMe();
        if (isMounted) {
          setUser(verifiedUser);
        }
      } catch (_err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password, remember = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password, remember);
      const loggedUser = data.data?.user || data.user;
      setUser(loggedUser);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated: Boolean(user),
    user,
    isLoading,
    error,
    login,
    logout,
  };
};
