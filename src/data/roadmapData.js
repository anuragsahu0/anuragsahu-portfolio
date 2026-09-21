import { SITE_CONFIG } from '@/constants/config';

/**
 * ANTI GRAVITY — Engineering & Project Roadmap Data Store
 * Data-driven timeline schema for active engineering builds, upcoming systems, and future project milestones.
 */

export const ROADMAP_PROJECTS = [
  {
    id: 'ai-finance-controller',
    number: '01',
    name: 'AI Finance Controller',
    subtitle: 'Autonomous enterprise financial operations platform & Finance Copilot.',
    status: 'Completed',
    statusVariant: 'emerald',
    statusSymbol: '🟢',
    progress: 100,
    progressLabel: 'Completed • Operational',
    lastUpdated: 'Updated Q1 2026',
    description: 'Autonomous enterprise financial operations platform with multi-source ingestion, deterministic multi-way reconciliation engine, GST/VAT tax intelligence, statistical anomaly detection 2.0 (+178% surge detection), controlled settlement automation with Four-Eyes authorization, and Finance Copilot.',
    currentFocus: [
      'Multi-Source Ingestion & Deterministic Reconciliation Engine',
      'Tax Matching & Statistical Anomaly Baselines (+178% Surge Detection)',
      'Controlled Settlement Engine with Four-Eyes Authorization Gate'
    ],
    plannedModules: [
      'Finance Copilot 2.0 with Specialized Grounded Agents & 7-Day Forecasting',
      'Automated Bank Statement & Ledger Reconciliation Feed',
      'Real-Time Anomaly Alert Webhooks & Audit Exports'
    ],
    technologies: ['FastAPI', 'Python', 'Next.js 14', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
    category: 'Autonomous AI & FinTech'
  },
  {
    id: 'meoww-racing-game',
    number: '02',
    name: 'Meoww Racing Game',
    subtitle: 'Interactive 2D/3D arcade cat racing game with HTML5 Canvas physics engine.',
    status: 'Coming Soon',
    statusVariant: 'amber',
    statusSymbol: '🟡',
    progress: 15,
    progressLabel: 'Planning • 15% Completed',
    lastUpdated: 'Planned Q2 2026',
    description: 'An action-packed arcade racing game featuring feline racers, nitro boosters, dynamic obstacle courses, and high score leaderboards.',
    currentFocus: [
      'Database Schema Design & ERD Modeling',
      'Role-Based Access Control (RBAC) System',
      'POS & Invoice Billing Module Specifications'
    ],
    plannedModules: [
      'JWT Authentication & Multi-Role User Management',
      'Real-Time Kitchen Order Display via WebSockets',
      'Inventory Stock Tracking & Automatic Low-Stock Alerts',
      'Automated Billing & Digital Receipt Generation',
      'Manager Analytics Dashboard (Revenue & Popular Dishes)'
    ],
    technologies: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS'],
    category: 'Enterprise Full-Stack System'
  },
  {
    id: 'ai-code-assistant-extension',
    number: '03',
    name: 'AI Code Telemetry Assistant',
    subtitle: 'VS Code extension providing real-time code complexity analysis & GNN optimization tips.',
    status: 'Planning',
    statusVariant: 'purple',
    statusSymbol: '🟣',
    progress: 5,
    progressLabel: 'Conceptual • 5% Completed',
    lastUpdated: 'Planned Q3 2026',
    description: 'A lightweight developer tool extension providing inline static code complexity metrics, memory leak detection, and AI-suggested refactoring snippets.',
    currentFocus: [
      'VS Code Language Server Protocol Research',
      'AST Parser & Complexity Algorithm Prototyping'
    ],
    plannedModules: [
      'Inline Cyclomatic Complexity Annotations',
      'AI Refactoring Suggestion Sidebar',
      'Local LLM / Ollama API Integration'
    ],
    technologies: ['TypeScript', 'VS Code API', 'Python', 'FastAPI', 'Ollama LLM'],
    category: 'Developer Tooling'
  }
];

export const ROADMAP_SUMMARY = {
  activeBuilds: 1,
  upcomingProjects: 2,
  completionRate: '50% Average Phase',
  targetQuarter: 'Q2/Q3 2026 Release Cycle'
};
