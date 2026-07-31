import React from 'react';
import { Sparkles, GraduationCap, Briefcase, Github, Linkedin, FileText, CheckCircle2, Layers } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SITE_CONFIG } from '@/constants/config';
import { cn } from '@/utils/cn';

/**
 * ProfileCard Component
 * Glass profile card featuring Anurag Sahu's official professional portrait in a rounded rectangle frame.
 */
export const ProfileCard = ({ className }) => {
  return (
    <GlassCard className={cn('p-6 sm:p-7 space-y-5 border-white/10 shadow-2xl relative group', className)}>
      {/* Top Header: Official Portrait & Title */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        {/* Rounded Rectangle Glassmorphism Portrait Frame with Cyan Glow */}
        <div className="relative w-20 h-24 rounded-2xl bg-gradient-to-br from-nebula-cyan/20 to-quantum-violet/20 border border-nebula-cyan/40 p-1 shadow-cyanGlow/30 overflow-hidden shrink-0 group-hover:scale-[1.03] transition-transform duration-300">
          <picture>
            <source srcSet="/assets/anurag-portrait-sm.webp" type="image/webp" />
            <img
              src="/assets/anurag-portrait-sm.jpg"
              alt="Professional portrait of Anurag Sahu, B.Tech CSE (AI & ML) student and Full-Stack Developer."
              width="80"
              height="96"
              loading="eager"
              className="w-full h-full object-cover rounded-xl"
            />
          </picture>
          <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-space-black animate-pulse" title="Available for Summer 2026 Internships" />
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-starlight flex items-center gap-2">
            <span>{SITE_CONFIG.name}</span>
            <Sparkles className="w-4 h-4 text-nebula-cyan animate-pulse" />
          </h2>
          <p className="text-xs font-mono text-nebula-cyan font-semibold">{SITE_CONFIG.role}</p>
          <p className="text-[11px] text-muted font-mono">{SITE_CONFIG.education}</p>
        </div>
      </div>

      {/* Profile Metrics Matrix */}
      <div className="space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-muted flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-quantum-violet" />
            Education
          </span>
          <span className="text-starlight font-semibold">B.Tech CSE (AI & ML)</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-muted flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-nebula-cyan" />
            Availability
          </span>
          <span className="text-emerald-400 font-bold">Open for Internship</span>
        </div>
      </div>

      {/* Engineering Focus Badges */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-dim uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-nebula-cyan" />
          Engineering Focus
        </span>
        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-starlight">AI & ML</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-starlight">Backend</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-starlight">Frontend</span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-starlight">Product Engineering</span>
        </div>
      </div>

      {/* Action Buttons: GitHub, LinkedIn, Resume */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <a
          href={SITE_CONFIG.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-nebula-cyan/50 text-xs font-mono text-starlight hover:text-nebula-cyan transition-all duration-200 focus-ring-cyan"
          aria-label="GitHub Profile"
        >
          <Github className="w-3.5 h-3.5 text-nebula-cyan" />
          <span>GitHub</span>
        </a>

        <a
          href={SITE_CONFIG.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-quantum-violet/50 text-xs font-mono text-starlight hover:text-quantum-violet transition-all duration-200 focus-ring-cyan"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="w-3.5 h-3.5 text-quantum-violet" />
          <span>LinkedIn</span>
        </a>

        <button
          onClick={() => window.open(SITE_CONFIG.resumeUrl, '_blank')}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-nebula-cyan/10 border border-nebula-cyan/30 hover:bg-nebula-cyan/20 text-xs font-mono text-nebula-cyan font-semibold transition-all duration-200 focus-ring-cyan"
          aria-label="Download Resume PDF"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume</span>
        </button>
      </div>

      {/* Verification Footer */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-muted">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Student Candidate</span>
        </span>
        <span className="text-dim">SYS_ACTIVE</span>
      </div>
    </GlassCard>
  );
};
