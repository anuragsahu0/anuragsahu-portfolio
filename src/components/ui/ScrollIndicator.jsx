import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * ScrollIndicator Component
 * Animated floating telemetry scroll down indicator with accessibility attributes and smooth scroll click trigger.
 */
export const ScrollIndicator = () => {
  const handleScrollDown = () => {
    const nextSection = document.querySelector('#projects');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="flex flex-col items-center justify-center gap-2 cursor-pointer group"
      onClick={handleScrollDown}
      role="button"
      tabIndex={0}
      aria-label="Scroll down to featured engineering matrix"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleScrollDown();
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-nebula-cyan transition-colors">
        SCROLL TO EXPLORE
      </span>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-8 h-8 rounded-full border border-white/10 glass-panel flex items-center justify-center text-muted group-hover:border-nebula-cyan/50 group-hover:text-nebula-cyan transition-colors shadow-soft"
      >
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
};
