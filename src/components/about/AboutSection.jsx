import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StoryCard } from './StoryCard';
import { Timeline } from './Timeline';
import { ValueCard } from './ValueCard';
import { FocusPanel } from './FocusPanel';
import { GoalsPanel } from './GoalsPanel';
import { staggeredContainer, slideUp } from '@/animations/variants';

/**
 * AboutSection Component
 * Assembles the complete About Experience: Section Header, Personal Narrative, Learning Journey Timeline, Core Values, Focus Panel, and Goals Panel.
 */
export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="ENGINEERING NARRATIVE & VALUES"
          title="About Anurag"
          subtitle="Discover my journey as a Computer Science sophomore, my passion for AI & Full-Stack engineering, and the core principles guiding my software development."
        />

        {/* 1. Personal Narrative Story */}
        <motion.div
          variants={staggeredContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={slideUp}>
            <StoryCard />
          </motion.div>
        </motion.div>

        {/* 2. Learning Journey Timeline */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-nebula-cyan font-bold uppercase tracking-widest">[ MILESTONES ]</span>
            <h3 className="text-2xl font-display font-bold text-starlight">Learning Journey Timeline</h3>
          </div>
          <Timeline />
        </div>

        {/* 3. Core Engineering Values */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-quantum-violet font-bold uppercase tracking-widest">[ PRINCIPLES ]</span>
            <h3 className="text-2xl font-display font-bold text-starlight">Core Values & Work Ethics</h3>
          </div>
          <ValueCard />
        </div>

        {/* 4. Current Learning Focus */}
        <FocusPanel />

        {/* 5. Goals & Beyond Coding */}
        <GoalsPanel />

      </div>
    </section>
  );
};
