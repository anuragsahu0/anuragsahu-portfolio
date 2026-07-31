import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '@/constants/config';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { id: 'hero', label: 'Overview' },
  { id: 'aboutme', label: 'About Me' },
  { id: 'skills', label: 'Lab' },
  { id: 'roadmap', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Navbar Component
 * Floating glassmorphism navbar with active link indicator, 30s Recruiter mode, and Admin Dashboard link.
 */
export const Navbar = ({ onToggleRecruiterMode, isRecruiterMode, onOpenCLI }) => {
  const [activeSection, setActiveSection] = React.useState('hero');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-4">
      <div className="glass-panel px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-md">
        {/* Brand Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 font-display font-bold text-starlight hover:text-nebula-cyan transition-colors focus-ring-cyan rounded-lg p-1"
        >
          <span className="w-2 h-2 rounded-full bg-nebula-cyan animate-pulse" />
          <span className="tracking-tight text-sm sm:text-base">
            {SITE_CONFIG.shortName.toUpperCase()}
            <span className="text-nebula-cyan">.SAHU</span>
          </span>
        </button>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'relative px-3 py-1.5 rounded-lg transition-colors focus-ring-cyan select-none',
                  isActive ? 'text-starlight font-bold' : 'text-muted hover:text-starlight'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-nebula-cyan/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions: CLI Overlay */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCLI}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-nebula-cyan hover:border-nebula-cyan/50 font-mono text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 focus-ring-cyan"
            title="Open CLI Terminal (Ctrl + K)"
          >
            <Terminal className="w-3.5 h-3.5 text-nebula-cyan" />
            <span className="hidden sm:inline">CLI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
