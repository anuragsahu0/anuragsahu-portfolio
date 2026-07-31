import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * CourseCard Component
 * Displays an individual academic subject card with one-sentence importance explanation.
 */
export const CourseCard = ({ course }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'Current Semester':
        return 'text-nebula-cyan bg-nebula-cyan/10 border-nebula-cyan/30';
      default:
        return 'text-quantum-violet bg-quantum-violet/10 border-quantum-violet/30';
    }
  };

  return (
    <GlassCard className="p-5 space-y-3 border-white/10 hover:border-nebula-cyan/30 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="text-dim font-bold flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-nebula-cyan" />
            {course.code}
          </span>

          <span className={cn('px-2.5 py-0.5 rounded-full border font-bold uppercase', getStatusStyle(course.status))}>
            {course.status}
          </span>
        </div>

        <h4 className="font-display font-bold text-sm text-starlight">{course.title}</h4>
      </div>

      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1 font-mono text-[11px]">
        <div className="text-dim font-bold uppercase text-[10px] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-nebula-cyan" />
          <span>Why It Matters</span>
        </div>
        <p className="text-muted font-body text-xs leading-relaxed">{course.importance}</p>
      </div>
    </GlassCard>
  );
};
