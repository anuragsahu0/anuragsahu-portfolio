import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Telemetry Badge Component
 * Monospaced status tag with pulse dot indicator.
 */
export const TelemetryBadge = ({
  children,
  pulse = true,
  variant = 'cyan',
  className,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-nebula-cyan/10 border-nebula-cyan/30 text-nebula-cyan',
    violet: 'bg-quantum-violet/10 border-quantum-violet/30 text-quantum-violet',
    amber: 'bg-gravity-amber/10 border-gravity-amber/30 text-gravity-amber',
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-pill border font-mono text-xs uppercase tracking-widest',
        variantStyles[variant] || variantStyles.cyan,
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};
