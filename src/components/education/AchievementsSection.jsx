import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { AchievementCard } from './AchievementCard';
import { ACHIEVEMENTS_DATA } from '@/data/educationData';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * AchievementsSection Component
 * Displays achievement cards alongside a polished upcoming milestone placeholder.
 */
export const AchievementsSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-quantum-violet uppercase tracking-wider">
        <Trophy className="w-4 h-4 text-quantum-violet" />
        <span>ACHIEVEMENTS & COMPETITIVE MILESTONES</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS_DATA.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}

        {/* Polished "More Milestones Coming Soon" Card */}
        <GlassCard className="p-5 border-dashed border-white/20 bg-black/40 flex flex-col justify-center items-center text-center space-y-2">
          <Sparkles className="w-6 h-6 text-nebula-cyan animate-pulse" />
          <div className="font-display font-bold text-starlight text-xs">More Milestones Coming Soon</div>
          <p className="text-[11px] text-muted font-body max-w-xs">
            Actively participating in upcoming 2026 hackathons and open-source contributions.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
