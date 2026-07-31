import React from 'react';

/**
 * Main Content Page Layout Wrapper
 * Controls container max-width padding and section spacing.
 */
export const MainLayout = ({ children, className = '' }) => {
  return (
    <div className={`w-[90%] max-w-7xl mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
};
