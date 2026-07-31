import React from 'react';
import { ShieldCheck, ExternalLink, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/utils/cn';

/**
 * CertificationCard Component
 * Displays a certificate card (Completed, In Progress, or Planned).
 */
export const CertificationCard = ({ cert }) => {
  const isCompleted = cert.status === 'Completed';

  return (
    <GlassCard className="p-5 space-y-3 border-white/10 hover:border-nebula-cyan/30 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="text-muted font-semibold">{cert.platform}</span>
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full border font-bold uppercase',
              isCompleted
                ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
                : 'text-gravity-amber bg-gravity-amber/10 border-gravity-amber/30'
            )}
          >
            {cert.status}
          </span>
        </div>

        <h4 className="font-display font-bold text-sm text-starlight flex items-center gap-1.5">
          <ShieldCheck className={cn('w-4 h-4 shrink-0', isCompleted ? 'text-emerald-400' : 'text-gravity-amber')} />
          <span>{cert.title}</span>
        </h4>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-xs text-muted">
        <span className="flex items-center gap-1 text-dim text-[11px]">
          <Clock className="w-3 h-3 text-quantum-violet" />
          <span>{cert.date}</span>
        </span>

        {isCompleted && cert.credentialUrl !== '#' ? (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nebula-cyan hover:underline flex items-center gap-0.5 text-xs font-semibold"
          >
            Verify <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-dim text-[11px]">Credential Pending</span>
        )}
      </div>
    </GlassCard>
  );
};
