import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EducationTimeline } from './EducationTimeline';
import { CourseworkGrid } from './CourseworkGrid';
import { CertificationsSection } from './CertificationsSection';
import { AchievementsSection } from './AchievementsSection';
import { LearningRoadmap } from './LearningRoadmap';
import { CurrentFocus } from './CurrentFocus';
import { FutureGoals } from './FutureGoals';
import { ResumeCTA } from './ResumeCTA';
import { staggeredContainer, slideUp } from '@/animations/variants';

/**
 * EducationSection Master Container
 * Assembles the complete Education & Engineering Growth section.
 */
export const EducationSection = ({ onCopyEmail }) => {
  return (
    <section id="experience" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="ACADEMIC ROADMAP & GROWTH"
          title="Education & Engineering Growth"
          subtitle="Explore my Computer Science & AI academic background, relevant core coursework, certification progress, hackathon achievements, and future growth roadmap."
        />

        {/* 1. Academic Education Timeline */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-nebula-cyan font-bold uppercase tracking-widest">[ DEGREES & INSTITUTIONS ]</span>
            <h3 className="text-2xl font-display font-bold text-starlight">Academic Timeline</h3>
          </div>
          <EducationTimeline />
        </div>

        {/* 2. Relevant Coursework Subjects */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-quantum-violet font-bold uppercase tracking-widest">[ CORE SUBJECTS ]</span>
            <h3 className="text-2xl font-display font-bold text-starlight">Relevant Computer Science Coursework</h3>
          </div>
          <CourseworkGrid />
        </div>

        {/* 3. Certifications */}
        <CertificationsSection />

        {/* 4. Achievements & Competitions */}
        <AchievementsSection />

        {/* 5. Technical Learning Roadmap */}
        <LearningRoadmap />

        {/* 6. Current Priorities */}
        <CurrentFocus />

        {/* 7. Future Goals */}
        <FutureGoals />

        {/* 8. End-of-Section Resume CTA */}
        <ResumeCTA onCopyEmail={onCopyEmail} />

      </div>
    </section>
  );
};
