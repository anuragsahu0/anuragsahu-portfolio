import React from 'react';
import { motion } from 'framer-motion';
import { SKILL_CATEGORIES } from '@/data/skillsData';
import { cn } from '@/utils/cn';

/**
 * CategoryTabs Component
 * Interactive category filter buttons with Framer Motion active pill indicator.
 */
export const CategoryTabs = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto p-1.5 rounded-2xl bg-black/40 border border-white/10 glass-panel">
      {SKILL_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'relative px-4 py-2 text-xs font-mono font-medium rounded-xl transition-all duration-200 focus-ring-cyan',
              isActive ? 'text-starlight font-semibold' : 'text-muted hover:text-starlight hover:bg-white/5'
            )}
            aria-pressed={isActive}
            aria-label={`Filter by ${cat.label}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeLabTab"
                className="absolute inset-0 bg-nebula-cyan/20 border border-nebula-cyan/50 rounded-xl -z-10 shadow-cyanGlow/20"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
