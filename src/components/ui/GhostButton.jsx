import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Ghost Button Component
 * Borderless minimal button for icon triggers, modal closing, and secondary navigation.
 */
export const GhostButton = ({
  children,
  className,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-muted hover:text-nebula-cyan hover:bg-white/5 transition-all duration-150 ease-smooth active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-ring-cyan',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
