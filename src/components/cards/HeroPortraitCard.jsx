import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Github, Linkedin, FileText } from 'lucide-react';
import { SITE_CONFIG } from '@/constants/config';
import { cn } from '@/utils/cn';

/**
 * HeroPortraitCard Component
 * High-impact hero portrait showcase reading directly from SITE_CONFIG.
 */
export const HeroPortraitCard = ({ className }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate subtle 3D tilt capped at max 4 degrees
    const rotateX = -(y / (rect.height / 2)) * 3.5;
    const rotateY = (x / (rect.width / 2)) * 3.5;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div className={cn('relative w-full max-w-md lg:max-w-lg mx-auto', className)}>
      {/* Background Ambient Radial Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-nebula-cyan/20 via-quantum-violet/20 to-transparent rounded-[36px] blur-2xl -z-10 pointer-events-none opacity-80 animate-pulse" />

      {/* Interactive 3D Card Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.2 }}
        style={{ perspective: 1000 }}
        className="glass-panel p-4 sm:p-5 rounded-[28px] border border-nebula-cyan/40 bg-black/60 shadow-[0_0_50px_rgba(6,182,212,0.22)] relative overflow-hidden group hover:border-nebula-cyan/70 transition-colors duration-300"
      >
        {/* Top Light Reflection Glare */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[28px]" />

        {/* Large Portrait Image Container */}
        <div className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] rounded-[22px] overflow-hidden border border-white/10 bg-space-black shadow-inner">
          <picture>
            <source srcSet="/assets/anurag-portrait.webp" type="image/webp" />
            <img
              src="/assets/anurag-portrait.jpg"
              alt="Professional portrait of Anurag Sahu, B.Tech CSE (AI & ML) student and Full-Stack Developer."
              width="600"
              height="750"
              loading="eager"
              className="w-full h-full object-cover object-top transform group-hover:scale-[1.03] transition-transform duration-500"
            />
          </picture>

          {/* Floating Availability Badge Pill (Top-Right) */}
          <div className="absolute top-3.5 right-3.5 glass-panel px-3 py-1.5 rounded-full border border-emerald-400/40 bg-black/70 backdrop-blur-md flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for Summer 2026</span>
          </div>

          {/* Candidate Name Overlay Badge (Bottom-Left) */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 glass-panel p-3.5 rounded-xl border border-white/15 bg-black/75 backdrop-blur-md space-y-1 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-display font-extrabold text-starlight flex items-center gap-1.5">
                <span>{SITE_CONFIG.name}</span>
                <Sparkles className="w-4 h-4 text-nebula-cyan animate-pulse" />
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/30">
                SYS_VERIFIED
              </span>
            </div>

            <div className="text-xs font-mono text-nebula-cyan font-semibold">
              {SITE_CONFIG.role}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-quantum-violet" />
                <span>{SITE_CONFIG.education}</span>
              </span>
              <span className="text-starlight font-bold">CGPA 9.2</span>
            </div>
          </div>
        </div>

        {/* Bottom Social Quick Links */}
        <div className="grid grid-cols-3 gap-2 pt-3">
          <a
            href={SITE_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-nebula-cyan/50 text-xs font-mono text-starlight hover:text-nebula-cyan transition-all duration-200 focus-ring-cyan"
            aria-label="GitHub Profile"
          >
            <Github className="w-3.5 h-3.5 text-nebula-cyan" />
            <span>GitHub</span>
          </a>

          <a
            href={SITE_CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-quantum-violet/50 text-xs font-mono text-starlight hover:text-quantum-violet transition-all duration-200 focus-ring-cyan"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-3.5 h-3.5 text-quantum-violet" />
            <span>LinkedIn</span>
          </a>

          <button
            onClick={() => window.open(SITE_CONFIG.resumeUrl, '_blank')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-nebula-cyan/15 border border-nebula-cyan/40 hover:bg-nebula-cyan/25 text-xs font-mono text-nebula-cyan font-bold transition-all duration-200 focus-ring-cyan"
            aria-label="Download Resume PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
