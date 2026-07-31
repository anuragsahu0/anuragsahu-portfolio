import { SITE_CONFIG } from '@/constants/config';

/**
 * Centralized Contact Experience Data Store
 * All components read directly from SITE_CONFIG and this data store.
 */

export const CONTACT_INFO = {
  name: SITE_CONFIG.name,
  shortName: SITE_CONFIG.shortName,
  role: SITE_CONFIG.role,
  education: SITE_CONFIG.education,
  location: SITE_CONFIG.location,
  email: SITE_CONFIG.email,
  status: SITE_CONFIG.status,
  github: SITE_CONFIG.github,
  linkedin: SITE_CONFIG.linkedin,
  resumePdf: SITE_CONFIG.resumeUrl,
};

export const AVAILABILITY_STATUS = {
  currentStatus: 'Open for Summer 2026 Internships',
  interestedIn: [
    'Software Engineering (SWE) Internships',
    'Full-Stack Web Development',
    'AI & Machine Learning Engineering',
    'Backend Microservices & Systems'
  ],
  workMode: 'Remote, Hybrid, or On-site Relocation'
};

export const FAQ_ITEMS = [
  {
    q: 'How quickly do you respond to emails?',
    a: `I check my inbox daily and typically respond within 12 to 24 hours to recruiter inquiries sent to ${SITE_CONFIG.email}.`
  },
  {
    q: 'What is your preferred communication method?',
    a: `Direct Email (${SITE_CONFIG.email}) or LinkedIn Messaging are the fastest ways to reach me.`
  },
  {
    q: 'Are you available for relocation or remote work?',
    a: 'Yes! I am fully flexible for remote positions, hybrid roles, or relocation for Summer 2026 internships.'
  },
  {
    q: 'What internship timeline are you aiming for?',
    a: 'I am seeking Summer 2026 internships (typically 8 to 16 weeks during summer break).'
  }
];

export const SOCIAL_LINKS = [
  { id: 'github', label: 'GitHub', url: SITE_CONFIG.github, icon: 'Github' },
  { id: 'linkedin', label: 'LinkedIn', url: SITE_CONFIG.linkedin, icon: 'Linkedin' },
  { id: 'email', label: 'Email', url: `mailto:${SITE_CONFIG.email}`, icon: 'Mail' },
  { id: 'leetcode', label: 'LeetCode', url: 'https://leetcode.com/u/anuragsahu0/', icon: 'Code' },
  { id: 'twitter', label: 'X / Twitter', url: 'https://x.com/anuragsahu0', icon: 'Twitter' },
];

export const RESUME_METADATA = {
  filename: 'Anurag_Sahu_Software_Engineer_Resume_2026.pdf',
  version: 'v2.4 ATS-Optimized',
  size: '142 KB',
  lastUpdated: 'Updated Q1 2026',
  url: SITE_CONFIG.resumeUrl
};
