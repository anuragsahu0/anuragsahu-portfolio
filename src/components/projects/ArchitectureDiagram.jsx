import React from 'react';
import { ArrowDown, Cpu, Database, Server, Monitor } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * ArchitectureDiagram Component
 * Responsive, visually elegant architecture flow diagram mapping Client -> Gateway -> Core Engine -> DB.
 */
export const ArchitectureDiagram = ({ architecture, className }) => {
  if (!architecture) return null;

  const nodes = [
    { label: 'Client Viewport', text: architecture.client, icon: Monitor, color: 'text-nebula-cyan' },
    { label: 'API Gateway / Server', text: architecture.gateway, icon: Server, color: 'text-quantum-violet' },
    { label: 'Core Engine / ML Processing', text: architecture.mlEngine, icon: Cpu, color: 'text-nebula-cyan' },
    { label: 'Database / Metric Store', text: architecture.database, icon: Database, color: 'text-emerald-400' },
  ];

  return (
    <div className={cn('p-5 rounded-xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs', className)}>
      <div className="text-xs font-bold text-starlight uppercase tracking-wider flex items-center gap-2">
        <Server className="w-4 h-4 text-nebula-cyan" />
        <span>SYSTEM ARCHITECTURE DIAGRAM</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 relative">
        {nodes.map((node, idx) => {
          const Icon = node.icon;
          return (
            <React.Fragment key={idx}>
              <div className="flex-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 space-y-1 text-center hover:border-nebula-cyan/40 transition-colors">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-dim uppercase">
                  <Icon className={cn('w-3.5 h-3.5', node.color)} />
                  <span>{node.label}</span>
                </div>
                <div className="text-starlight font-semibold text-xs truncate">{node.text}</div>
              </div>

              {idx < nodes.length - 1 && (
                <div className="text-muted flex md:block items-center justify-center shrink-0 my-1 md:my-0">
                  <span className="hidden md:inline font-bold text-nebula-cyan">→</span>
                  <ArrowDown className="md:hidden w-4 h-4 text-nebula-cyan" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
