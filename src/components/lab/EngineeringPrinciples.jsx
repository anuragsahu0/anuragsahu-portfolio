import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ENGINEERING_PRINCIPLES } from '@/data/skillsData';

/**
 * EngineeringPrinciples Component
 * Displays Anurag's engineering principles: Clean Code, Performance, Accessibility, Scalability, Maintainability, UX.
 */
export const EngineeringPrinciples = () => {
  return (
    <GlassCard className="p-6 space-y-4 border-white/10">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-nebula-cyan" />
        <span>ENGINEERING PILLARS & STANDARDS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        {ENGINEERING_PRINCIPLES.map((principle, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5 hover:border-nebula-cyan/30 transition-colors">
            <h5 className="font-display font-bold text-starlight text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-nebula-cyan" />
              {principle.name}
            </h5>
            <p className="text-muted font-body leading-relaxed text-[11px]">{principle.desc}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
