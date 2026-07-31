import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Sparkles, Terminal, Layers, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cn } from '@/utils/cn';

/**
 * FeaturedProject Component
 * Dedicated hero layout for Anurag's top flagship project.
 */
export const FeaturedProject = ({ project, onOpenCaseStudy }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <GlassCard className="p-6 sm:p-8 border-nebula-cyan/40 bg-black/60 shadow-2xl relative overflow-hidden group space-y-6">
        {/* Top Flagship Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-nebula-cyan animate-pulse" />
            <span>FLAGSHIP FEATURED ENGINEERING CASE STUDY</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-bold uppercase">
              {project.status}
            </span>
            <span className="px-3 py-1 rounded-full bg-quantum-violet/10 border border-quantum-violet/30 text-quantum-violet font-bold uppercase">
              COMPLEXITY: {project.complexity}
            </span>
          </div>
        </div>

        {/* 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Details & Actions */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-starlight tracking-tight">
              {project.title}
            </h3>

            <p className="text-muted text-sm sm:text-base leading-relaxed font-body">
              {project.shortSummary}
            </p>

            {/* Problem Solved Snippet */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 font-mono text-xs">
              <div className="text-nebula-cyan font-bold uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Problem Solved</span>
              </div>
              <div className="text-starlight font-body text-xs leading-relaxed">{project.caseStudy?.problem}</div>
            </div>

            {/* Recruiter Highlights Quick Matrix */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono text-dim uppercase tracking-wider">Recruiter Highlights</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-xs text-starlight">
                {project.recruiterHighlights?.slice(0, 4).map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gravity-amber shrink-0" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Badges */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs pt-2">
              {project.technologies?.map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-starlight">
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 items-center pt-2">
              <MagneticButton>
                <PrimaryButton onClick={() => onOpenCaseStudy(project)}>
                  <span>Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
              </MagneticButton>

              <MagneticButton>
                <SecondaryButton onClick={() => window.open(project.githubUrl, '_blank')}>
                  <Github className="w-4 h-4 text-nebula-cyan" />
                  <span>GitHub</span>
                </SecondaryButton>
              </MagneticButton>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono text-muted hover:text-nebula-cyan transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Diagram / Graphic Viewport */}
          <div className="lg:col-span-5 w-full">
            <div className="aspect-video lg:aspect-square rounded-2xl bg-space-black border border-nebula-cyan/30 p-6 flex flex-col justify-between shadow-2xl relative group-hover:border-nebula-cyan transition-colors">
              <div className="flex items-center justify-between font-mono text-xs text-nebula-cyan">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  GNN TENSOR CANYON
                </span>
                <span>14ms / FRAME</span>
              </div>

              <div className="my-auto text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-br from-nebula-cyan/20 to-quantum-violet/20 border border-nebula-cyan flex items-center justify-center text-nebula-cyan shadow-cyanGlow/40">
                  <Terminal className="w-8 h-8 animate-pulse" />
                </div>
                <div className="font-mono text-xs font-bold text-starlight">PyTorch Graph Neural Network</div>
                <div className="font-mono text-[10px] text-dim">98.4% Physics Approximation Accuracy</div>
              </div>

              <button
                onClick={() => onOpenCaseStudy(project)}
                className="w-full py-2 rounded-lg bg-nebula-cyan/15 border border-nebula-cyan/40 text-nebula-cyan font-mono text-xs font-bold hover:bg-nebula-cyan/25 transition-colors text-center"
              >
                Launch Deep Case Study Modal →
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
