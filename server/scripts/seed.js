require('dotenv').config({ path: require('path').join(__dirname, '../../server/.env') });
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Profile = require('../models/Profile');
const About = require('../models/About');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Roadmap = require('../models/Roadmap');
const Media = require('../models/Media');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const Resume = require('../models/Resume');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anti_gravity_portfolio';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'anuragsahu@anuragsahu.dev').toLowerCase();
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'anuragsahu').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ABCDEF123';

async function seed() {
  console.log('🌱 Connecting to database for authentic portfolio seeding...');
  await mongoose.connect(MONGODB_URI);
  console.log('🍃 Connected to MongoDB.');

  // 1. Admin User
  console.log('👤 Seeding Admin User...');
  await User.deleteMany({ email: { $ne: ADMIN_EMAIL } });
  const adminUser = new User({
    name: 'Anurag Sahu',
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'OWNER',
    status: 'ACTIVE',
    isActive: true,
  });
  await adminUser.save();
  console.log(`✓ Sovereign Admin User created: ${ADMIN_USERNAME} (${ADMIN_EMAIL})`);

  // 2. Profile
  console.log('📋 Seeding Profile...');
  await Profile.deleteMany({});
  await Profile.create({
    fullName: 'Anurag Sahu',
    professionalHeadline: 'Computer Science Engineer & Full-Stack Developer',
    shortIntroduction: 'Passionate about building modern web experiences and continuously growing as a software developer.',
    profileImage: '/assets/anurag-portrait-sm.webp',
    secondaryImage: '/assets/anurag-portrait-sm.jpg',
    location: 'India',
    availability: 'Open to Internship Opportunities',
    currentFocus: 'Full-Stack Development & Autonomous AI Systems',
    email: 'shivasahu0612@gmail.com',
    github: 'https://github.com/anuragsahu0',
    linkedin: 'https://linkedin.com/in/anuragsahu0',
    portfolioUrl: 'https://anuragsahu.com',
    resumeUrl: '/assets/anurag-sahu-resume.pdf',
  });
  console.log('✓ Profile seeded.');

  // 3. About
  console.log('📖 Seeding About narrative...');
  await About.deleteMany({});
  await About.create({
    title: 'About Me',
    description: 'Passionate about building modern web experiences and continuously growing as a software developer.',
    personalNarrative: [
      {
        id: 'p1',
        text: "Hi, I'm Anurag Sahu, a B.Tech student in Computer Science & Engineering (AI & ML) at Maharana Pratap Institute of Professional Studies.",
        highlightWords: ['Anurag Sahu', 'Computer Science & Engineering (AI & ML)', 'Maharana Pratap Institute of Professional Studies'],
      },
      {
        id: 'p2',
        text: 'I am passionate about building modern, scalable web applications and continuously improving my problem-solving skills.',
        highlightWords: ['modern, scalable web applications'],
      },
      {
        id: 'p3',
        text: 'My current focus is Full-Stack Development, where I work with both frontend and backend technologies to create responsive, efficient, and user-centric solutions.',
        highlightWords: ['Full-Stack Development'],
      },
      {
        id: 'p4',
        text: 'I enjoy learning new technologies, taking on challenging projects, and writing clean, maintainable code.',
        highlightWords: ['clean, maintainable code'],
      },
      {
        id: 'p5',
        text: "I'm actively seeking opportunities to contribute, grow as a developer, and deliver meaningful software that creates real-world impact.",
        highlightWords: ['real-world impact'],
      },
    ],
    learningJourney: 'B.Tech CSE (AI & ML) with rigorous coursework in algorithms, database design, and deep learning neural architectures.',
    engineeringValues: [
      { title: 'Deterministic Engineering', description: 'Writing robust, testable, and maintainable software systems.', icon: 'ShieldCheck' },
      { title: 'Performance Optimization', description: 'Architecting high-speed, lightweight experiences with sub-second response times.', icon: 'Zap' },
      { title: 'Production Reliability', description: 'Zero compromise on security, validation, and fault-tolerant architecture.', icon: 'Cpu' },
    ],
    currentFocus: 'Full-Stack Development with React, Node.js, Express, and Modern Cloud Microservices.',
    goals: ['Excel in Software Engineering', 'Ship Enterprise-Grade Systems', 'Master Scalable Distributed Architecture'],
    interests: ['Autonomous AI Systems', 'Modern Web Infrastructure', 'Fintech & Multi-Way Reconciliation', 'High-Performance APIs'],
    displayOrder: 1,
    isPublished: true,
  });
  console.log('✓ About narrative seeded.');

  // 4. Projects (Authentic 3 projects)
  console.log('🚀 Seeding Projects...');
  await Project.deleteMany({});
  await Project.create([
    {
      id: 'ai-finance-controller',
      slug: 'ai-finance-controller',
      title: 'AI Finance Controller',
      subtitle: 'Autonomous Financial Operations, Multi-Way Reconciliation & Audit Platform.',
      shortDescription: 'Autonomous enterprise financial operations platform with multi-source ingestion, reconciliation, tax intelligence & Finance Copilot.',
      description: 'Autonomous enterprise financial operations platform featuring multi-source data ingestion, deterministic multi-way reconciliation engine, GST/VAT tax intelligence, statistical anomaly detection 2.0 (+178% surge detection), controlled settlement automation with Four-Eyes authorization, and Finance Copilot.',
      category: 'enterprise',
      categoryLabel: 'Autonomous AI & Fintech',
      badge: 'FLAGSHIP AI FINTECH',
      tagline: 'Autonomous enterprise financial operations platform with multi-source ingestion, reconciliation, tax intelligence & Finance Copilot.',
      status: 'COMPLETED',
      progress: 100,
      githubUrl: 'https://github.com/anuragsahu0/ai-finance-controller',
      liveUrl: 'https://anuragsahu.com/AI-FINANCE-CONTROLLER',
      thumbnail: '/assets/project-portfolio.webp',
      gallery: [],
      technologies: ['Next.js 14', 'FastAPI', 'Python', 'PostgreSQL', 'Alembic', 'Tailwind CSS', 'Docker', 'AI Copilot'],
      featured: true,
      visibility: 'PUBLISHED',
      displayOrder: 1,
      metrics: [
        { label: 'Platform Status', value: '100%', change: '🟢 Live & Operational' },
        { label: 'Reconciliation', value: 'Multi-Way Engine', change: 'Deterministic' },
        { label: 'Tax & Anomaly', value: 'Active', change: 'GST/VAT Matching' },
        { label: 'Governance', value: 'Four-Eyes', change: 'Strict Dual Authorization' },
      ],
      techStack: ['Next.js 14', 'FastAPI', 'Python', 'PostgreSQL', 'Alembic', 'Tailwind CSS', 'Docker'],
      recruiterHighlights: [
        'Built multi-way deterministic reconciliation pipeline comparing real bank statements, ledger entries, and payment feeds.',
        'Implemented automated GST/VAT tax matching and statistical anomaly detection flagging volume surges with UNUSUAL tag.',
        'Designed controlled settlement engine enforcing Four-Eyes principle preventing self-approval of payouts.',
        'Integrated Finance Copilot with specialized logical agents citing verified database records and PII masking.',
      ],
      architecture: {
        frontend: 'Next.js 14 App Router with Tailwind CSS, Lucide icons, and responsive executive finance consoles.',
        backend: 'FastAPI Python asynchronous service with SQLAlchemy ORM, Alembic migrations, and security middlewares.',
      },
      timeline: [
        { phase: 'Phase 1-4: Foundation & Ingestion', detail: 'Multi-source CSV/Excel parsing & schemas.' },
        { phase: 'Phase 5: Reconciliation Engine', detail: 'Deterministic multi-way matching & scores.' },
        { phase: 'Phase 6-8: Tax, Risk & Settlement', detail: 'Four-Eyes approval & tax discrepancy engine.' },
        { phase: 'Phase 9-10: Monitoring & Intelligence', detail: 'Event bus, 7-day cash flow forecast & Copilot.' },
      ],
    },
    {
      id: 'restaurant-management-system',
      slug: 'restaurant-management-system',
      title: 'Restaurant Management System',
      subtitle: 'Multi-tenant POS, kitchen order display, and automated billing engine.',
      shortDescription: 'Multi-tenant restaurant operations platform with live WebSocket KDS.',
      description: 'A complete multi-tenant restaurant management platform with authentication, real-time kitchen order display (KDS), inventory control, billing, and analytics.',
      category: 'enterprise',
      categoryLabel: 'Enterprise System',
      badge: 'COMING SOON',
      tagline: 'Multi-tenant restaurant operations platform with live WebSocket KDS.',
      status: 'COMING_SOON',
      progress: 15,
      githubUrl: 'https://github.com/anuragsahu0/restaurant-management-system',
      liveUrl: '#',
      thumbnail: '/assets/project-portfolio.webp',
      gallery: [],
      technologies: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS', 'JWT'],
      featured: false,
      visibility: 'PUBLISHED',
      displayOrder: 2,
      metrics: [
        { label: 'Phase', value: '15%', change: 'Coming Soon' },
        { label: 'Auth', value: 'RBAC', change: 'JWT + Multi-Tenant' },
        { label: 'Real-Time', value: 'WebSockets', change: 'KDS Display' },
        { label: 'DB', value: 'PostgreSQL', change: 'Relational + Redis' },
      ],
      techStack: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets'],
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
    },
    {
      id: 'smart-college-erp',
      slug: 'smart-college-erp',
      title: 'Smart College ERP',
      subtitle: 'Student attendance, examination results & fee collection gateway.',
      shortDescription: 'An end-to-end college management ERP platform featuring student attendance, results, and fee gateway.',
      description: 'An end-to-end college management ERP platform featuring student attendance tracking, examination result portal, fee collection gateway, and automated performance analytics.',
      category: 'academic',
      categoryLabel: 'Academic ERP',
      badge: 'COMING SOON',
      tagline: 'End-to-end college ERP management system with RBAC & analytics.',
      status: 'COMING_SOON',
      progress: 10,
      githubUrl: 'https://github.com/anuragsahu0/smart-college-erp',
      liveUrl: '#',
      thumbnail: '/assets/project-portfolio.webp',
      gallery: [],
      technologies: ['React', 'Express', 'MongoDB', 'Node.js', 'Tailwind CSS', 'JWT'],
      featured: false,
      visibility: 'PUBLISHED',
      displayOrder: 3,
      metrics: [
        { label: 'Status', value: 'Planned', change: '🟡 Coming Soon' },
        { label: 'Modules', value: 'Attendance/Fees', change: 'Full Lifecycle' },
        { label: 'Auth', value: 'RBAC', change: 'Student/Faculty/Admin' },
        { label: 'Database', value: 'MongoDB', change: 'Mongoose' },
      ],
      techStack: ['React', 'Express', 'MongoDB', 'Node.js', 'Tailwind CSS'],
      recruiterHighlights: [
        'Student Attendance & Bio-metric Sync System.',
        'Examination Result Portal & Grade Sheet Publisher.',
        'Online Fee Collection Gateway & Financial Accounting Module.',
      ],
      architecture: {
        frontend: 'React single page portal for students and faculty.',
        backend: 'Express.js REST APIs with MongoDB.',
      },
      timeline: [
        { phase: 'Phase 1: Portal & Auth', detail: 'Role-based access system.' },
        { phase: 'Phase 2: Modules', detail: 'Attendance, grading & payments.' },
      ],
    },
  ]);
  console.log('✓ Projects seeded.');

  // 5. Skills (Authentic 14 skills)
  console.log('⚡ Seeding Skills...');
  await Skill.deleteMany({});
  await Skill.create([
    { name: 'React.js 18', category: 'Frontend', proficiency: 92, icon: 'Atom', description: 'Used in personal portfolio, interactive sandboxes, and modern component systems.', displayOrder: 1, isVisible: true },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, icon: 'Palette', description: 'Obsidian glassmorphism design tokens, micro-interactions, and mobile viewports.', displayOrder: 2, isVisible: true },
    { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 90, icon: 'Code2', description: 'Async/await event loops, closures, DOM manipulation, and modern web standards.', displayOrder: 3, isVisible: true },
    { name: 'Node.js', category: 'Backend', proficiency: 86, icon: 'Server', description: 'Event-driven web servers, REST API gateways, and asynchronous pipelines.', displayOrder: 4, isVisible: true },
    { name: 'Express.js', category: 'Backend', proficiency: 88, icon: 'Cpu', description: 'Custom middlewares, rate limiting, JWT authentication, and structured error handling.', displayOrder: 5, isVisible: true },
    { name: 'FastAPI', category: 'Backend', proficiency: 82, icon: 'Zap', description: 'High-performance asynchronous Python REST APIs and model inference endpoints.', displayOrder: 6, isVisible: true },
    { name: 'PyTorch', category: 'AI/ML', proficiency: 80, icon: 'Bot', description: 'Graph neural networks, tensor operations, and model loss optimization pipelines.', displayOrder: 7, isVisible: true },
    { name: 'Python (NumPy / SciPy)', category: 'AI/ML', proficiency: 88, icon: 'Terminal', description: 'Scientific computing, data vectorization, and machine learning pipelines.', displayOrder: 8, isVisible: true },
    { name: 'MongoDB / Mongoose', category: 'Database', proficiency: 85, icon: 'Database', description: 'Document schemas, aggregation pipelines, replica sets, and indexing.', displayOrder: 9, isVisible: true },
    { name: 'PostgreSQL', category: 'Database', proficiency: 82, icon: 'Boxes', description: 'Relational data modeling, foreign keys, ACID compliance, and SQL optimization.', displayOrder: 10, isVisible: true },
    { name: 'Git & GitHub', category: 'Tools', proficiency: 90, icon: 'GitBranch', description: 'Version control, atomic commits, pull requests, and CI/CD pipelines.', displayOrder: 11, isVisible: true },
    { name: 'Docker', category: 'Tools', proficiency: 75, icon: 'Container', description: 'Multi-stage container builds, microservices, and deployment isolation.', displayOrder: 12, isVisible: true },
    { name: 'Postman', category: 'Tools', proficiency: 88, icon: 'Send', description: 'Automated API testing suites, environment variables, and mock servers.', displayOrder: 13, isVisible: true },
    { name: 'Linux / Bash', category: 'Tools', proficiency: 80, icon: 'TerminalSquare', description: 'Shell scripting, server automation, process managers, and deployment.', displayOrder: 14, isVisible: true },
  ]);
  console.log('✓ Skills seeded.');

  // 6. Experience
  console.log('💼 Seeding Experience...');
  await Experience.deleteMany({});
  await Experience.create([
    {
      organization: 'Maharana Pratap Institute of Professional Studies',
      role: 'Lead Student Technical Coordinator (AI & Web)',
      description: 'Leading student technical chapter, organizing collegiate hackathons, coordinating full-stack workshops, and architecting internal tools.',
      technologies: ['React', 'Node.js', 'FastAPI', 'Git', 'MongoDB'],
      achievements: [
        'Organized multi-college hackathons and technical symposiums for 200+ students.',
        'Conducted hands-on sessions on modern web development and Git workflows.',
      ],
      startDate: 'Aug 2024',
      endDate: 'Present',
      isCurrent: true,
      displayOrder: 1,
      isVisible: true,
    },
  ]);
  console.log('✓ Experience seeded.');

  // 7. Education
  console.log('🎓 Seeding Education...');
  await Education.deleteMany({});
  await Education.create([
    {
      institution: 'Maharana Pratap Institute of Professional Studies',
      degree: 'B.Tech in Computer Science & Engineering (AI & ML)',
      specialization: 'Artificial Intelligence & Machine Learning',
      startYear: '2024',
      endYear: '2028',
      cgpa: '9.2 / 10.0',
      description: 'Specializing in core computer science, deep learning foundations, and full-stack software architecture.',
      relevantCoursework: [
        'Data Structures & Algorithms',
        'Object-Oriented Programming (C++)',
        'Database Management Systems',
        'Operating Systems',
        'Artificial Intelligence & Machine Learning',
      ],
      highlights: [
        'Ranked top 5% in academic coursework',
        'Lead Student Coordinator for Tech & AI Student Chapter',
        'Organized collegiate hackathons and coding symposiums',
      ],
      displayOrder: 1,
      isVisible: true,
    },
    {
      institution: 'Higher Secondary Education (CBSE / State Board)',
      degree: 'Senior Secondary Schooling (Class XII - PCM)',
      specialization: 'Physics, Chemistry, Mathematics & Computer Science',
      startYear: '2022',
      endYear: '2024',
      cgpa: '90%+',
      description: 'Completed secondary education with distinction in Mathematics and Computer Science (Python).',
      relevantCoursework: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science (Python)'],
      highlights: [
        'Scored 90%+ in Mathematics & Computer Science',
        'Developed foundational Python automation programs in high school',
      ],
      displayOrder: 2,
      isVisible: true,
    },
  ]);
  console.log('✓ Education seeded.');

  // 8. Certificates
  console.log('📜 Seeding Certificates...');
  await Certificate.deleteMany({});
  await Certificate.create([
    {
      title: 'Python for Data Science & AI',
      issuer: 'Coursera / IBM',
      issueDate: '2025',
      credentialUrl: 'https://coursera.org/verify/credential-placeholder',
      image: '',
      description: 'Data analysis, NumPy, Pandas vectorization, and foundational machine learning techniques.',
      displayOrder: 1,
      isVisible: true,
    },
    {
      title: 'Full-Stack Web Engineering',
      issuer: 'freeCodeCamp / Udemy',
      issueDate: '2025',
      credentialUrl: 'https://freecodecamp.org/certification/placeholder',
      image: '',
      description: 'Modern frontend design patterns, asynchronous JavaScript, Node.js API development, and MongoDB integration.',
      displayOrder: 2,
      isVisible: true,
    },
    {
      title: 'Deep Learning with PyTorch',
      issuer: 'Udacity / DeepLearning.AI',
      issueDate: '2026',
      credentialUrl: '',
      image: '',
      description: 'Neural network layer architecture, tensor mathematics, backpropagation, and loss optimization.',
      displayOrder: 3,
      isVisible: true,
    },
  ]);
  console.log('✓ Certificates seeded.');

  // 9. Roadmap
  console.log('🗺️ Seeding Roadmap...');
  await Roadmap.deleteMany({});
  await Roadmap.create([
    {
      title: 'AI Finance Controller',
      number: '01',
      name: 'AI Finance Controller',
      subtitle: 'Autonomous enterprise financial operations platform & Finance Copilot.',
      status: 'COMPLETED',
      statusVariant: 'emerald',
      statusSymbol: '🟢',
      progress: 100,
      progressLabel: 'Completed • Operational',
      lastUpdated: 'Updated Q1 2026',
      description: 'Autonomous enterprise financial operations platform with multi-source ingestion, deterministic multi-way reconciliation engine, GST/VAT tax intelligence, statistical anomaly detection 2.0 (+178% surge detection), controlled settlement automation with Four-Eyes authorization, and Finance Copilot.',
      currentFocus: [
        'Multi-Source Ingestion & Deterministic Reconciliation Engine',
        'Tax Matching & Statistical Anomaly Baselines (+178% Surge Detection)',
        'Controlled Settlement Engine with Four-Eyes Authorization Gate',
      ],
      plannedModules: [
        'Finance Copilot 2.0 with Specialized Grounded Agents & 7-Day Forecasting',
        'Automated Bank Statement & Ledger Reconciliation Feed',
        'Real-Time Anomaly Alert Webhooks & Audit Exports',
      ],
      technologies: ['FastAPI', 'Python', 'Next.js 14', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
      category: 'Autonomous AI & FinTech',
      displayOrder: 1,
      isVisible: true,
    },
    {
      title: 'Meoww Racing Game',
      number: '02',
      name: 'Meoww Racing Game',
      subtitle: 'Interactive 2D/3D arcade cat racing game with HTML5 Canvas physics engine.',
      status: 'COMING_SOON',
      statusVariant: 'amber',
      statusSymbol: '🟡',
      progress: 15,
      progressLabel: 'Planning • 15% Completed',
      lastUpdated: 'Planned Q2 2026',
      description: 'An action-packed arcade racing game featuring feline racers, nitro boosters, dynamic obstacle courses, and high score leaderboards.',
      currentFocus: [
        'Database Schema Design & ERD Modeling',
        'Physics Engine Collision Detection & Vector Math',
        'Custom Sprite Sheet Animation Pipeline',
      ],
      plannedModules: [
        'Canvas 2D Physics Loop with Variable Delta Timing',
        'Audio Synthesizer for Engine Sound FX',
        'Local Storage & Cloud Leaderboard Sync',
      ],
      technologies: ['HTML5 Canvas', 'JavaScript ES6+', 'WebGL', 'Tailwind CSS'],
      category: 'Game Engineering & Simulation',
      displayOrder: 2,
      isVisible: true,
    },
    {
      title: 'Autonomous Financial Reconciliation Engine',
      number: '03',
      name: 'AI Finance Controller',
      subtitle: 'High-throughput deterministic reconciliation engine with GST/VAT matching.',
      status: 'PLANNING',
      statusVariant: 'purple',
      statusSymbol: '🟣',
      progress: 30,
      progressLabel: 'Architecture Phase • 30%',
      lastUpdated: 'Q2 2026',
      description: 'Autonomous financial reconciliation system handling multi-source transaction feeds, rule-based settlement engines, and anomaly detection.',
      currentFocus: [
        'Deterministic Matching Pipeline',
        'Four-Eyes Authorization Enforcement',
        'Anomaly Flagging Algorithm',
      ],
      plannedModules: [
        'FastAPI Microservice with Asynchronous Processing',
        'Multi-Format Bank Statement Ingestion',
        'Audit Trail Verification & PII Protection',
      ],
      technologies: ['FastAPI', 'Python', 'PostgreSQL', 'Docker', 'Redis'],
      category: 'Fintech & Autonomous AI',
      displayOrder: 3,
      isVisible: true,
    },
  ]);
  console.log('✓ Roadmap seeded.');

  // 10. Media
  console.log('🖼️ Seeding Media Metadata & Static Assets...');
  await Media.deleteMany({});
  await Media.create([
    {
      fileName: 'anurag-portrait-sm.webp',
      originalName: 'anurag-portrait-sm.webp',
      url: '/assets/anurag-portrait-sm.webp',
      type: 'image',
      fileType: 'image',
      mimeType: 'image/webp',
      size: 9026,
      width: 400,
      height: 400,
      altText: 'Anurag Sahu Portrait WebP',
      caption: 'Official profile portrait',
      category: 'PROFILE',
      status: 'ACTIVE',
    },
    {
      fileName: 'anurag-portrait-sm.jpg',
      originalName: 'anurag-portrait-sm.jpg',
      url: '/assets/anurag-portrait-sm.jpg',
      type: 'image',
      fileType: 'image',
      mimeType: 'image/jpeg',
      size: 15618,
      width: 400,
      height: 400,
      altText: 'Anurag Sahu Portrait JPEG',
      caption: 'Profile fallback image',
      category: 'PROFILE',
      status: 'ACTIVE',
    },
    {
      fileName: 'anurag-portrait.webp',
      originalName: 'anurag-portrait.webp',
      url: '/assets/anurag-portrait.webp',
      type: 'image',
      fileType: 'image',
      mimeType: 'image/webp',
      size: 46052,
      width: 1200,
      height: 1200,
      altText: 'Anurag Sahu High-Resolution Portrait',
      caption: 'Open Graph social card image',
      category: 'SEO',
      status: 'ACTIVE',
    },
    {
      fileName: 'anurag-portrait.jpg',
      originalName: 'anurag-portrait.jpg',
      url: '/assets/anurag-portrait.jpg',
      type: 'image',
      fileType: 'image',
      mimeType: 'image/jpeg',
      size: 81602,
      width: 1200,
      height: 1200,
      altText: 'Anurag Sahu High-Resolution Portrait JPEG',
      caption: 'High-DPI Hero fallback',
      category: 'SEO',
      status: 'ACTIVE',
    },
    {
      fileName: 'anurag-sahu-resume.pdf',
      originalName: 'anurag-sahu-resume.pdf',
      url: '/assets/anurag-sahu-resume.pdf',
      type: 'document',
      fileType: 'document',
      mimeType: 'application/pdf',
      size: 85200,
      altText: 'Anurag Sahu Curriculum Vitae PDF',
      caption: 'Official Software Engineering Resume',
      category: 'RESUME',
      status: 'ACTIVE',
    },
    {
      fileName: 'as-admin-icon.svg',
      originalName: 'as-admin-icon.svg',
      url: '/assets/as-admin-icon.svg',
      type: 'image',
      fileType: 'image',
      mimeType: 'image/svg+xml',
      size: 2519,
      altText: 'Anurag Sahu Control Center Logo',
      caption: 'Control Center Brand Icon',
      category: 'BRANDING',
      status: 'ACTIVE',
    },
  ]);
  console.log('✓ Media metadata seeded.');

  // 11. Resume
  console.log('📄 Seeding Resume Versioning...');
  await Resume.deleteMany({});
  await Resume.create({
    version: 'v1.0',
    title: 'Anurag Sahu — Software Engineer Resume (v1.0)',
    fileName: 'anurag-sahu-resume.pdf',
    originalName: 'anurag-sahu-resume.pdf',
    url: '/assets/anurag-sahu-resume.pdf',
    size: 85200,
    mimeType: 'application/pdf',
    status: 'ACTIVE',
    uploadedBy: 'admin',
    notes: 'Official verified resume for internships and engineering roles.',
  });
  console.log('✓ Active Resume seeded.');

  // 12. Settings
  console.log('⚙️ Seeding Global Settings & SEO...');
  await Settings.deleteMany({});
  await Settings.create({
    singletonId: 'global',
    siteName: 'Anurag Sahu',
    portfolioUrl: 'https://anuragsahu.com',
    siteDescription: 'Computer Science Engineer & Full-Stack Developer specializing in high-performance web systems and AI applications.',
    timezone: 'Asia/Kolkata',
    contactEmail: 'shivasahu0612@gmail.com',
    contactFormEnabled: true,
    publicEmailVisible: true,
    github: 'https://github.com/anuragsahu0',
    linkedin: 'https://linkedin.com/in/anuragsahu0',
    resumeUrl: '/assets/anurag-sahu-resume.pdf',
    availability: 'Open to Internship Opportunities',
    logoUrl: '/assets/as-admin-icon.svg',
    faviconUrl: '/assets/anurag-portrait-sm.webp',
    appleTouchIconUrl: '/assets/anurag-portrait-sm.webp',
    seoTitle: 'Anurag Sahu — Full-Stack Developer & B.Tech CSE (AI & ML) Sophomore',
    seoDescription: 'Portfolio of Anurag Sahu, Computer Science & Engineering (AI & ML) student specializing in Full-Stack Web Development, React, Node.js, Python, and practical Machine Learning applications. Open for Summer 2026 internships.',
    canonicalUrl: 'https://anuragsahu.com/',
    keywords: 'Anurag Sahu, Full-Stack Developer, AI ML Developer, React Developer, Node.js, Python, Computer Science, Portfolio, Software Engineering Intern',
    author: 'Anurag Sahu',
    siteLanguage: 'en',
    robotsDirective: 'index, follow',
    ogTitle: 'Anurag Sahu — Control Center & Developer Portfolio',
    ogDescription: 'Explore engineering projects, interactive systems, and live telemetry for Anurag Sahu.',
    ogImage: '/assets/anurag-portrait.webp',
    twitterCard: 'summary_large_image',
    maintenanceMode: false,
    maintenanceMessage: 'System undergoing scheduled optimization. We will be back online shortly.',
    resumeButtonEnabled: true,
    analyticsEnabled: true,
    footerText: '© 2026 Anurag Sahu. Engineered for performance and scale.',
  });
  console.log('✓ Settings seeded.');

  // 12. Notification
  console.log('🔔 Seeding initial System Notification...');
  await Notification.deleteMany({});
  await Notification.create({
    type: 'SYSTEM',
    title: 'Control Center v2.0 Online',
    message: 'Anurag Sahu Control Center CMS backend architecture is fully operational.',
    isRead: false,
  });
  console.log('✓ Notification seeded.');

  // 13. Activity Log
  console.log('📝 Seeding initial Activity Log...');
  await ActivityLog.create({
    adminId: 'admin',
    adminEmail: ADMIN_EMAIL,
    action: 'DATABASE_SEEDED',
    resourceType: 'System',
    description: 'Authentic Anurag Sahu portfolio data migrated into CMS models.',
  });
  console.log('✓ Activity log created.');

  // 14. Hero
  console.log('🦸 Seeding Hero section...');
  const Hero = require('../models/Hero');
  await Hero.deleteMany({});
  await Hero.create({
    mainHeading: 'ENGINEERING INTELLIGENT SYSTEMS',
    highlightedText: 'FROM ZERO TO PRODUCTION',
    subtitle: 'Anurag Sahu — Computer Science Engineer & Full-Stack Developer',
    description:
      'Passionate about building production-grade full-stack platforms, deterministic financial engines, and modern distributed systems.',
    primaryCtaLabel: 'Explore Flagship AI System',
    primaryCtaUrl: '/AI-FINANCE-CONTROLLER',
    secondaryCtaLabel: 'Download Resume',
    secondaryCtaUrl: '/assets/anurag-sahu-resume.pdf',
    profileImage: '/assets/anurag-portrait-sm.webp',
    availabilityBadge: 'OPEN TO INTERNSHIP OPPORTUNITIES',
    supportingText: 'B.Tech CSE (AI & ML) • 2022–2026',
    isVisible: true,
  });
  console.log('✓ Hero seeded.');

  // 15. Navigation
  console.log('🧭 Seeding Navigation items...');
  const Navigation = require('../models/Navigation');
  await Navigation.deleteMany({});
  await Navigation.insertMany([
    { label: 'About', target: '#about', url: '#about', displayOrder: 1, isEnabled: true },
    { label: 'Projects', target: '#projects', url: '#projects', displayOrder: 2, isEnabled: true },
    { label: 'Skills', target: '#skills', url: '#skills', displayOrder: 3, isEnabled: true },
    { label: 'Experience', target: '#experience', url: '#experience', displayOrder: 4, isEnabled: true },
    { label: 'Education', target: '#education', url: '#education', displayOrder: 5, isEnabled: true },
    { label: 'Roadmap', target: '#roadmap', url: '#roadmap', displayOrder: 6, isEnabled: true },
    { label: 'Contact', target: '#contact', url: '#contact', displayOrder: 7, isEnabled: true },
  ]);
  console.log('✓ Navigation seeded.');

  // 16. Social Links
  console.log('🔗 Seeding Social Links...');
  const SocialLink = require('../models/SocialLink');
  await SocialLink.deleteMany({});
  await SocialLink.insertMany([
    { platform: 'GitHub', label: 'GitHub', url: 'https://github.com/anuragsahu0', icon: 'github', color: '#00f5ff', order: 1, isActive: true },
    { platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com/in/anuragsahu0', icon: 'linkedin', color: '#00b4d8', order: 2, isActive: true },
    { platform: 'Email', label: 'Email', url: 'mailto:shivasahu0612@gmail.com', icon: 'mail', color: '#ff6b6b', order: 3, isActive: true },
    { platform: 'Portfolio', label: 'Website', url: 'https://anuragsahu.com', icon: 'globe', color: '#10b981', order: 4, isActive: true },
  ]);
  console.log('✓ Social Links seeded.');

  console.log('\n==================================================');
  console.log('✅ ALL 16 CMS ENTITIES SEEDED SUCCESSFULLY WITH AUTHENTIC DATA');
  console.log('==================================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
