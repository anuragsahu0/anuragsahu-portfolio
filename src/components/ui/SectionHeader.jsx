import React from 'react';
import { TelemetryBadge } from './TelemetryBadge';
import { cn } from '@/utils/cn';

/**
 * Section Header Component
 * Standardized title layout with telemetry category badge and gradient heading.
 */
export const SectionHeader = ({
  badgeText,
  title,
  subtitle,
  align = 'center',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mb-12 space-y-3',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
      {...props}
    >
      {badgeText && <TelemetryBadge>{badgeText}</TelemetryBadge>}
      <h2 className="text-3xl md:text-4xl font-display font-bold heading-gradient tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
