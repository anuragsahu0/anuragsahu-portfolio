import React from 'react';
import { GraduationCap, CheckCircle2, Award } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * TimelineItem Component
 * Single education timeline card displaying institution, degree, duration, current status, and highlights.
 */
export const TimelineItem = ({ item, isLast }) => {
  return (
    <div className="relative pl-8 sm:pl-10 pb-8 last:pb-0">
      {/* Vertical Connecting Beam */}
      {!isLast && (
        <div className="absolute left-[15px] top-6 bottom-0 w-[2px] bg-gradient-to-b from-nebula-cyan via-quantum-violet to-transparent" />
      )}

      {/* Node Icon */}
      <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-space-black border-2 border-nebula-cyan flex items-center justify-center text-nebula-cyan shadow-cyanGlow/40 z-10">
        <GraduationCap className="w-4 h-4" />
      </div>

      <GlassCard className="p-5 sm:p-6 space-y-4 border-white/10 hover:border-nebula-cyan/30 transition-all duration-200">
        {/* Header: Degree & Duration */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">{item.duration}</span>
            <h4 className="text-base sm:text-lg font-display font-bold text-starlight mt-0.5">{item.degree}</h4>
            <p className="text-xs font-mono text-muted">{item.institution} • {item.location}</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-mono text-[11px] font-bold">
            {item.currentStatus}
          </span>
        </div>

        {/* Highlights */}
        {item.highlights && (
          <div className="space-y-1.5 font-mono text-xs">
            <div className="text-dim uppercase text-[10px] flex items-center gap-1 font-bold">
              <Award className="w-3.5 h-3.5 text-quantum-violet" />
              <span>Key Highlights</span>
            </div>
            <div className="space-y-1 text-starlight">
              {item.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-nebula-cyan shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coursework Tags */}
        {item.relevantCoursework && (
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px] pt-1">
            {item.relevantCoursework.map((course) => (
              <span key={course} className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-muted">
                {course}
              </span>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
