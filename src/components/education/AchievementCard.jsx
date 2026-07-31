import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * AchievementCard Component
 * Displays hackathon, academic honor, or coding contest achievement.
 */
export const AchievementCard = ({ achievement }) => {
  return (
    <GlassCard className="p-5 space-y-2 border-white/10 hover:border-quantum-violet/40 transition-colors">
      <div className="flex items-center justify-between font-mono text-[10px]">
        <span className="px-2.5 py-0.5 rounded-full bg-quantum-violet/10 border border-quantum-violet/30 text-quantum-violet font-bold uppercase">
          {achievement.category}
        </span>
        <span className="text-dim">{achievement.date}</span>
      </div>

      <h4 className="font-display font-bold text-sm text-starlight flex items-center gap-1.5">
        <Trophy className="w-4 h-4 text-gravity-amber shrink-0" />
        <span>{achievement.title}</span>
      </h4>

      <p className="text-xs text-muted leading-relaxed font-body">{achievement.desc}</p>
    </GlassCard>
  );
};
