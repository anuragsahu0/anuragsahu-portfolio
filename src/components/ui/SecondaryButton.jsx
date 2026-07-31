import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Secondary Button Component
 * Frosted glass button with subtle border highlight and cyan hover state.
 */
export const SecondaryButton = ({
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
        'inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-pill font-display font-semibold text-sm text-starlight bg-space-surface border border-white/10 backdrop-blur-glass transition-all duration-200 ease-smooth hover:border-nebula-cyan hover:bg-nebula-cyan/10 hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-ring-cyan',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
