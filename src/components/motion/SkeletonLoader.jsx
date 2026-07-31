import React from 'react';
import { cn } from '@/utils/cn';

/**
 * SkeletonLoader Component
 * Shimmering skeleton placeholder for smooth loading state transitions without CLS layout shift.
 */
export const SkeletonLoader = ({ className, height = 'h-4', width = 'w-full', rounded = 'rounded-lg' }) => {
  return (
    <div
      className={cn(
        'bg-white/5 animate-pulse relative overflow-hidden',
        height,
        width,
        rounded,
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
  );
};
