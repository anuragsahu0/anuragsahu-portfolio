import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AboutMeCard } from './AboutMeCard';
import { ProfileSummaryCard } from './ProfileSummaryCard';
import { ABOUT_ME_DATA } from '@/data/aboutMeData';

/**
 * AboutMeSection Component
 * Master section container assembling Left (Narrative & Chips) and Right (Profile Summary Card).
 */
export const AboutMeSection = () => {
  return (
    <section id="aboutme" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="PROFILE OVERVIEW"
          title={ABOUT_ME_DATA.sectionTitle}
          subtitle={ABOUT_ME_DATA.sectionSubtitle}
        />

        {/* Responsive Grid: Mobile = Right Card First, Content Below | Desktop = Left Content, Right Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left / Mobile Second: About Me Content Card */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <AboutMeCard />
          </div>

          {/* Desktop Right / Mobile First: Profile Summary Card */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <ProfileSummaryCard />
          </div>
        </div>

      </div>
    </section>
  );
};
