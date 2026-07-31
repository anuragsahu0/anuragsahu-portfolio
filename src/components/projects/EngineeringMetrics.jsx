import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * EngineeringMetrics Component
 * Displays real engineering benchmark metrics (Latency, Throughput, Lighthouse, Bundle Size) instead of fake rating bars.
 */
export const EngineeringMetrics = ({ metrics, className }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className={cn('p-4 rounded-xl bg-black/40 border border-white/10 space-y-3', className)}>
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-nebula-cyan uppercase tracking-wider">
        <Activity className="w-4 h-4 text-nebula-cyan" />
        <span>BENCHMARK ENGINEERING METRICS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {metrics.map((metric, idx) => (
          <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-0.5 text-center">
            <div className="text-sm sm:text-base font-extrabold text-starlight text-nebula-cyan">{metric.value}</div>
            <div className="text-[10px] text-dim uppercase tracking-wider">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
