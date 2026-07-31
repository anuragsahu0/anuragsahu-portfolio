import React from 'react';
import { HelpCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FAQ_ITEMS } from '@/data/contactData';

/**
 * FAQSection Component
 * Compact recruiter FAQ answers addressing response speed, communication, relocation, and internship timeline.
 */
export const FAQSection = () => {
  return (
    <GlassCard className="p-6 space-y-4 border-white/10">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">
        <HelpCircle className="w-4 h-4 text-nebula-cyan" />
        <span>RECRUITER FREQUENTLY ASKED QUESTIONS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5 hover:border-nebula-cyan/30 transition-colors">
            <h4 className="font-display font-bold text-starlight text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-nebula-cyan" />
              {item.q}
            </h4>
            <p className="text-muted text-[11px] leading-relaxed font-body">{item.a}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
