import { SITE_CONFIG } from '@/constants/config';

/**
 * ANTI GRAVITY — Candidate Projects Data Store
 * Displays Anurag Sahu's actual engineering projects:
 * 1. Portfolio (Full-Stack Web & Telemetry)
 * 2. Restaurant Management System (Enterprise Full-Stack System)
 */

export const FEATURED_PROJECT = {
  id: 'ai-finance-controller',
  title: 'AI Finance Controller',
  subtitle: 'Autonomous Financial Operations, Multi-Way Reconciliation & Audit Platform.',
  category: 'enterprise',
  categoryLabel: 'Autonomous AI & Fintech',
  badge: 'FLAGSHIP AI FINTECH',
  tagline: 'Autonomous enterprise financial operations platform with multi-source ingestion, reconciliation, tax intelligence & Finance Copilot.',
  description: 'Autonomous enterprise financial operations platform featuring multi-source data ingestion, deterministic multi-way reconciliation engine, GST/VAT tax intelligence, statistical anomaly detection 2.0 (+178% surge detection), controlled settlement automation with Four-Eyes authorization, and Finance Copilot.',
  github: `${SITE_CONFIG.github}/ai-finance-controller`,
  demo: 'https://anuragsahu.com/AI-FINANCE-CONTROLLER',
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
};

export const PROJECTS_LIST = [
  FEATURED_PROJECT,
  {
    id: 'restaurant-management-system',
    title: 'Restaurant Management System',
    subtitle: 'Multi-tenant POS, kitchen order display, and automated billing engine.',
    category: 'enterprise',
    categoryLabel: 'Enterprise System',
    badge: 'COMING SOON',
    tagline: 'Multi-tenant restaurant operations platform with live WebSocket KDS.',
    description: 'A complete multi-tenant restaurant management platform with authentication, real-time kitchen order display (KDS), inventory control, billing, and analytics.',
    github: `${SITE_CONFIG.github}/restaurant-management-system`,
    demo: '#',
    image: '/assets/project-portfolio.webp',
    metrics: [
      { label: 'Status', value: 'Planned', change: '🟡 Coming Soon' },
      { label: 'Architecture', value: 'Multi-Tenant', change: 'Microservices' },
      { label: 'Real-Time', value: 'WebSockets', change: 'Live KDS' },
      { label: 'Database', value: 'PostgreSQL', change: 'Relational' }
    ],
    techStack: ['Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'React'],
    recruiterHighlights: [
      'Multi-tenant POS and kitchen order display.',
      'JWT Authentication & Multi-Role User Access Control.',
      'Inventory Stock Tracking & Digital Invoice Billing Generation.'
    ],
    architecture: {
      frontend: 'React + Tailwind CSS POS interface.',
      backend: 'Node.js + Express + WebSockets on PostgreSQL.'
    },
    timeline: [
      { phase: 'Phase 1: Architecture Design', detail: 'Schema & RBAC modeling.' },
      { phase: 'Phase 2: POS & KDS', detail: 'WebSocket real-time event pipeline.' }
    ]
  },
  {
    id: 'smart-college-erp',
    title: 'Smart College ERP',
    subtitle: 'Student attendance, examination results & fee collection gateway.',
    category: 'academic',
    categoryLabel: 'Academic ERP',
    badge: 'COMING SOON',
    tagline: 'End-to-end college ERP management system.',
    description: 'An end-to-end college management ERP platform featuring student attendance tracking, examination result portal, fee collection gateway, and automated performance analytics.',
    github: `${SITE_CONFIG.github}/smart-college-erp`,
    demo: '#',
    image: '/assets/project-portfolio.webp',
    metrics: [
      { label: 'Status', value: 'Planned', change: '🟡 Coming Soon' },
      { label: 'Modules', value: 'Attendance/Fees', change: 'Full Lifecycle' },
      { label: 'Auth', value: 'RBAC', change: 'Student/Faculty/Admin' },
      { label: 'Database', value: 'MongoDB', change: 'Mongoose' }
    ],
    techStack: ['React', 'Express', 'MongoDB', 'Node.js', 'Tailwind CSS'],
    recruiterHighlights: [
      'Student Attendance & Bio-metric Sync System.',
      'Examination Result Portal & Grade Sheet Publisher.',
      'Online Fee Collection Gateway & Financial Accounting Module.'
    ],
    architecture: {
      frontend: 'React single page portal for students and faculty.',
      backend: 'Express.js REST APIs with MongoDB.'
    },
    timeline: [
      { phase: 'Phase 1: Portal & Auth', detail: 'Role-based access system.' },
      { phase: 'Phase 2: Modules', detail: 'Attendance, grading & payments.' }
    ]
  }
];

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Showcase' },
  { id: 'enterprise', label: 'Enterprise Systems' }
];
