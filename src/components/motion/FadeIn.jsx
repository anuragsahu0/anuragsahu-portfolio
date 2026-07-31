import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * FadeIn Component
 * Elegant page/section entrance animation with spring easing and prefers-reduced-motion safety.
 */
export const FadeIn = ({ children, delay = 0, duration = 0.5, direction = 'up', className, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  const directionOffsets = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialOffset = directionOffsets[direction] || directionOffsets.up;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
