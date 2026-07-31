import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText, Github, Linkedin, Mail, Sparkles, Code2, Bot, ExternalLink } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { TelemetryBadge } from '@/components/ui/TelemetryBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { HeroPortraitCard } from '@/components/cards/HeroPortraitCard';
import { QuickFactsCard } from '@/components/cards/QuickFactsCard';
import { SITE_CONFIG } from '@/constants/config';
import { useMousePosition } from '@/hooks/useMousePosition';
import { staggeredContainer, fadeIn, slideUp } from '@/animations/variants';

/**
 * HeroSection Component
 * Viewport featuring:
 * - Left: Authentic Brand Pitch, Headline, Magnetic CTAs, Social Links, Quick Facts Card.
 * - Right: Premium 520px+ Glass Portrait Showcase with 3D tilt interaction.
 * - Recruiter 30s Fast-Track drawer.
 */
export const HeroSection = ({ isRecruiterMode, onCopyEmail }) => {
  const mousePosition = useMousePosition();

  // Subtle non-distracting mouse parallax calculation
  const parallaxX = (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.012;
  const parallaxY = (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.012;

  const handleExploreClick = (e) => {
    e.preventDefault();
    const projectsSec = document.querySelector('#projects');
    if (projectsSec) {
      projectsSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 pb-12">
      {/* Parallax Container */}
      <motion.div
        animate={{ x: parallaxX, y: parallaxY }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 0.1 }}
        className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
      >
        {/* LEFT COLUMN: Authentic Brand Pitch & Magnetic CTAs */}
        <motion.div
          variants={staggeredContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left gap-5"
        >
          {/* Availability Status Badge */}
          <motion.div variants={slideUp}>
            <TelemetryBadge pulse variant="cyan" className="shadow-cyanGlow/20">
              {SITE_CONFIG.status}
            </TelemetryBadge>
          </motion.div>

          {/* Authentic Role Identification */}
          <motion.div variants={slideUp} className="flex items-center gap-2 font-mono text-xs md:text-sm text-muted uppercase tracking-wider">
            <span className="text-starlight font-semibold">{SITE_CONFIG.name}</span>
            <span className="text-nebula-cyan font-bold">•</span>
            <span>{SITE_CONFIG.education}</span>
          </motion.div>

          {/* Ambitious & Believable Headline */}
          <motion.h1
            variants={slideUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold heading-gradient tracking-tight leading-[1.15]"
          >
            {SITE_CONFIG.headlines[0]}
          </motion.h1>

          {/* Human, Memorable Hero Pitch */}
          <motion.p
            variants={slideUp}
            className="text-muted text-base md:text-lg leading-relaxed max-w-xl"
          >
            Hi, I'm <strong className="text-starlight font-semibold">{SITE_CONFIG.shortName}</strong> — a Computer Science sophomore specializing in Artificial Intelligence & Machine Learning. I build clean, performant full-stack web applications and love exploring practical ML models.
          </motion.p>

          {/* Magnetic Action Buttons */}
          <motion.div variants={slideUp} className="flex flex-wrap gap-4 items-center pt-2">
            <MagneticButton>
              <PrimaryButton onClick={handleExploreClick} aria-label="Explore My Work">
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
            </MagneticButton>

            <MagneticButton>
              <SecondaryButton
                onClick={() => window.open(SITE_CONFIG.resumeUrl, '_blank')}
                aria-label="Download Resume PDF"
              >
                <FileText className="w-4 h-4 text-nebula-cyan" />
                <span>Download Resume</span>
              </SecondaryButton>
            </MagneticButton>
          </motion.div>

          {/* Social Telemetry Nodes */}
          <motion.div variants={fadeIn} className="flex items-center gap-3 pt-1">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-muted hover:text-nebula-cyan hover:border-nebula-cyan/50 hover:scale-110 transition-all duration-200 focus-ring-cyan"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-muted hover:text-nebula-cyan hover:border-nebula-cyan/50 hover:scale-110 transition-all duration-200 focus-ring-cyan"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <button
              onClick={onCopyEmail}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-muted hover:text-nebula-cyan hover:border-nebula-cyan/50 hover:scale-110 transition-all duration-200 focus-ring-cyan"
              aria-label="Copy Direct Email Address"
            >
              <Mail className="w-4 h-4" />
            </button>
          </motion.div>

          {/* QUICK FACTS CARD */}
          <motion.div variants={slideUp} className="w-full pt-2">
            <QuickFactsCard />
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Large 520px+ Hero Glass Portrait Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275], delay: 0.15 }}
          className="lg:col-span-5 w-full flex justify-center"
        >
          <HeroPortraitCard />
        </motion.div>
      </motion.div>

              <div className="flex items-center justify-between text-xs font-mono text-muted pt-1 border-t border-gravity-amber/20">
                <span className="text-emerald-400">✓ Open for Summer 2026 SWE & AI/ML Internship Opportunities</span>
                <button onClick={() => window.open(SITE_CONFIG.resumeUrl, '_blank')} className="text-gravity-amber hover:underline font-semibold">
                  Download Resume PDF →
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
