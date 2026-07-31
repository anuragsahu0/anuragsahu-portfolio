import React from 'react';
import { MapPin, GraduationCap, Code2, Bot, Briefcase } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * QuickFactsCard Component
 * Compact, elegant glass information card showcasing Anurag's key recruiter metrics:
 * 📍 India | 🎓 B.Tech CSE (AI & ML) | 💻 Full Stack Developer | 🤖 AI & ML Enthusiast | 📬 Open for Internship
 */
export const QuickFactsCard = ({ className }) => {
  const facts = [
    { icon: MapPin, label: 'India', color: 'text-nebula-cyan' },
    { icon: GraduationCap, label: 'B.Tech CSE (AI & ML)', color: 'text-quantum-violet' },
    { icon: Code2, label: 'Full Stack Developer', color: 'text-nebula-cyan' },
    { icon: Bot, label: 'AI & ML Enthusiast', color: 'text-quantum-violet' },
    { icon: Briefcase, label: 'Open for Internship', color: 'text-emerald-400', highlight: true },
  ];

  return (
    <GlassCard spotlight={false} hoverable={true} className={cn('p-4 bg-black/40 border-white/10 rounded-xl', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-[11px]">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <div key={idx} className="flex items-center gap-2 text-muted truncate">
              <Icon className={cn('w-3.5 h-3.5 shrink-0', fact.color)} />
              <span className={cn('font-medium truncate', fact.highlight ? 'text-emerald-400 font-semibold' : 'text-starlight')}>
                {fact.label}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
