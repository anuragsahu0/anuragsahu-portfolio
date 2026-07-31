import React, { useRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Glass Card Container Component
 * Frosted acrylic panel with cursor spotlight tracking and soft elevation.
 */
export const GlassCard = ({
  children,
  className,
  spotlight = true,
  hoverable = true,
  ...props
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!spotlight || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'glass-panel rounded-xl p-6 relative overflow-hidden transition-all duration-300 ease-smooth',
        hoverable && 'hover:border-nebula-cyan/30 hover:shadow-cyanGlow/20 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: `radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.12), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
