import React from 'react';
import { Sparkles, Code2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SITE_CONFIG } from '@/constants/config';
import { cn } from '@/utils/cn';

/**
 * StoryCard Component
 * Features Anurag Sahu's portrait naturally integrated alongside his personal narrative.
 */
export const StoryCard = ({ className }) => {
  return (
    <GlassCard className={cn('p-6 sm:p-8 space-y-6 border-white/10 shadow-xl relative', className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-4">
          {/* Integrated Smaller Portrait */}
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
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-starlight flex items-center gap-2">
              <span>The Story Behind the Code</span>
              <Sparkles className="w-4 h-4 text-nebula-cyan" />
            </h3>
            <p className="text-xs font-mono text-muted">{SITE_CONFIG.name} • {SITE_CONFIG.education}</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-nebula-cyan/10 border border-nebula-cyan/30 text-nebula-cyan font-mono text-xs font-semibold">
          NARRATIVE & VISION
        </span>
      </div>

      <div className="space-y-4 text-sm md:text-base text-muted leading-relaxed font-body">
        <p>
          My journey into software development started with a genuine curiosity for how websites and applications are constructed. That curiosity motivated me to choose Computer Science with an AI & Machine Learning specialization for my degree.
        </p>

        <p>
          As a second-year student, I focus on building a strong foundation in core computer science subjects — such as Data Structures & Algorithms, Object-Oriented Programming, and Linear Algebra — while actively practicing full-stack web development with <strong className="text-nebula-cyan font-semibold">React, Node.js, and Python</strong>.
        </p>

        <p>
          I believe in learning by building. Rather than just following tutorials, I work on practical projects to understand how different components of a software stack interact. I am eager to secure a <strong className="text-emerald-400 font-semibold">Summer 2026 Software Engineering or AI/ML Internship</strong> where I can apply my skills and grow within a professional team environment.
        </p>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-dim">
        <span className="flex items-center gap-1.5 text-nebula-cyan">
          <Code2 className="w-4 h-4" />
          <span>Driven by Curiosity & Continuous Practice</span>
        </span>
        <span>AUTH_NARRATIVE</span>
      </div>
    </GlassCard>
  );
};
