import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * MotionCard Component
 * Universal glass card interaction wrapper with hover lift, soft cyan depth shadow, and spring transition.
 */
export const MotionCard = ({ children, className, onClick, hoverable = true, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={onClick}
      whileHover={shouldReduceMotion || !hoverable ? {} : { y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        'glass-panel rounded-2xl border border-white/10 bg-black/60 shadow-glass transition-colors duration-300 relative overflow-hidden',
        hoverable && 'hover:border-nebula-cyan/40 hover:shadow-cyanGlow/20 hover:bg-black/70 cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Light Reflection Glare Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-2xl" />
      {children}
    </motion.div>
  );
};
