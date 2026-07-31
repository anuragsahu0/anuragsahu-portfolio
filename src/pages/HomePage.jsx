import React, { Suspense, lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HeroSection } from '@/components/sections/HeroSection';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { SkeletonLoader } from '@/components/motion/SkeletonLoader';

// Lazy-load non-critical lower sections for optimal LCP & bundle splitting
const AboutMeSection = lazy(() =>
  import('@/components/aboutme/AboutMeSection').then((m) => ({ default: m.AboutMeSection }))
);
const AboutSection = lazy(() =>
  import('@/components/about/AboutSection').then((m) => ({ default: m.AboutSection }))
);
const EngineeringLab = lazy(() =>
  import('@/components/lab/EngineeringLab').then((m) => ({ default: m.EngineeringLab }))
);
const RoadmapSection = lazy(() =>
  import('@/components/roadmap/RoadmapSection').then((m) => ({ default: m.RoadmapSection }))
);
const EducationSection = lazy(() =>
  import('@/components/education/EducationSection').then((m) => ({ default: m.EducationSection }))
);
const ContactSection = lazy(() =>
  import('@/components/contact/ContactSection').then((m) => ({ default: m.ContactSection }))
);

const SectionFallback = () => (
  <div className="py-16 max-w-6xl mx-auto px-4">
    <SkeletonLoader height="h-64" rounded="rounded-2xl" />
  </div>
);

/**
 * HomePage Component
 * Complete Anti Gravity Portfolio layout flow:
 * Hero -> About Me -> Narrative -> Laboratory -> Project & Engineering Roadmap -> Education -> Contact
 */
export const HomePage = () => {
  const { isRecruiterMode, onCopyEmail } = useOutletContext() || {};

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. First Impression Hero Viewport (Eager Load for instant LCP) */}
      <HeroSection isRecruiterMode={isRecruiterMode} onCopyEmail={onCopyEmail} />

      {/* Floating Scroll Telemetry Indicator */}
      <div className="py-6">
        <ScrollIndicator />
      </div>

      {/* 2. About Me Section */}
      <Suspense fallback={<SectionFallback />}>
        <AboutMeSection />
      </Suspense>

      {/* 3. About Experience Narrative Section */}
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
      </Suspense>

      {/* 4. Engineering Laboratory Section */}
      <Suspense fallback={<SectionFallback />}>
        <EngineeringLab />
      </Suspense>

      {/* 5. Project & Engineering Roadmap Section */}
      <Suspense fallback={<SectionFallback />}>
        <RoadmapSection />
      </Suspense>

      {/* 6. Education & Engineering Growth Section */}
      <Suspense fallback={<SectionFallback />}>
        <EducationSection onCopyEmail={onCopyEmail} />
      </Suspense>

      {/* 7. Contact Mission Control & Recruiter Conversion Section */}
      <Suspense fallback={<SectionFallback />}>
        <ContactSection onCopyEmail={onCopyEmail} />
      </Suspense>
    </div>
  );
};
