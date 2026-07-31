require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Roadmap = require('../models/Roadmap');
const SocialLink = require('../models/SocialLink');
const Settings = require('../models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anti_gravity_portfolio';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@anuragsahu.dev';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@AntiGravity2026';

// ─── Seed Data ──────────────────────────────────────────────

const USERS = [{ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' }];

const PROJECTS = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    subtitle: 'Production-ready personal platform & developer telemetry dashboard.',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web & Telemetry',
    badge: 'FLAGSHIP PROJECT',
    tagline: 'Building a premium production-ready portfolio with React 18, Node.js, Express backend API, modern glassmorphism design system.',
    description: 'A full-stack personal platform built with React 18, Node.js, Express backend REST APIs, Nodemailer contact form engine, MongoDB Mongoose schema models, and telemetry admin control panel.',
    github: 'https://github.com/anuragsahu0/portfolio',
    demo: 'https://anuragsahu.vercel.app',
    image: '/assets/project-portfolio.webp',
    metrics: [
      { label: 'Completion', value: '85%', change: 'Working' },
      { label: 'Backend', value: 'Express.js', change: 'Node.js + REST' },
      { label: 'Email', value: 'Nodemailer', change: 'SMTP Delivery' },
      { label: 'Database', value: 'MongoDB', change: 'Mongoose' },
    ],
    techStack: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB', 'Nodemailer', 'Docker'],
    recruiterHighlights: [
      'Built Express + Node.js REST API with Nodemailer email delivery.',
      'Engineered secure Telemetry Admin Dashboard with JWT auth.',
      'Designed glassmorphism design system with obsidian dark theme.',
    ],
    architecture: {
      frontend: 'React 18 + Vite with Tailwind CSS and Framer Motion.',
      backend: 'Node.js + Express.js API on port 5001 with CORS, helmet, rate limiting.',
      pipeline: 'Vercel, Render, Docker multi-stage, GitHub Actions CI/CD.',
    },
    timeline: [
      { phase: 'Phase 1: Design System', detail: 'Glassmorphism design tokens.' },
      { phase: 'Phase 2: Full-Stack API', detail: 'Contact form + Nodemailer.' },
      { phase: 'Phase 3: Admin Panel', detail: 'JWT auth + live metrics.' },
      { phase: 'Phase 4: Deployment', detail: 'Vercel, Render & Docker.' },
    ],
    isFeatured: true,
    order: 1,
  },
  {
    id: 'restaurant-management-system',
    title: 'Restaurant Management System',
    subtitle: 'End-to-end POS, inventory control, billing, and real-time order processing.',
    category: 'enterprise',
    categoryLabel: 'Enterprise Full-Stack System',
    badge: 'PLANNED ENTERPRISE SYSTEM',
    tagline: 'Complete multi-tenant restaurant platform with role-based auth, real-time KDS, inventory control, and billing.',
    description: 'A comprehensive restaurant management system featuring JWT authentication, role-based access control, WebSocket kitchen order display, inventory tracking, invoice billing, and revenue analytics.',
    github: 'https://github.com/anuragsahu0/restaurant-management-system',
    demo: '#',
    image: '/assets/project-restaurant-system.webp',
    metrics: [
      { label: 'Phase', value: '15%', change: 'Coming Soon' },
      { label: 'Auth', value: 'RBAC', change: 'JWT + Multi-Tenant' },
      { label: 'Real-Time', value: 'WebSockets', change: 'KDS Display' },
      { label: 'DB', value: 'PostgreSQL', change: 'Relational + Redis' },
    ],
    techStack: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS', 'JWT'],
    recruiterHighlights: [
      'Designed PostgreSQL ERD schema for multi-tenant restaurant inventory.',
      'Specified real-time WebSocket KDS architecture.',
      'Planned JWT RBAC separating Admin, Chef, Cashier, Waiter roles.',
    ],
    architecture: {
      frontend: 'React SPA with glassmorphism POS interface and live KDS.',
      backend: 'Node.js + Express REST & WebSocket server with PostgreSQL + Redis.',
    },
    timeline: [
      { phase: 'Phase 1: ERD Schema', detail: 'PostgreSQL relational modeling.' },
      { phase: 'Phase 2: Auth + RBAC', detail: 'JWT + role-based middleware.' },
      { phase: 'Phase 3: POS + KDS', detail: 'WebSocket order pipeline.' },
      { phase: 'Phase 4: Billing', detail: 'Invoice generation + analytics.' },
    ],
    isFeatured: false,
    order: 2,
  },
];

const SKILLS = [
  { id: 'react', name: 'React.js 18', category: 'frontend', status: 'Building Projects With', proficiency: 92, icon: 'Atom', practicalUsage: 'Used in Portfolio, interactive AI sandbox tools, and dynamic dashboards.', highlights: ['Custom Hooks & Context API', 'Framer Motion Animations', 'Component Architecture', 'Performance Optimization'], levelLabel: 'Advanced Student Level', order: 1 },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', status: 'Building Projects With', proficiency: 95, icon: 'Palette', practicalUsage: 'Designed obsidian glassmorphism design tokens and dynamic responsive layouts.', highlights: ['Custom Utility Classes', 'Responsive Grid Systems', 'Dark Theme Tokens', 'Glassmorphism Effects'], levelLabel: 'Advanced Student Level', order: 2 },
  { id: 'javascript-es6', name: 'JavaScript (ES6+)', category: 'frontend', status: 'Building Projects With', proficiency: 90, icon: 'Code2', practicalUsage: 'Asynchronous event loops, DOM manipulation, state management, and modern ESNext features.', highlights: ['Async/Await & Promises', 'ES6 Modules & Closures', 'DOM Manipulation', 'Event Loop Concepts'], levelLabel: 'Advanced Student Level', order: 3 },
  { id: 'nodejs', name: 'Node.js', category: 'backend', status: 'Building Projects With', proficiency: 86, icon: 'Server', practicalUsage: 'Built REST API gateways, event-driven web servers, and asynchronous middleware pipelines.', highlights: ['Express Middleware', 'REST API Architecture', 'JWT Authentication', 'Asynchronous I/O'], levelLabel: 'Intermediate Student Level', order: 4 },
  { id: 'express', name: 'Express.js', category: 'backend', status: 'Building Projects With', proficiency: 88, icon: 'Cpu', practicalUsage: 'Developed backend API endpoints for portfolio contact submissions and telemetry analytics.', highlights: ['Custom Route Handlers', 'Input Validation', 'Error Handling', 'CORS & Security Headers'], levelLabel: 'Intermediate Student Level', order: 5 },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', status: 'Building Projects With', proficiency: 82, icon: 'Zap', practicalUsage: 'High-performance Python web framework for GNN inference models and real-time streaming APIs.', highlights: ['Pydantic Schemas', 'Asynchronous Endpoints', 'WebSocket Streaming', 'Automatic OpenAPI Docs'], levelLabel: 'Intermediate Student Level', order: 6 },
  { id: 'pytorch', name: 'PyTorch', category: 'aiml', status: 'Building Projects With', proficiency: 80, icon: 'Bot', practicalUsage: 'Built Graph Neural Networks, tensor operations, and model loss optimization curves.', highlights: ['Custom Neural Layers', 'Tensor Manipulations', 'Graph Neural Networks (GNN)', 'Model Evaluation'], levelLabel: 'Academic Focus', order: 7 },
  { id: 'python-ml', name: 'Python (NumPy / SciPy)', category: 'aiml', status: 'Building Projects With', proficiency: 88, icon: 'Terminal', practicalUsage: 'Data preprocessing, matrix operations, physics RK4 integration, and data science scripts.', highlights: ['NumPy Vectorization', 'Pandas Analysis', 'Matplotlib Visualization', 'Scientific Computing'], levelLabel: 'Academic Focus', order: 8 },
  { id: 'scikit-learn', name: 'Scikit-Learn', category: 'aiml', status: 'Learning', proficiency: 75, icon: 'Sparkles', practicalUsage: 'Applied linear regression, decision trees, random forests, and feature scaling techniques.', highlights: ['Model Training', 'Feature Extraction', 'Cross-Validation', 'Evaluation Metrics'], levelLabel: 'Active Coursework', order: 9 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', status: 'Building Projects With', proficiency: 84, icon: 'Database', practicalUsage: 'Relational database schema modeling, indexing, foreign keys, and SQL query optimization.', highlights: ['Relational Schema Design', 'SQL Queries & Joins', 'Indexing Strategies', 'ACID Transactions'], levelLabel: 'Intermediate Student Level', order: 10 },
  { id: 'mongodb', name: 'MongoDB / Mongoose', category: 'databases', status: 'Building Projects With', proficiency: 85, icon: 'FileCode', practicalUsage: 'NoSQL document storage for contact messages, telemetry tracking, and unstructured JSON logs.', highlights: ['Document Modeling', 'Aggregation Pipeline', 'Mongoose Schemas', 'CRUD Operations'], levelLabel: 'Intermediate Student Level', order: 11 },
  { id: 'cpp', name: 'C++', category: 'languages', status: 'Building Projects With', proficiency: 85, icon: 'Terminal', practicalUsage: 'Used in OOP coursework, DSA problem solving, and low-latency systems.', highlights: ['OOP & Encapsulation', 'Pointers & Memory Control', 'STL Algorithms & Vectors', 'Class Polymorphism'], levelLabel: 'Core CS Foundation', order: 12 },
  { id: 'git', name: 'Git & GitHub', category: 'tools', status: 'Building Projects With', proficiency: 90, icon: 'GitBranch', practicalUsage: 'Version control, feature branching, PR reviews, and GitHub Actions CI/CD workflows.', highlights: ['Branching Strategies', 'PR Workflows', 'Commit History Hygiene', 'GitHub Actions Basics'], levelLabel: 'Daily Engineering Standard', order: 13 },
  { id: 'docker', name: 'Docker Containerization', category: 'tools', status: 'Learning', proficiency: 72, icon: 'Box', practicalUsage: 'Containerized multi-stage Docker builds for Vite React frontend and Express Node.js backend.', highlights: ['Multi-Stage Dockerfiles', 'Container Networking', 'Environment Configuration', 'Image Optimization'], levelLabel: 'Active Skill Expansion', order: 14 },
];

const EDUCATION = [
  { id: 'btech-cse-aiml', type: 'degree', institution: 'Maharana Pratap Institute of Professional Studies', degree: 'B.Tech in Computer Science & Engineering (AI & ML)', duration: '2024 — 2028 (Expected)', currentStatus: 'Second Year Student (CGPA: 9.2 / 10.0)', location: 'India', relevantCoursework: ['Data Structures & Algorithms', 'Object-Oriented Programming (C++)', 'Database Management Systems', 'Operating Systems & System Logic', 'Linear Algebra & Applied ML'], highlights: ['Ranked top 5% in academic coursework', 'Lead Student Coordinator for Tech & AI Student Chapter', 'Organized college-level hackathons and coding contests'], order: 1 },
  { id: 'senior-secondary', type: 'degree', institution: 'Higher Secondary Education (CBSE / State Board)', degree: 'Senior Secondary Schooling (Class XII - PCM)', duration: '2022 — 2024', currentStatus: 'Completed with Distinction', location: 'India', relevantCoursework: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science (Python)'], highlights: ['Scored 90%+ in Mathematics & Computer Science', 'Built first Python automation scripts in high school'], order: 2 },
  { id: 'cert-python', type: 'certification', degree: 'Python for Data Science & AI', platform: 'Coursera / IBM', status: 'Completed', date: '2025', credentialUrl: 'https://coursera.org/verify/credential-placeholder', order: 3 },
  { id: 'cert-fullstack', type: 'certification', degree: 'Full-Stack Web Engineering', platform: 'freeCodeCamp / Udemy', status: 'Completed', date: '2025', credentialUrl: 'https://freecodecamp.org/certification/placeholder', order: 4 },
  { id: 'cert-pytorch', type: 'certification', degree: 'Deep Learning with PyTorch', platform: 'Udacity / DeepLearning.AI', status: 'In Progress', date: 'Expected Q2 2026', credentialUrl: '#', order: 5 },
];

const ROADMAP = [
  { number: '01', name: 'Portfolio', subtitle: 'Production-ready personal platform & developer telemetry dashboard.', status: 'Completed', statusVariant: 'emerald', statusSymbol: '🟢', progress: 100, progressLabel: 'Completed', lastUpdated: 'Updated Q1 2026', description: 'Building a premium production-ready portfolio with React 18, Node.js, Express backend API, modern glassmorphism design system, and recruiter-focused experience.', currentFocus: ['Nodemailer Contact Form Integration', 'Telemetry Admin Dashboard & Real-Time Analytics', 'Vercel & Docker Multi-Platform Public Deployment'], plannedModules: ['Interactive WebGL Anti-Gravity Particle Canvas', 'Centralized Candidate Data Store', 'Product-Grade Case Study Modals & Metrics'], technologies: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'], category: 'Full-Stack Web & Telemetry', order: 1 },
  { number: '02', name: 'Restaurant Management System', subtitle: 'End-to-end POS, inventory control, billing, and real-time order processing platform.', status: 'Coming Soon', statusVariant: 'amber', statusSymbol: '🟡', progress: 0, progressLabel: 'Coming Soon', lastUpdated: 'Planned Q2 2026', description: 'A complete multi-tenant restaurant management platform with role-based authentication, real-time kitchen order display (KDS), inventory tracking, invoice billing, and revenue analytics.', currentFocus: ['Database Schema Design & ERD Modeling', 'Role-Based Access Control (RBAC) System', 'POS & Invoice Billing Module Specifications'], plannedModules: ['JWT Authentication & Multi-Role User Management', 'Real-Time Kitchen Order Display via WebSockets', 'Inventory Stock Tracking & Automatic Low-Stock Alerts', 'Automated Billing & Digital Receipt Generation', 'Manager Analytics Dashboard (Revenue & Popular Dishes)'], technologies: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS'], category: 'Enterprise Full-Stack System', order: 2 },
];

const SOCIAL_LINKS = [
  { platform: 'github', label: 'GitHub', url: 'https://github.com/anuragsahu0', icon: 'github', color: '#06b6d4', order: 1 },
  { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/anurag-sahu-5a46b9360/', icon: 'linkedin', color: '#8b5cf6', order: 2 },
  { platform: 'email', label: 'Email', url: 'mailto:shivasahu0612@gmail.com', icon: 'mail', color: '#10b981', order: 3 },
];

const SETTINGS = [
  { key: 'site_name', value: 'Anurag Sahu Portfolio', description: 'Site display name' },
  { key: 'candidate_name', value: 'Anurag Sahu', description: 'Candidate full name' },
  { key: 'candidate_email', value: 'shivasahu0612@gmail.com', description: 'Primary contact email' },
  { key: 'candidate_institution', value: 'Maharana Pratap Institute of Professional Studies', description: 'College / University name' },
  { key: 'availability_status', value: 'Open for Summer 2026 Internships', description: 'Current availability status' },
  { key: 'github_url', value: 'https://github.com/anuragsahu0', description: 'GitHub profile URL' },
  { key: 'linkedin_url', value: 'https://www.linkedin.com/in/anurag-sahu-5a46b9360/', description: 'LinkedIn profile URL' },
  { key: 'hero_tagline', value: 'Building modern full-stack web applications and practical AI solutions.', description: 'Hero section main tagline' },
  { key: 'about_subtitle', value: 'Passionate about building modern web experiences and continuously growing as a software developer.', description: 'About Me section subtitle' },
];

// ─── Seed Function ──────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('\n🍃 Connected to MongoDB:', MONGODB_URI);

    // Clear all collections
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Education.deleteMany({}),
      Roadmap.deleteMany({}),
      SocialLink.deleteMany({}),
      Settings.deleteMany({}),
    ]);

    // Insert data
    console.log('\n📦 Seeding database...');
    await User.insertMany(USERS);
    console.log(`  ✓ ${USERS.length} admin user(s) created`);

    await Project.insertMany(PROJECTS);
    console.log(`  ✓ ${PROJECTS.length} projects seeded`);

    await Skill.insertMany(SKILLS);
    console.log(`  ✓ ${SKILLS.length} skills seeded`);

    await Education.insertMany(EDUCATION);
    console.log(`  ✓ ${EDUCATION.length} education records seeded`);

    await Roadmap.insertMany(ROADMAP);
    console.log(`  ✓ ${ROADMAP.length} roadmap entries seeded`);

    await SocialLink.insertMany(SOCIAL_LINKS);
    console.log(`  ✓ ${SOCIAL_LINKS.length} social links seeded`);

    await Settings.insertMany(SETTINGS);
    console.log(`  ✓ ${SETTINGS.length} settings seeded`);

    console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log(`\n   Admin Login:`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Endpoint: POST http://localhost:5001/api/auth/login`);
    console.log('\n   Run: npm run dev (to start the server)');
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ SEED ERROR:', err.message);
    process.exit(1);
  }
}

seed();
