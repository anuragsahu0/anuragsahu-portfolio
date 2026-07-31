import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * StaggerContainer Component
 * Container for list/grid items applying staggered child entrance animations.
 */
export const StaggerContainer = ({ children, staggerDelay = 0.08, className, ...props }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
