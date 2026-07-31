import React from 'react';
import { CourseCard } from './CourseCard';
import { RELEVANT_COURSEWORK } from '@/data/educationData';

/**
 * CourseworkGrid Component
 * Grid layout rendering academic coursework subjects.
 */
export const CourseworkGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {RELEVANT_COURSEWORK.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
