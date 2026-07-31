import React from 'react';
import { GitCommit } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * ProjectTimeline Component
 * Displays the project lifecycle milestones (Idea -> Planning -> Dev -> Optimization -> Deployment).
 */
export const ProjectTimeline = ({ timeline, className }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className={cn('p-5 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs', className)}>
      <div className="text-xs font-bold text-quantum-violet uppercase tracking-wider flex items-center gap-2">
        <GitCommit className="w-4 h-4 text-quantum-violet" />
        <span>PROJECT LIFECYCLE TIMELINE</span>
      </div>

      <div className="space-y-2.5">
        {timeline.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="px-2 py-0.5 rounded bg-quantum-violet/10 text-quantum-violet border border-quantum-violet/30 font-bold text-[10px] uppercase shrink-0">
              {item.phase}
            </span>
            <span className="text-muted font-body text-xs leading-relaxed">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
