import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, ChevronDown, Sparkles, Layers, Cpu, Code2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * RoadmapNode Component
 * Individual interactive timeline node in the Engineering Roadmap.
 */
export const RoadmapNode = ({ project, isLast = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStatusBadgeStyle = (statusVariant) => {
    switch (statusVariant) {
      case 'cyan':
        return 'bg-nebula-cyan/10 border-nebula-cyan/30 text-nebula-cyan';
      case 'amber':
        return 'bg-amber-400/10 border-amber-400/30 text-amber-400';
      case 'purple':
        return 'bg-quantum-violet/10 border-quantum-violet/30 text-quantum-violet';
      default:
        return 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400';
    }
  };

  const getProgressBarColor = (statusVariant) => {
    switch (statusVariant) {
      case 'cyan':
        return 'bg-gradient-to-r from-nebula-cyan to-cyan-400';
      case 'amber':
        return 'bg-gradient-to-r from-amber-400 to-amber-500';
      case 'purple':
        return 'bg-gradient-to-r from-quantum-violet to-purple-400';
      default:
        return 'bg-gradient-to-r from-emerald-400 to-teal-400';
    }
  };

  return (
    <div className="relative flex gap-6 sm:gap-8 group">
      {/* Left Vertical Timeline Connector Line & Node Symbol */}
      <div className="flex flex-col items-center shrink-0 relative">
        {/* Node Badge Glyph */}
        <div className="w-12 h-12 rounded-2xl bg-black/80 border border-white/15 flex items-center justify-center font-mono font-bold text-sm text-starlight shadow-lg group-hover:border-nebula-cyan/60 group-hover:shadow-cyanGlow/30 transition-all duration-300 z-10">
          <span className="text-nebula-cyan">{project.number}</span>
        </div>

        {/* Animated Connecting Line */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-nebula-cyan/40 via-white/10 to-transparent my-2" />
        )}
      </div>

      {/* Right Content Card */}
      <div className="flex-1 pb-10">
        <GlassCard className="p-6 sm:p-7 space-y-5 border-white/10 hover:border-nebula-cyan/40 transition-colors shadow-xl relative">
          {/* Node Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span className="text-dim uppercase">{project.category}</span>
                <span>•</span>
                <span className="text-nebula-cyan">{project.lastUpdated}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-starlight mt-1 flex items-center gap-2">
                <span>{project.name}</span>
                {project.status === 'Working' && <Sparkles className="w-4 h-4 text-nebula-cyan animate-pulse" />}
              </h3>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'px-3.5 py-1 rounded-full border font-mono text-xs font-bold flex items-center gap-1.5 shrink-0',
                  getStatusBadgeStyle(project.statusVariant)
                )}
              >
                <span>{project.statusSymbol}</span>
                <span>Status: {project.status}</span>
              </span>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-nebula-cyan/40 text-muted hover:text-starlight transition-colors"
                aria-label="Toggle project details"
              >
                <ChevronDown className={cn('w-4 h-4 transform transition-transform duration-300', isExpanded && 'rotate-180')} />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted text-sm leading-relaxed font-body">
            {project.description}
          </p>

          {/* Progress Indicator Bar */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-starlight font-semibold">
              <span className="flex items-center gap-1.5 text-muted">
                <Clock className="w-3.5 h-3.5 text-nebula-cyan" />
                <span>Completion Status</span>
              </span>
              <span className="text-nebula-cyan font-bold">{project.progressLabel}</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${project.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn('h-full rounded-full', getProgressBarColor(project.statusVariant))}
              />
            </div>
          </div>

          {/* Expandable Module Breakdown */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-2 border-t border-white/10 overflow-hidden"
              >
                {/* Current Focus / Planned Modules */}
                {project.currentFocus && project.currentFocus.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-mono text-xs text-nebula-cyan font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Current Sprint Focus</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                      {project.currentFocus.map((focus, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 text-starlight">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{focus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.plannedModules && project.plannedModules.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-mono text-xs text-quantum-violet font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Planned Modules & Features</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                      {project.plannedModules.map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 text-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-quantum-violet shrink-0" />
                          <span className="truncate">{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technology Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-mono text-[11px] text-dim uppercase tracking-wider flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-nebula-cyan" />
                    <span>Technology Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-starlight">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};
