import React from 'react';
import { Compass, Code, Layout, BookOpen, Wrench, Repeat } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * ValueCard Component (Refined Grounded Principles)
 * 6 engineering principles suited for a 2nd-year B.Tech CSE student.
 */
export const ValueCard = ({ className }) => {
  const values = [
    {
      title: 'Curiosity-Driven',
      desc: 'Exploring how algorithms, web frameworks, and computer systems work under the hood.',
      icon: Compass,
      color: 'text-nebula-cyan',
    },
    {
      title: 'Clean Code Standards',
      desc: 'Striving to write readable, structured, and well-commented code in JavaScript, Python, and C++.',
      icon: Code,
      color: 'text-quantum-violet',
    },
    {
      title: 'User-Centered Thinking',
      desc: 'Focusing on building intuitive, fast, and responsive user interfaces.',
      icon: Layout,
      color: 'text-nebula-cyan',
    },
    {
      title: 'Continuous Learning',
      desc: 'Regularly exploring new tools, software patterns, and framework updates.',
      icon: BookOpen,
      color: 'text-quantum-violet',
    },
    {
      title: 'Pragmatic Problem Solving',
      desc: 'Prioritizing practical solutions over unnecessary complexity.',
      icon: Wrench,
      color: 'text-emerald-400',
    },
    {
      title: 'Consistency',
      desc: 'Dedicated to regular coding practice, project building, and continuous revision.',
      icon: Repeat,
      color: 'text-gravity-amber',
    },
  ];

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {values.map((val, idx) => {
        const Icon = val.icon;
        return (
          <GlassCard key={idx} className="p-5 space-y-3 border-white/10 hover:border-nebula-cyan/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className={cn('w-4 h-4', val.color)} />
              </div>
              <h4 className="font-display font-bold text-sm text-starlight">{val.title}</h4>
            </div>
            <p className="text-xs text-muted leading-relaxed font-body">{val.desc}</p>
          </GlassCard>
        );
      })}
    </div>
  );
};
