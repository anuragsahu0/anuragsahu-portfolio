import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * TimelineItem Component
 * Single timeline milestone card with pulse dot and animated scroll reveal.
 */
export const TimelineItem = ({ year, title, badge, description, icon: Icon, isLast = false }) => {
  return (
    <div className="relative pl-8 sm:pl-10 pb-8 last:pb-0">
      {/* Vertical Connecting Line */}
      {!isLast && (
        <div className="absolute left-[15px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-nebula-cyan via-quantum-violet to-transparent" />
      )}

      {/* Node Dot Icon */}
      <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-space-black border-2 border-nebula-cyan flex items-center justify-center text-nebula-cyan shadow-cyanGlow/40 z-10">
        {Icon ? <Icon className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-nebula-cyan" />}
      </div>

      {/* Content Glass Card */}
      <GlassCard className="p-4 sm:p-5 space-y-2 border-white/10 hover:border-nebula-cyan/30 transition-all duration-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-nebula-cyan">{year}</span>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-quantum-violet/10 border border-quantum-violet/30 text-quantum-violet font-mono text-[10px] uppercase font-semibold">
              {badge}
            </span>
          )}
        </div>

        <h4 className="text-base font-display font-bold text-starlight">{title}</h4>
        <p className="text-xs sm:text-sm text-muted leading-relaxed font-body">{description}</p>
      </GlassCard>
    </div>
  );
};
