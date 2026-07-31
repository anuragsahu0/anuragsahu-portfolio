import React from 'react';
import { Github, Linkedin, Mail, Code, Twitter } from 'lucide-react';
import { SOCIAL_LINKS } from '@/data/contactData';

/**
 * SocialLinks Component
 * Interactive social telemetry nodes with hover elevation and focus states.
 */
export const SocialLinks = ({ onCopyEmail }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Github': return Github;
      case 'Linkedin': return Linkedin;
      case 'Mail': return Mail;
      case 'Code': return Code;
      case 'Twitter': return Twitter;
      default: return Mail;
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
      {SOCIAL_LINKS.map((link) => {
        const Icon = getIcon(link.icon);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (link.id === 'email') {
                e.preventDefault();
                onCopyEmail();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 hover:border-nebula-cyan/50 text-muted hover:text-starlight hover:scale-105 transition-all duration-200 focus-ring-cyan"
            aria-label={`Open ${link.label} link`}
          >
            <Icon className="w-4 h-4 text-nebula-cyan" />
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
};
