import React from 'react';
import { Mail, MapPin, Briefcase, Github, Linkedin, FileText, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CONTACT_INFO } from '@/data/contactData';

/**
 * ContactCard Component
 * Candidate summary card displaying Anurag's WebP portrait, role, location, email, availability, and sparkling GitHub, LinkedIn & Email buttons.
 */
export const ContactCard = ({ onCopyEmail }) => {
  return (
    <GlassCard className="p-6 space-y-5 border-white/10 shadow-2xl relative">
      {/* Top Header: Candidate Portrait & Identity */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <div className="relative w-16 h-20 rounded-xl bg-gradient-to-br from-nebula-cyan/20 to-quantum-violet/20 border border-nebula-cyan/40 p-0.5 shadow-cyanGlow/20 overflow-hidden shrink-0">
          <picture>
            <source srcSet="/assets/anurag-portrait-sm.webp" type="image/webp" />
            <img
              src="/assets/anurag-portrait-sm.jpg"
              alt="Professional portrait of Anurag, B.Tech CSE (AI & ML) student and Full-Stack Developer."
              width="64"
              height="80"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
            />
          </picture>
          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-space-black animate-pulse" />
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-starlight flex items-center gap-1.5">
            <span>{CONTACT_INFO.name}</span>
            <Sparkles className="w-4 h-4 text-nebula-cyan animate-pulse" />
          </h3>
          <p className="text-xs font-mono text-nebula-cyan font-semibold">{CONTACT_INFO.role}</p>
          <p className="text-[11px] text-muted font-mono">{CONTACT_INFO.education}</p>
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-muted flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Status
          </span>
          <span className="text-emerald-400 font-bold">Open for Summer 2026</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-muted flex items-center gap-2">
            <MapPin className="w-4 h-4 text-nebula-cyan" />
            Location
          </span>
          <span className="text-starlight font-medium truncate">{CONTACT_INFO.location}</span>
        </div>
      </div>

      {/* Sparkling Action Buttons: GitHub, LinkedIn, Email & Resume */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="font-mono text-[11px] text-nebula-cyan font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-nebula-cyan animate-pulse" />
          <span>DIRECT CONNECT & LINKS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
          {/* 1. Sparkling GitHub Button */}
          <a
            href={CONTACT_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-nebula-cyan/15 via-cyan-500/10 to-transparent border border-nebula-cyan/40 hover:border-nebula-cyan text-starlight hover:text-nebula-cyan shadow-cyanGlow/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
          >
            <span className="absolute inset-0 bg-nebula-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            <Github className="w-4 h-4 text-nebula-cyan group-hover:animate-bounce" />
            <span className="font-bold">GitHub</span>
            <Sparkles className="w-3 h-3 text-nebula-cyan animate-pulse" />
          </a>

          {/* 2. Sparkling LinkedIn Button */}
          <a
            href={CONTACT_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-quantum-violet/15 via-purple-500/10 to-transparent border border-quantum-violet/40 hover:border-quantum-violet text-starlight hover:text-quantum-violet shadow-violetGlow/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
          >
            <span className="absolute inset-0 bg-quantum-violet/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            <Linkedin className="w-4 h-4 text-quantum-violet group-hover:animate-bounce" />
            <span className="font-bold">LinkedIn</span>
            <Sparkles className="w-3 h-3 text-quantum-violet animate-pulse" />
          </a>

          {/* 3. Sparkling Direct Email Button */}
          <button
            onClick={onCopyEmail}
            className="group relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400/15 via-teal-500/10 to-transparent border border-emerald-400/40 hover:border-emerald-400 text-starlight hover:text-emerald-400 shadow-emeraldGlow/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
          >
            <span className="absolute inset-0 bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            <Mail className="w-4 h-4 text-emerald-400 group-hover:animate-bounce" />
            <span className="font-bold">Email</span>
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* ATS Resume CTA Bar */}
        <button
          onClick={() => window.open(CONTACT_INFO.resumePdf, '_blank')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-nebula-cyan/50 text-muted hover:text-starlight font-mono text-xs transition-colors mt-1"
        >
          <FileText className="w-3.5 h-3.5 text-nebula-cyan" />
          <span>Download ATS Resume PDF ({CONTACT_INFO.email})</span>
        </button>
      </div>
    </GlassCard>
  );
};
