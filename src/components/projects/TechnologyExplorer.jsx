import React from 'react';
import { Filter, X } from 'lucide-react';
import { ALL_TECH_TAGS } from '@/data/projectsData';
import { cn } from '@/utils/cn';

/**
 * TechnologyExplorer Component
 * Interactive technology filter badges allowing recruiters to filter by stack (e.g. PyTorch, React, C++).
 */
export const TechnologyExplorer = ({ activeTech, onSelectTech }) => {
  return (
    <div className="flex flex-col items-center gap-2 max-w-3xl mx-auto pt-2">
      <div className="flex items-center gap-2 text-xs font-mono text-dim uppercase tracking-wider">
        <Filter className="w-3.5 h-3.5 text-nebula-cyan" />
        <span>Filter by Technology Stack</span>
        {activeTech && (
          <button
            onClick={() => onSelectTech(null)}
            className="ml-2 text-nebula-cyan underline flex items-center gap-1 hover:text-starlight"
          >
            Clear ({activeTech}) <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs">
        {ALL_TECH_TAGS.map((tech) => {
          const isSelected = activeTech === tech;
          return (
            <button
              key={tech}
              onClick={() => onSelectTech(isSelected ? null : tech)}
              className={cn(
                'px-3 py-1 rounded-lg border transition-all duration-200 focus-ring-cyan',
                isSelected
                  ? 'bg-nebula-cyan/20 border-nebula-cyan text-nebula-cyan font-bold shadow-cyanGlow/20'
                  : 'bg-white/5 border-white/10 text-muted hover:text-starlight hover:border-white/30'
              )}
              aria-pressed={isSelected}
            >
              {tech}
            </button>
          );
        })}
      </div>
    </div>
  );
};
