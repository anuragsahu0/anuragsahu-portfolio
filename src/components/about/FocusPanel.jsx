import React from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * FocusPanel Component
 * Compact panel highlighting what Anurag is actively studying and mastering right now.
 */
export const FocusPanel = ({ className }) => {
  const currentStack = [
    { name: 'React / Next.js', status: 'Mastering Component Patterns' },
    { name: 'Node.js & Express', status: 'Building REST & Async APIs' },
    { name: 'PostgreSQL & MongoDB', status: 'Database Schema Design' },
    { name: 'Python & PyTorch', status: 'Model Training & Tensors' },
    { name: 'FastAPI Microservices', status: 'Model Deployment APIs' },
    { name: 'System Design Fundamentals', status: 'Scalability & Caching' },
  ];

  return (
    <GlassCard className={cn('p-6 space-y-4 border-white/10 bg-black/40', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan">
          <Flame className="w-4 h-4 text-gravity-amber animate-pulse" />
          <span>CURRENT LEARNING FOCUS</span>
        </div>
        <span className="font-mono text-[10px] text-dim">ACTIVE_SEMESTER</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
        {currentStack.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-starlight font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{item.name}</span>
            </div>
            <div className="text-[11px] text-muted pl-5">{item.status}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
