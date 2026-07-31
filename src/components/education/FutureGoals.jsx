import React from 'react';
import { Target, Flag } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FUTURE_GOALS_DATA } from '@/data/educationData';

/**
 * FutureGoals Component
 * Split into Next 12 Months vs Long-Term Vision.
 */
export const FutureGoals = () => {
  return (
    <GlassCard className="p-6 space-y-4 border-white/10">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">
        <Target className="w-4 h-4 text-nebula-cyan" />
        <span>GOALS & GROWTH OBJECTIVES</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
        {/* Next 12 Months */}
        <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan uppercase">
            <Flag className="w-3.5 h-3.5" />
            <span>Next 12 Months (Measurable)</span>
          </div>
          <ul className="space-y-1.5 text-muted leading-relaxed list-disc list-inside">
            {FUTURE_GOALS_DATA.shortTerm.map((goal, idx) => (
              <li key={idx}>{goal}</li>
            ))}
          </ul>
        </div>

        {/* Long-Term Vision */}
        <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-quantum-violet uppercase">
            <Target className="w-3.5 h-3.5" />
            <span>Long-Term Vision</span>
          </div>
          <ul className="space-y-1.5 text-muted leading-relaxed list-disc list-inside">
            {FUTURE_GOALS_DATA.longTerm.map((goal, idx) => (
              <li key={idx}>{goal}</li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
};
