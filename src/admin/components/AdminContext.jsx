import { createContext, useContext } from 'react';

export const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminShell provider');
  }
  return context;
};
