import { useThemeContext } from '../context/ThemeContext';

/**
 * Custom Hook for accessing Theme Context
 */
export const useTheme = () => {
  return useThemeContext();
};
