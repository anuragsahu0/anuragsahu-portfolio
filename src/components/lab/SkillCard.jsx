import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Sparkles, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * SkillCard Component
 * Displays an individual technology card with realistic status badge, practical usage, and spotlight click trigger.
 */
export const SkillCard = ({ skill, onSelectSkill, isSelected }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Building Projects With':
        return 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400';
      case 'Comfortable':
        return 'bg-nebula-cyan/10 border-nebula-cyan/30 text-nebula-cyan';
      case 'Currently Exploring':
        return 'bg-quantum-violet/10 border-quantum-violet/30 text-quantum-violet';
      case 'Learning':
        return 'bg-gravity-amber/10 border-gravity-amber/30 text-gravity-amber';
      default:
        return 'bg-white/10 border-white/20 text-muted';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard
        onClick={() => onSelectSkill(skill)}
        className={cn(
          'p-5 space-y-4 cursor-pointer transition-all duration-300 border-white/10 hover:border-nebula-cyan/40 group relative overflow-hidden',
          isSelected && 'border-nebula-cyan bg-nebula-cyan/5 shadow-cyanGlow/20'
        )}
        tabIndex={0}
        role="button"
        aria-label={`View Technology Spotlight for ${skill.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectSkill(skill);
          }
        }}
      >
        {/* Top Header: Name & Realistic Status Badge */}
        <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-nebula-cyan group-hover:scale-110 transition-transform duration-200">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-starlight flex items-center gap-1.5 group-hover:text-nebula-cyan transition-colors">
                <span>{skill.name}</span>
                {isSelected && <Sparkles className="w-3.5 h-3.5 text-nebula-cyan animate-pulse" />}
              </h4>
              <span className="text-[10px] font-mono text-dim uppercase tracking-wider">{skill.category}</span>
            </div>
          </div>

          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-semibold border shrink-0',
              getStatusBadge(skill.status)
            )}
          >
            {skill.status}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-muted leading-relaxed font-body line-clamp-2">
          {skill.description}
        </p>

        {/* Practical Usage Context */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1 text-[11px] font-mono">
          <div className="text-dim flex items-center gap-1.5 font-bold uppercase text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-nebula-cyan" />
            <span>Practical Context</span>
          </div>
          <div className="text-starlight text-[11px] truncate">{skill.practicalUsage}</div>
        </div>

        {/* Related Project Footer & Click Indicator */}
        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-muted">
          <span className="flex items-center gap-1 text-dim truncate">
            <Layers className="w-3 h-3 text-quantum-violet shrink-0" />
            <span className="truncate">{skill.relatedProject}</span>
          </span>
          <span className="text-nebula-cyan font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Spotlight <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
};
