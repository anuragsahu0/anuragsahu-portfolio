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
    id: 'restaurant-management-system',
    title: 'Restaurant Management System',
    subtitle: 'End-to-end POS, inventory control, billing, and real-time order processing platform.',
    category: 'enterprise',
    categoryLabel: 'Enterprise Full-Stack System',
    badge: 'PLANNED ENTERPRISE SYSTEM',
    tagline: 'Complete multi-tenant restaurant platform with role-based auth, real-time kitchen order display (KDS), inventory control, and billing.',
    description: 'A comprehensive restaurant management system designed for multi-tenant restaurants, featuring JWT authentication, role-based access control (RBAC), WebSocket kitchen order display (KDS), automated inventory tracking, invoice billing, and revenue analytics.',
    github: `${SITE_CONFIG.github}/restaurant-management-system`,
    demo: '#',
    image: '/assets/project-restaurant-system.webp',
    metrics: [
      { label: 'Development Phase', value: '15%', change: '🟡 Status: Coming Soon' },
      { label: 'Role Security', value: 'RBAC Auth', change: 'JWT + Multi-Tenant' },
      { label: 'Real-Time Sync', value: 'WebSockets', change: 'Kitchen Order Display' },
      { label: 'Primary Storage', value: 'PostgreSQL', change: 'Relational + Redis Cache' }
    ],
    techStack: [
      'Node.js', 'Express', 'React', 'PostgreSQL',
      'Redis', 'WebSockets', 'Tailwind CSS', 'JWT'
    ],
    recruiterHighlights: [
      'Designed PostgreSQL ERD relational database schema for multi-tenant restaurant inventory, orders, and billing.',
      'Specified real-time WebSocket architecture connecting POS billing terminals directly to Kitchen Order Display (KDS) screens.',
      'Planned JWT role-based access control (RBAC) separating Admin Managers, Kitchen Chefs, Cashiers, and Waiters.'
    ],
    architecture: {
      frontend: 'React single-page application with dark glassmorphism POS interface and live WebSocket KDS queue.',
      backend: 'Node.js + Express REST & WebSocket server backed by PostgreSQL relational queries and Redis session cache.'
    },
    timeline: [
      { phase: 'Phase 1: ERD & Database Schema', detail: 'PostgreSQL relational table modeling.' },
      { phase: 'Phase 2: Authentication & RBAC', detail: 'JWT auth & role-based middleware.' },
      { phase: 'Phase 3: POS & Kitchen Display', detail: 'Real-time WebSocket order pipeline.' },
      { phase: 'Phase 4: Billing & Analytics', detail: 'Automated invoice generation & revenue charts.' }
    ]
  }
];

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Showcase' },
  { id: 'fullstack', label: 'Full-Stack Web & Telemetry' },
  { id: 'enterprise', label: 'Enterprise Systems' }
];
