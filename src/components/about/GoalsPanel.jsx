import React from 'react';
import { Target, Flag, Heart } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * GoalsPanel Component (Refined Measurable Goals)
 * Displays Anurag's measurable short-term goals, realistic long-term goals, and hobbies.
 */
export const GoalsPanel = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-12 gap-6', className)}>
      {/* Short-Term & Long-Term Goals */}
      <GlassCard className="md:col-span-8 p-6 space-y-4 border-white/10">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Target className="w-4 h-4 text-nebula-cyan" />
          <h4 className="font-display font-bold text-base text-starlight">Roadmap & Aspirations</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
          {/* Measurable Short-Term Goals */}
          <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan uppercase">
              <Flag className="w-3.5 h-3.5" />
              <span>Measurable Short-Term Goals</span>
            </div>
            <ul className="space-y-1.5 text-muted leading-relaxed list-disc list-inside">
              <li>Secure a Summer 2026 SWE or AI/ML Internship.</li>
              <li>Build 3 complete full-stack web applications.</li>
              <li>Solve 150+ Data Structures & Algorithms problems.</li>
            </ul>
          </div>

          {/* Realistic Long-Term Aspirations */}
          <div className="space-y-2 p-4 rounded-lg bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-quantum-violet uppercase">
              <Target className="w-3.5 h-3.5" />
              <span>Realistic Long-Term Aspirations</span>
            </div>
            <ul className="space-y-1.5 text-muted leading-relaxed list-disc list-inside">
              <li>Grow into a competent Full-Stack & AI Software Engineer.</li>
              <li>Build reliable software products that solve real user needs.</li>
              <li>Continuously learn modern system engineering practices.</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Beyond Coding (Hobbies & Interests) */}
      <GlassCard className="md:col-span-4 p-6 space-y-4 border-white/10 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Heart className="w-4 h-4 text-rose-400" />
            <h4 className="font-display font-bold text-base text-starlight">Beyond Coding</h4>
          </div>
          <p className="text-xs text-muted leading-relaxed font-body">
            When not writing code or studying for college coursework:
          </p>
          <ul className="space-y-1.5 font-mono text-xs text-starlight list-disc list-inside">
            <li>Reading engineering & AI blogs</li>
            <li>Solving logical puzzles</li>
            <li>Watching science & tech documentaries</li>
            <li>Playing chess</li>
          </ul>
        </div>

        <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-dim">
          BALANCED_PERSPECTIVE
        </div>
      </GlassCard>
    </div>
  );
};
