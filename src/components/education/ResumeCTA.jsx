import React from 'react';
import { FileText, Linkedin, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SITE_CONFIG } from '@/constants/config';

/**
 * ResumeCTA Component
 * Premium call-to-action panel featuring Anurag Sahu's portrait and availability badge.
 */
export const ResumeCTA = ({ onCopyEmail }) => {
  return (
    <GlassCard className="p-8 text-center border-nebula-cyan/40 bg-black/60 shadow-2xl relative overflow-hidden space-y-6">
      {/* Compact Candidate Profile Snapshot */}
      <div className="flex items-center justify-center gap-4">
        <div className="relative w-14 h-16 rounded-xl bg-gradient-to-br from-nebula-cyan/20 to-quantum-violet/20 border border-nebula-cyan/40 p-0.5 shadow-cyanGlow/20 overflow-hidden shrink-0">
          <picture>
            <source srcSet="/assets/anurag-portrait-sm.webp" type="image/webp" />
            <img
              src="/assets/anurag-portrait-sm.jpg"
              alt="Professional portrait of Anurag Sahu, B.Tech CSE (AI & ML) student and Full-Stack Developer."
              width="56"
              height="64"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
            />
          </picture>
          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-space-black animate-pulse" />
        </div>

        <div className="text-left font-mono">
          <div className="text-starlight font-bold text-base flex items-center gap-1.5">
            <span>{SITE_CONFIG.name}</span>
            <Sparkles className="w-3.5 h-3.5 text-nebula-cyan" />
          </div>
          <div className="text-nebula-cyan text-xs font-semibold">{SITE_CONFIG.role}</div>
          <div className="text-emerald-400 text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Open for Summer 2026 Internships</span>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-2">
        <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-starlight">
          Ready to review {SITE_CONFIG.shortName}'s full candidacy?
        </h3>
        <p className="text-muted text-sm leading-relaxed font-body">
          Download the latest ATS-ready resume PDF, inspect source code on GitHub, or initiate direct email correspondence.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <MagneticButton>
          <PrimaryButton onClick={() => window.open(SITE_CONFIG.resumeUrl, '_blank')} aria-label="Download Resume PDF">
            <FileText className="w-4 h-4" />
            <span>Download Resume PDF</span>
          </PrimaryButton>
        </MagneticButton>

        <MagneticButton>
          <SecondaryButton onClick={() => window.open(SITE_CONFIG.linkedin, '_blank')} aria-label="View LinkedIn Profile">
            <Linkedin className="w-4 h-4 text-quantum-violet" />
            <span>LinkedIn Profile</span>
          </SecondaryButton>
        </MagneticButton>

        <MagneticButton>
          <SecondaryButton onClick={onCopyEmail} aria-label="Copy Direct Email Address">
            <Mail className="w-4 h-4 text-nebula-cyan" />
            <span>Copy Email</span>
          </SecondaryButton>
        </MagneticButton>
      </div>
    </GlassCard>
  );
};
