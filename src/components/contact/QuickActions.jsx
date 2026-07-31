import React from 'react';
import { Calendar, FileText, Layers, Github, Linkedin } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SITE_CONFIG } from '@/constants/config';

/**
 * QuickActions Component
 * 1-click recruiter quick actions (Schedule Interview, Download Resume, View Projects, GitHub, LinkedIn).
 */
export const QuickActions = ({ onCopyEmail }) => {
  const handleScheduleClick = () => {
    onCopyEmail();
    alert('Direct recruiter email copied to clipboard! Anurag is ready to schedule introductory phone or technical interviews.');
  };

  const handleViewProjectsClick = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <GlassCard className="p-6 space-y-4 border-white/10 bg-black/40">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs font-bold text-quantum-violet uppercase tracking-wider">
        <Calendar className="w-4 h-4 text-quantum-violet" />
        <span>RECRUITER FAST-TRACK ACTIONS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MagneticButton className="w-full">
          <SecondaryButton onClick={handleScheduleClick} className="w-full justify-center text-xs">
            <Calendar className="w-4 h-4 text-gravity-amber" />
            <span>Schedule Interview</span>
          </SecondaryButton>
        </MagneticButton>

        <MagneticButton className="w-full">
          <SecondaryButton onClick={() => window.open('/assets/resume.pdf', '_blank')} className="w-full justify-center text-xs">
            <FileText className="w-4 h-4 text-nebula-cyan" />
            <span>Download Resume</span>
          </SecondaryButton>
        </MagneticButton>

        <MagneticButton className="w-full">
          <SecondaryButton onClick={handleViewProjectsClick} className="w-full justify-center text-xs">
            <Layers className="w-4 h-4 text-quantum-violet" />
            <span>View Projects</span>
          </SecondaryButton>
        </MagneticButton>

        <MagneticButton className="w-full">
          <SecondaryButton onClick={() => window.open(SITE_CONFIG.github, '_blank')} className="w-full justify-center text-xs">
            <Github className="w-4 h-4 text-nebula-cyan" />
            <span>GitHub</span>
          </SecondaryButton>
        </MagneticButton>
      </div>
    </GlassCard>
  );
};
