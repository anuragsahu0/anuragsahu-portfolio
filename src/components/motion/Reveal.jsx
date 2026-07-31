import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reveal Component
 * Scroll reveal wrapper animating elements once as they enter the viewport.
 */
export const Reveal = ({ children, margin = '-80px', delay = 0, className, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={{
        duration: 0.6,
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
