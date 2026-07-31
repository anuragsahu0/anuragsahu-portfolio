import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryTabs } from './CategoryTabs';
import { SkillCard } from './SkillCard';
import { TechnologySpotlight } from './TechnologySpotlight';
import { LearningRoadmap } from './LearningRoadmap';
import { EngineeringPrinciples } from './EngineeringPrinciples';
import { SKILLS_LAB_DATA } from '@/data/skillsData';
import { staggeredContainer, slideUp } from '@/animations/variants';

/**
 * EngineeringLab Master Section
 * Complete interactive Engineering Laboratory showcasing Anurag's tech stack, realistic learning status badges, technology spotlight, roadmap, and principles.
 */
export const EngineeringLab = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const filteredSkills = SKILLS_LAB_DATA.filter((skill) => {
    if (activeCategory === 'all') return true;
    return skill.category === activeCategory;
  });

  const handleSelectSkill = (skill) => {
    if (selectedSkill?.id === skill.id) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
    }
  };

  return (
    <section id="skills" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-12">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="TECHNICAL TOOLKIT & TELEMETRY"
          title="Engineering Laboratory"
          subtitle="An interactive view of the frameworks, languages, databases, and developer tools I build with — backed by realistic learning status labels and practical context."
        />

        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(catId) => {
            setActiveCategory(catId);
            setSelectedSkill(null);
          }}
        />

        {/* Technology Spotlight (Revealed when a card is selected) */}
        {selectedSkill && (
          <TechnologySpotlight
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        )}

        {/* Skill Cards Grid Matrix */}
        <motion.div
          variants={staggeredContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onSelectSkill={handleSelectSkill}
                isSelected={selectedSkill?.id === skill.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Current Learning Roadmap */}
        <LearningRoadmap />

        {/* Engineering Pillars & Principles */}
        <EngineeringPrinciples />

      </div>
    </section>
  );
};
