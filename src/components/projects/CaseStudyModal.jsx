import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Terminal, Sparkles, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { RecruiterHighlights } from './RecruiterHighlights';
import { EngineeringMetrics } from './EngineeringMetrics';
import { ProjectTimeline } from './ProjectTimeline';
import { ImageGallery } from './ImageGallery';

/**
 * CaseStudyModal Component
 * Full-featured engineering case study modal detailing architecture, metrics, trade-offs, and recruiter highlights.
 */
export const CaseStudyModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const cs = project.caseStudy || {};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Case Study: ${project.title}`}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl bg-[#050914] border border-nebula-cyan/40 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col font-body"
        >
          {/* Modal Header */}
          <div className="bg-white/5 p-5 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nebula-cyan/20 border border-nebula-cyan/50 flex items-center justify-center text-nebula-cyan">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-nebula-cyan font-bold uppercase tracking-wider">
                    ENGINEERING CASE STUDY
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-nebula-cyan animate-pulse" />
                </div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-starlight">{project.title}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted hover:text-starlight hover:bg-white/10 focus-ring-cyan transition-colors"
              aria-label="Close Case Study Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body Content (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-muted">
            
            {/* Recruiter Highlights Panel */}
            <RecruiterHighlights highlights={project.recruiterHighlights} />

            {/* Benchmark Metrics Grid */}
            <EngineeringMetrics metrics={project.metrics} />

            {/* Image Gallery Screenshots Carousel */}
            <ImageGallery images={project.images} />

            {/* Problem & Motivation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <h4 className="font-mono text-xs font-bold text-starlight uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-gravity-amber" />
                  <span>Problem Statement</span>
                </h4>
                <p>{cs.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <h4 className="font-mono text-xs font-bold text-starlight uppercase flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-nebula-cyan" />
                  <span>Engineering Motivation</span>
                </h4>
                <p>{cs.motivation}</p>
              </div>
            </div>

            {/* Architecture Diagram */}
            <ArchitectureDiagram architecture={project.architecture} />

            {/* Challenges, Solutions & Trade-offs */}
            <div className="space-y-3 p-5 rounded-xl bg-black/40 border border-white/10">
              <h4 className="font-mono text-xs font-bold text-starlight uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Technical Challenges & Architectural Trade-Offs</span>
              </h4>

              <div className="space-y-2 font-body text-xs">
                <div>
                  <strong className="text-gravity-amber font-mono">Challenge:</strong> {cs.challenges}
                </div>
                <div>
                  <strong className="text-emerald-400 font-mono">Solution:</strong> {cs.solutions}
                </div>
                <div>
                  <strong className="text-quantum-violet font-mono">Trade-Off:</strong> {cs.tradeOffs}
                </div>
              </div>
            </div>

            {/* Lifecycle Timeline */}
            <ProjectTimeline timeline={project.timeline} />

            {/* Performance, Accessibility & Security */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                <div className="text-nebula-cyan font-bold uppercase">⚡ Performance</div>
                <div className="text-muted">{cs.performance}</div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                <div className="text-quantum-violet font-bold uppercase">♿ Accessibility</div>
                <div className="text-muted">{cs.accessibility}</div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                <div className="text-emerald-400 font-bold uppercase">🔒 Security & Auth</div>
                <div className="text-muted">{cs.security}</div>
              </div>
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 font-mono text-xs text-dim">
              <span>DEPLOYMENT: <strong className="text-starlight">{project.deployment}</strong></span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-nebula-cyan/50 text-starlight hover:text-nebula-cyan transition-colors"
              >
                <Github className="w-4 h-4 text-nebula-cyan" />
                <span>GitHub Repository</span>
              </a>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-nebula-cyan/20 border border-nebula-cyan/50 text-nebula-cyan font-bold hover:bg-nebula-cyan/30 transition-colors shadow-cyanGlow/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Project Demo</span>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
