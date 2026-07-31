import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * HighlightChips Component
 * Renders candidate highlight badges with smooth stagger entrance & hover elevation.
 */
export const HighlightChips = ({ chips }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 350, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="flex flex-wrap gap-2.5 pt-2"
    >
      {chips.map((chip) => (
        <motion.span
          key={chip.id}
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.03 }}
          className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-starlight hover:border-nebula-cyan/50 hover:bg-nebula-cyan/10 transition-colors shadow-glass select-none cursor-default"
        >
          {chip.label}
        </motion.span>
      ))}
    </motion.div>
  );
};
