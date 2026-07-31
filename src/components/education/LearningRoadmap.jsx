import React from 'react';
import { Compass, ArrowUpRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { EDUCATION_ROADMAP } from '@/data/educationData';

/**
 * LearningRoadmap Component
 * Displays Anurag's engineering topic roadmap (System Design, Docker, Cloud, CI/CD).
 */
export const LearningRoadmap = () => {
  return (
    <GlassCard className="p-6 space-y-4 border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-quantum-violet uppercase tracking-wider">
          <Compass className="w-4 h-4 text-quantum-violet" />
          <span>TECHNICAL LEARNING ROADMAP</span>
        </div>
        <span className="font-mono text-[10px] text-dim">CONTINUOUS_SKILL_ACQUISITION</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {EDUCATION_ROADMAP.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 flex flex-col justify-between hover:border-quantum-violet/40 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-starlight font-bold text-xs">{item.topic}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-quantum-violet shrink-0" />
              </div>
              <p className="text-[11px] text-muted font-body leading-relaxed">{item.desc}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-quantum-violet/10 border border-quantum-violet/30 text-quantum-violet font-semibold self-start uppercase">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
