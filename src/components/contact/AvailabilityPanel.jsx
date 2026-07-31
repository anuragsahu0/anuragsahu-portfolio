import React from 'react';
import { Briefcase, CheckCircle2, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AVAILABILITY_STATUS } from '@/data/contactData';

/**
 * AvailabilityPanel Component
 * Elegant status panel showcasing Anurag's internship status, target roles, and work mode flexibility.
 */
export const AvailabilityPanel = () => {
  return (
    <GlassCard className="p-6 space-y-4 border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>CURRENT INTERNSHIP AVAILABILITY</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-mono text-[10px] font-bold uppercase">
          ACTIVE STATUS
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
          <div className="text-dim text-[10px] uppercase font-bold">Primary Objective</div>
          <div className="text-starlight font-bold text-sm text-emerald-400">{AVAILABILITY_STATUS.currentStatus}</div>
        </div>

        <div className="space-y-1.5">
          <div className="text-dim text-[10px] uppercase font-bold">Target Engineering Roles</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-starlight text-xs">
            {AVAILABILITY_STATUS.interestedIn.map((role, idx) => (
              <div key={idx} className="flex items-center gap-1.5 p-2 rounded-md bg-white/5 border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-nebula-cyan shrink-0" />
                <span className="truncate">{role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted text-xs pt-1 border-t border-white/10">
          <Globe className="w-4 h-4 text-quantum-violet shrink-0" />
          <span>Work Preference: <strong className="text-starlight">{AVAILABILITY_STATUS.workMode}</strong></span>
        </div>
      </div>
    </GlassCard>
  );
};
