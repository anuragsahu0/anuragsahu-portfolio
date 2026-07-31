import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * RecruiterHighlights Component
 * Dedicated recruiter panel highlighting key technical capabilities demonstrated in a project.
 */
export const RecruiterHighlights = ({ highlights, className }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className={cn('p-4 rounded-xl bg-gravity-amber/5 border border-gravity-amber/30 space-y-2.5', className)}>
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-gravity-amber uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>WHAT SHOULD RECRUITERS NOTICE?</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-starlight">
            <CheckCircle2 className="w-3.5 h-3.5 text-gravity-amber shrink-0" />
            <span className="truncate">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
