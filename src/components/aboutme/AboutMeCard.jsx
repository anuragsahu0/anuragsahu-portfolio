import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { HighlightChips } from './HighlightChips';
import { ABOUT_ME_DATA } from '@/data/aboutMeData';
import { Sparkles, Terminal } from 'lucide-react';

/**
 * AboutMeCard Component
 * Left-side glass container rendering candidate narrative paragraphs and highlight chips.
 */
export const AboutMeCard = () => {
  const { paragraphs, chips } = ABOUT_ME_DATA;

  return (
    <GlassCard className="p-6 sm:p-8 space-y-6 border-white/10 shadow-xl relative">
      {/* Header Tag */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-nebula-cyan" />
          <span>PERSONAL NARRATIVE & BACKGROUND</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-nebula-cyan/10 border border-nebula-cyan/30 text-nebula-cyan font-mono text-xs font-semibold">
          SOPHOMORE PROFILE
        </span>
      </div>

      {/* Narrative Paragraphs */}
      <div className="space-y-4 text-sm md:text-base text-muted leading-relaxed font-body text-left">
        <p>
          Hi, I'm <strong className="text-starlight font-bold">Anurag Sahu</strong>, a B.Tech student in <strong className="text-nebula-cyan font-bold">Computer Science & Engineering (AI & ML)</strong> at <strong className="text-starlight font-semibold">Maharana Pratap Institute of Professional Studies</strong>.
        </p>

        <p>
          I am passionate about building modern, scalable web applications and continuously improving my problem-solving skills.
        </p>

        <p>
          My current focus is <strong className="text-nebula-cyan font-bold">Full-Stack Development</strong>, where I work with both frontend and backend technologies to create responsive, efficient, and user-centric solutions.
        </p>

        <p>
          I enjoy learning new technologies, taking on challenging projects, and writing clean, maintainable code.
        </p>

        <p>
          I'm actively seeking opportunities to contribute, grow as a developer, and deliver meaningful software that creates real-world impact.
        </p>
      </div>

      {/* Highlight Chips Row */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <span className="text-[11px] font-mono text-dim uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-nebula-cyan" />
          Candidate Highlights
        </span>
        <HighlightChips chips={chips} />
      </div>
    </GlassCard>
  );
};
