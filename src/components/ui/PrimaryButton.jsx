import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Primary Button Component
 * Design System CTA element with linear gradient background, cyan glow shadow, and spring physics hover.
 */
export const PrimaryButton = ({
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
        'inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-pill font-display font-semibold text-sm text-starlight bg-gradient-to-r from-nebula-cyan to-quantum-violet shadow-cyanGlow transition-all duration-200 ease-spring active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none focus-ring-cyan',
        'hover:-translate-y-0.5 hover:shadow-cyanGlow',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
