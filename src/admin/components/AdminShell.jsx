import { useState } from 'react';
import { AdminContext } from './AdminContext';

/**
 * AdminShell: Root context provider and state management for Admin Control Center.
 */
export const AdminShell = ({ children, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        searchQuery,
        setSearchQuery,
        user,
        onLogout,
        toasts,
        addToast,
        removeToast,
      }}
    >
      <div className="min-h-screen bg-[#05070E] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-300">
        {children}
      </div>
    </AdminContext.Provider>
  );
};
