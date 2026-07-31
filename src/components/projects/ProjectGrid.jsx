import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { staggeredContainer } from '@/animations/variants';

/**
 * ProjectGrid Component
 * Animated grid rendering project cards filtered by category and active technology badge.
 */
export const ProjectGrid = ({ projects, onOpenCaseStudy }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 font-mono text-sm text-muted">
        No engineering case studies found for the selected category or technology filter.
      </div>
    );
  }

  return (
    <motion.div
      variants={staggeredContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpenCaseStudy={onOpenCaseStudy}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
