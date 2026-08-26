import { SITE_CONFIG } from '@/constants/config';

/**
 * ANTI GRAVITY — Candidate Projects Data Store
 * Displays Anurag Sahu's actual engineering projects:
 * 1. Portfolio (Full-Stack Web & Telemetry)
 * 2. Restaurant Management System (Enterprise Full-Stack System)
 */

export const FEATURED_PROJECT = {
  id: 'portfolio',
  title: 'Portfolio',
  subtitle: 'Production-ready personal platform & developer telemetry dashboard.',
  category: 'fullstack',
  categoryLabel: 'Full-Stack Web & Telemetry',
  badge: 'FLAGSHIP HERO PROJECT',
  tagline: 'Building a premium production-ready portfolio with React 18, Node.js, Express, and recruiter-focused 30s fast-track experience.',
  description: 'A full-stack personal platform built with React 18, Node.js, Express backend REST APIs, Nodemailer contact form engine, MongoDB Mongoose schema models, and telemetry admin control panel.',
  github: `${SITE_CONFIG.github}/portfolio`,
  demo: 'https://anuragsahu.vercel.app',
  image: '/assets/project-portfolio.webp',
  metrics: [
    { label: 'Completion Status', value: '85%', change: '🟢 Status: Working' },
    { label: 'Backend API', value: 'Express.js', change: 'Node.js + REST APIs' },
    { label: 'Email Engine', value: 'Nodemailer', change: 'Direct SMTP Delivery' },
    { label: 'Database', value: 'MongoDB', change: 'Mongoose Schemas' }
  ],
  techStack: [
    'React 18', 'Node.js', 'Express', 'Tailwind CSS',
    'Framer Motion', 'MongoDB', 'Nodemailer', 'Docker'
  ],
  recruiterHighlights: [
    'Built an Express + Node.js REST API server handling direct contact form submissions with Nodemailer email delivery to shivasahu0612@gmail.com.',
    'Engineered a secure Telemetry Admin Dashboard displaying visitor counts, ATS resume downloads, project clicks, and unread contact messages.',
    'Designed a custom glassmorphism design system with obsidian dark theme tokens, responsive image WebP optimizations, and 30-second recruiter mode.'
  ],
  architecture: {
    frontend: 'React 18 + Vite with Tailwind CSS, Framer Motion, and code-split dynamic route imports.',
    backend: 'Node.js + Express.js API server on port 5001 with CORS, rate limiting, and input validation.',
    pipeline: 'Deployment configured for Vercel, Render, Docker multi-stage containers, and GitHub Actions CI/CD.'
  },
  timeline: [
    { phase: 'Phase 1: Design System & UX', detail: 'Obsidian glassmorphism design tokens.' },
    { phase: 'Phase 2: Full-Stack Express API', detail: 'Contact form Nodemailer integration.' },
    { phase: 'Phase 3: Telemetry & Admin Panel', detail: 'Live metrics tracker & admin modal.' },
    { phase: 'Phase 4: Multi-Cloud Deployment', detail: 'Vercel, Render & Docker deployment setup.' }
  ]
};

export const PROJECTS_LIST = [
  FEATURED_PROJECT,
  {
    id: 'ai-finance-controller',
    title: 'AI Finance Controller',
    subtitle: 'Autonomous Financial Operations, Multi-Way Reconciliation & Audit Platform.',
    category: 'enterprise',
    categoryLabel: 'Autonomous AI & Fintech',
    badge: 'FLAGSHIP AI FINTECH',
    tagline: 'Autonomous enterprise financial operations platform with multi-source ingestion, reconciliation, tax intelligence & Finance Copilot.',
    description: 'Autonomous enterprise financial operations platform featuring multi-source data ingestion, deterministic multi-way reconciliation engine, GST/VAT tax intelligence, statistical anomaly detection 2.0 (+178% surge detection), controlled settlement automation with Four-Eyes authorization, and Finance Copilot.',
    github: `${SITE_CONFIG.github}/ai-finance-controller`,
    demo: 'https://ai-finance-controller.vercel.app',
    image: '/assets/project-portfolio.webp',
    metrics: [
      { label: 'Platform Status', value: '100%', change: '🟢 Live & Operational' },
      { label: 'Reconciliation', value: 'Multi-Way Engine', change: 'Deterministic' },
      { label: 'Tax & Anomaly', value: 'Active', change: 'GST/VAT Matching' },
      { label: 'Governance', value: 'Four-Eyes', change: 'Strict Dual Authorization' }
    ],
    techStack: [
      'Next.js 14', 'FastAPI', 'Python', 'PostgreSQL',
      'Alembic', 'Tailwind CSS', 'Docker', 'AI Copilot'
    ],
    recruiterHighlights: [
      'Built multi-way deterministic reconciliation pipeline comparing real bank statements, ledger entries, and payment feeds.',
      'Implemented automated GST/VAT tax matching and statistical anomaly detection flagging volume surges with UNUSUAL tag.',
      'Designed controlled settlement engine enforcing Four-Eyes principle preventing self-approval of payouts.',
      'Integrated Finance Copilot with specialized logical agents citing verified database records and PII masking.'
    ],
    architecture: {
      frontend: 'Next.js 14 App Router with Tailwind CSS, Lucide icons, and responsive executive finance consoles.',
      backend: 'FastAPI Python asynchronous service with SQLAlchemy ORM, Alembic migrations, and security middlewares.'
    },
    timeline: [
      { phase: 'Phase 1-4: Foundation & Ingestion', detail: 'Multi-source CSV/Excel parsing & schemas.' },
      { phase: 'Phase 5: Reconciliation Engine', detail: 'Deterministic multi-way matching & scores.' },
      { phase: 'Phase 6-8: Tax, Risk & Settlement', detail: 'Four-Eyes approval & tax discrepancy engine.' },
      { phase: 'Phase 9-10: Monitoring & Intelligence', detail: 'Event bus, 7-day cash flow forecast & Copilot.' }
    ]
  }
];

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Showcase' },
  { id: 'fullstack', label: 'Full-Stack Web & Telemetry' },
  { id: 'enterprise', label: 'Enterprise Systems' }
];
