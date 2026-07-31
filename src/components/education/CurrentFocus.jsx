import React from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CURRENT_FOCUS_DATA } from '@/data/educationData';

/**
 * CurrentFocus Component
 * Compact panel describing Anurag's current priorities.
 */
export const CurrentFocus = () => {
  return (
    <GlassCard className="p-6 space-y-3 border-white/10 bg-black/40">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs font-bold text-gravity-amber uppercase tracking-wider">
        <Flame className="w-4 h-4 text-gravity-amber animate-pulse" />
        <span>CURRENT ACADEMIC & ENGINEERING PRIORITIES</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        {CURRENT_FOCUS_DATA.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 text-starlight">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
