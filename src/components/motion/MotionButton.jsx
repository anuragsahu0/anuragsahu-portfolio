import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/utils/cn';

/**
 * MotionButton Component
 * Universal button interaction wrapper with hover elevation, subtle glow, press scale, loading states, and keyboard focus.
 */
export const MotionButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  className,
  type = 'button',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white/5 border border-white/10 text-starlight hover:border-nebula-cyan/50 hover:bg-white/10 hover:shadow-cyanGlow/20';
      case 'ghost':
        return 'bg-transparent text-muted hover:text-starlight hover:bg-white/5';
      default:
        return 'bg-gradient-to-r from-nebula-cyan to-cyan-400 text-space-black font-extrabold shadow-cyanGlow/40 hover:shadow-cyanGlow/80';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      whileHover={shouldReduceMotion || disabled || loading ? {} : { y: -2, scale: 1.02 }}
      whileTap={shouldReduceMotion || disabled || loading ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 focus-ring-cyan select-none cursor-pointer',
        getVariantStyles(),
        (disabled || loading) && 'opacity-60 cursor-not-allowed shadow-none hover:transform-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-1 text-current" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
