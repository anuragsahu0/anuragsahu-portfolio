import React from 'react';
import { TimelineItem } from './TimelineItem';
import { EDUCATION_HISTORY } from '@/data/educationData';

/**
 * EducationTimeline Component
 * Chronological timeline container for academic education entries.
 */
export const EducationTimeline = () => {
  return (
    <div className="relative max-w-3xl mx-auto pt-2">
      {EDUCATION_HISTORY.map((item, idx) => (
        <TimelineItem
          key={item.id}
          item={item}
          isLast={idx === EDUCATION_HISTORY.length - 1}
        />
      ))}
    </div>
  );
};
