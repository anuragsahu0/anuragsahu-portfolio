import React from 'react';
import { motion } from 'framer-motion';
import { PROJECT_CATEGORIES } from '@/data/projectsData';
import { cn } from '@/utils/cn';

/**
 * ProjectFilters Component
 * Category filter tabs with Framer Motion active pill sliding animation.
 */
export const ProjectFilters = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto p-1.5 rounded-2xl bg-black/40 border border-white/10 glass-panel">
      {PROJECT_CATEGORIES.map((cat) => {
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
            aria-label={`Filter projects by ${cat.label}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeProjectTab"
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
