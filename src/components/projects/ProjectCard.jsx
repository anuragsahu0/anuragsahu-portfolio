import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ChevronRight, Layers, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * ProjectCard Component
 * Interactive glass card displaying project metadata, complexity, last updated, tech badges, and case study trigger.
 */
export const ProjectCard = ({ project, onOpenCaseStudy }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard
        onClick={() => onOpenCaseStudy(project)}
        className="p-6 space-y-4 border-white/10 hover:border-nebula-cyan/40 cursor-pointer group transition-all duration-300 flex flex-col justify-between h-full"
        tabIndex={0}
        role="button"
        aria-label={`View Case Study for ${project.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenCaseStudy(project);
          }
        }}
      >
        <div className="space-y-3">
          {/* Top Status & Complexity Badges */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px]">
            <span className="px-2.5 py-0.5 rounded-full bg-nebula-cyan/10 border border-nebula-cyan/30 text-nebula-cyan font-bold uppercase">
              {project.status}
            </span>

            <span className="text-dim flex items-center gap-1">
              <Clock className="w-3 h-3 text-quantum-violet" />
              <span>{project.lastUpdated}</span>
            </span>
          </div>

          {/* Project Title */}
          <h4 className="text-lg font-display font-bold text-starlight group-hover:text-nebula-cyan transition-colors">
            {project.title}
          </h4>

          {/* Summary */}
          <p className="text-xs text-muted leading-relaxed font-body line-clamp-3">
            {project.shortSummary}
          </p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1 font-mono text-[11px] pt-1">
            {project.technologies?.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-starlight">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-muted">
          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-nebula-cyan transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-nebula-cyan transition-colors"
              aria-label="Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <span className="text-nebula-cyan font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Case Study <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
};
