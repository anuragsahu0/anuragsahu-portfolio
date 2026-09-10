import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * Custom hook for Admin Authentication state management.
 */
export const useAdminAuth = () => {
  const [token, setToken] = useState(() => authService.getToken());
  const [user, setUser] = useState(() => authService.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentToken = authService.getToken();
    const currentUser = authService.getUser();
    setToken(currentToken);
    setUser(currentUser);
  }, []);

  const login = useCallback(async (email, password, remember = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password, remember);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  return {
    isAuthenticated: Boolean(token),
    token,
    user,
    isLoading,
    error,
    login,
    logout,
  };
};
