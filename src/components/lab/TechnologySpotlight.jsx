import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, HelpCircle, AlertCircle, Layers, X, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * TechnologySpotlight Component
 * Deep-dive glass spotlight panel revealing why Anurag uses the selected tech, problems it solves, and project references.
 */
export const TechnologySpotlight = ({ skill, onClose }) => {
  if (!skill) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="w-full mt-6"
      >
        <GlassCard className="p-6 sm:p-7 border-nebula-cyan/40 bg-black/60 shadow-2xl relative space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nebula-cyan/20 border border-nebula-cyan/50 flex items-center justify-center text-nebula-cyan shadow-cyanGlow/30">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-nebula-cyan uppercase font-bold tracking-wider">
                    TECHNOLOGY SPOTLIGHT
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-nebula-cyan animate-pulse" />
                </div>
                <h3 className="text-xl font-display font-bold text-starlight">{skill.name}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted hover:text-starlight hover:bg-white/10 focus-ring-cyan transition-colors"
              aria-label="Close Technology Spotlight"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3-Column Spotlight Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-body text-xs sm:text-sm">
            {/* Why I Use It */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Why Anurag Uses It</span>
              </div>
              <p className="text-muted leading-relaxed">{skill.whyIUseIt}</p>
            </div>

            {/* Problems Solved */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-quantum-violet uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>Problems Solved</span>
              </div>
              <p className="text-muted leading-relaxed">{skill.problemsSolved}</p>
            </div>

            {/* Practical Project Context */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase">
                <Layers className="w-4 h-4" />
                <span>Related Projects</span>
              </div>
              <p className="text-starlight font-semibold">{skill.relatedProject}</p>
              <p className="text-muted text-xs leading-relaxed">{skill.practicalUsage}</p>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-dim">
            <span>STATUS: <strong className="text-nebula-cyan">{skill.status}</strong></span>
            <span className="flex items-center gap-1 text-starlight hover:text-nebula-cyan cursor-pointer" onClick={onClose}>
              Click card or ESC to dismiss <X className="w-3.5 h-3.5" />
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};
