import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeaturedProject } from './FeaturedProject';
import { ProjectFilters } from './ProjectFilters';
import { TechnologyExplorer } from './TechnologyExplorer';
import { ProjectGrid } from './ProjectGrid';
import { CaseStudyModal } from './CaseStudyModal';
import { PROJECTS_DATA } from '@/data/projectsData';

/**
 * ProjectsSection Master Container
 * Complete Engineering Showcase section with flagship hero layout, domain filters, tech stack explorer, and case study modal.
 */
export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTech, setActiveTech] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  const featuredProject = PROJECTS_DATA.find((p) => p.isFeatured) || PROJECTS_DATA[0];
  const gridProjects = PROJECTS_DATA.filter((p) => !p.isFeatured);

  const filteredGridProjects = gridProjects.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesTech = !activeTech || p.technologies.includes(activeTech);
    return matchesCategory && matchesTech;
  });

  return (
    <section id="projects" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="FEATURED ENGINEERING MATRIX"
          title="Engineering Case Studies"
          subtitle="Explore selected software engineering projects — built with full-stack web precision, C++ low-latency optimization, and PyTorch deep learning models."
        />

        {/* Flagship Featured Hero Project */}
        {featuredProject && (
          <FeaturedProject
            project={featuredProject}
            onOpenCaseStudy={(p) => setSelectedCaseStudy(p)}
          />
        )}

        {/* Interactive Filtering Controls */}
        <div className="space-y-4 pt-4">
          <ProjectFilters
            activeCategory={activeCategory}
            onSelectCategory={(catId) => {
              setActiveCategory(catId);
              setActiveTech(null);
            }}
          />

          <TechnologyExplorer
            activeTech={activeTech}
            onSelectTech={(tech) => setActiveTech(tech)}
          />
        </div>

        {/* Remaining Projects Grid */}
        <ProjectGrid
          projects={filteredGridProjects}
          onOpenCaseStudy={(p) => setSelectedCaseStudy(p)}
        />

        {/* Case Study Modal */}
        {selectedCaseStudy && (
          <CaseStudyModal
            project={selectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}

      </div>
    </section>
  );
};
