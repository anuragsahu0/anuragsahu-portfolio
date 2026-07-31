import React from 'react';
import { GraduationCap, Briefcase, Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ABOUT_ME_DATA } from '@/data/aboutMeData';

/**
 * ProfileSummaryCard Component
 * Right-side glass card featuring Anurag Sahu's portrait, education summary, college, focus, and internship availability status.
 */
export const ProfileSummaryCard = () => {
  const { summaryCard, portraitImageWebp, portraitImageJpg } = ABOUT_ME_DATA;

  return (
    <GlassCard className="p-6 sm:p-7 space-y-5 border-nebula-cyan/40 bg-black/60 shadow-2xl relative overflow-hidden group hover:border-nebula-cyan/60 transition-colors">
      {/* Light Reflection Glare Header */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

      {/* Top Header: Candidate Portrait & Name */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        {/* Rounded Rectangle Glass Portrait Frame */}
        <div className="relative w-20 h-24 rounded-2xl bg-gradient-to-br from-nebula-cyan/20 to-quantum-violet/20 border border-nebula-cyan/40 p-1 shadow-cyanGlow/30 overflow-hidden shrink-0 group-hover:scale-[1.03] transition-transform duration-300">
          <picture>
            <source srcSet={portraitImageWebp} type="image/webp" />
            <img
              src={portraitImageJpg}
              alt={`Professional portrait of ${summaryCard.name}, B.Tech CSE (AI & ML) student.`}
              width="80"
              height="96"
              loading="lazy"
              className="w-full h-full object-cover rounded-xl"
            />
          </picture>
          <span
            className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-space-black animate-pulse"
            title="Available for Summer 2026 Internships"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-display font-bold text-starlight flex items-center gap-2">
            <span>{summaryCard.name}</span>
            <Sparkles className="w-4 h-4 text-nebula-cyan animate-pulse" />
          </h3>
          <p className="text-xs font-mono text-nebula-cyan font-semibold">{summaryCard.education}</p>
          <p className="text-[11px] text-muted font-mono">{summaryCard.currentFocus}</p>
        </div>
      </div>

      {/* Detail Metrics List */}
      <div className="space-y-3 font-mono text-xs">
        {/* Name */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
          <span className="text-muted flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-nebula-cyan" />
            Name
          </span>
          <span className="text-starlight font-bold">{summaryCard.name}</span>
        </div>

        {/* Education */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
          <span className="text-muted flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-quantum-violet" />
            Education
          </span>
          <span className="text-starlight font-semibold text-right max-w-[180px] truncate">{summaryCard.education}</span>
        </div>

        {/* College */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="text-muted flex items-center gap-2 text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-nebula-cyan" />
            College / Institution
          </div>
          <div className="text-starlight font-semibold text-xs leading-snug">{summaryCard.college}</div>
        </div>

        {/* Current Focus */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
          <span className="text-muted flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-nebula-cyan" />
            Current Focus
          </span>
          <span className="text-starlight font-bold">{summaryCard.currentFocus}</span>
        </div>

        {/* Availability Status */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-bold">
          <span className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            Status
          </span>
          <span className="text-xs flex items-center gap-1">
            <span>{summaryCard.statusSymbol}</span>
            <span>{summaryCard.status}</span>
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
