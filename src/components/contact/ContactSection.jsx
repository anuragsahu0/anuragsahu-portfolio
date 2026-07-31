import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactCard } from './ContactCard';
import { ContactForm } from './ContactForm';
import { AvailabilityPanel } from './AvailabilityPanel';
import { FAQSection } from './FAQSection';
import { ResumeCard } from './ResumeCard';
import { QuickActions } from './QuickActions';
import { SocialLinks } from './SocialLinks';

/**
 * ContactSection Master Container
 * The final recruiter conversion experience.
 */
export const ContactSection = ({ onCopyEmail }) => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="DIRECT RECRUITER CONVERSION"
          title="Let's Build Something Great"
          subtitle="Open for Summer 2026 Software Engineering & AI/ML Internship opportunities. Fill out the direct form below or reach out via email, LinkedIn, or GitHub."
        />

        {/* 1. Main Grid: Left Candidate Summary Card & Resume | Right Direct Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <ContactCard onCopyEmail={onCopyEmail} />
            <ResumeCard />
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* 2. Internship Availability Panel */}
        <AvailabilityPanel />

        {/* 3. Recruiter Fast-Track Quick Actions */}
        <QuickActions onCopyEmail={onCopyEmail} />

        {/* 4. Recruiter FAQ */}
        <FAQSection />

        {/* 5. Interactive Social Links */}
        <div className="text-center space-y-3">
          <div className="font-mono text-xs text-dim uppercase tracking-wider">Connect Across Telemetry Platforms</div>
          <SocialLinks onCopyEmail={onCopyEmail} />
        </div>

      </div>
    </section>
  );
};
