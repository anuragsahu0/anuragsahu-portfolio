import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * ImageGallery Component
 * Responsive screenshot carousel with keyboard navigation support.
 */
export const ImageGallery = ({ images, className }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative aspect-video rounded-xl bg-space-black border border-white/10 overflow-hidden flex items-center justify-center group">
        {/* Placeholder Screenshot Viewport */}
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 bg-gradient-to-br from-nebula-cyan/10 to-quantum-violet/10 w-full h-full">
          <ImageIcon className="w-10 h-10 text-nebula-cyan animate-pulse" />
          <div className="font-mono text-xs text-starlight font-bold">
            {images[activeIdx]?.caption || 'Engineering Viewport Screenshot'}
          </div>
          <span className="font-mono text-[10px] text-dim">FRAME {activeIdx + 1} OF {images.length}</span>
        </div>

        {/* Carousel Prev/Next Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 p-2 rounded-full bg-black/60 text-starlight hover:text-nebula-cyan border border-white/10 hover:bg-black/80 focus-ring-cyan transition-all"
              aria-label="Previous Screenshot"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 p-2 rounded-full bg-black/60 text-starlight hover:text-nebula-cyan border border-white/10 hover:bg-black/80 focus-ring-cyan transition-all"
              aria-label="Next Screenshot"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Slide Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                activeIdx === idx ? 'w-5 bg-nebula-cyan' : 'bg-white/20 hover:bg-white/40'
              )}
              aria-label={`Jump to screenshot slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
