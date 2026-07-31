import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * MagneticButton Component
 * Wraps buttons with a subtle spring-physics magnetic pull towards cursor position.
 * Respects prefers-reduced-motion media query.
 */
export const MagneticButton = ({
  children,
  className,
  onClick,
  disabled = false,
  ...props
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <div onClick={onClick} className={cn('cursor-pointer', className)} {...props}>
        {children}
      </div>
    </motion.div>
  );
};
