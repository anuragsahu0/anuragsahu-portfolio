/**
 * PUBLIC PORTFOLIO CONTROLLER
 * Aggregated read API and dynamic sitemap for anuragsahu.com
 * Provides safe, published-only CMS data without secrets.
 */
const Hero = require('../models/Hero');
const Profile = require('../models/Profile');
const About = require('../models/About');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Roadmap = require('../models/Roadmap');
const SocialLink = require('../models/SocialLink');
const Navigation = require('../models/Navigation');
const Resume = require('../models/Resume');
const Settings = require('../models/Settings');
const { sendSuccess } = require('../utils/apiResponse');

// ─── Default Fallback Payloads (Used if Database is Cold/Empty) ──────────────

const DEFAULT_HERO = {
  mainHeading: 'ENGINEERING INTELLIGENT SYSTEMS',
  highlightedText: 'FROM ZERO TO PRODUCTION',
  subtitle: 'Anurag Sahu — Computer Science Engineer & Full-Stack Developer',
  description:
    'Passionate about building production-grade full-stack platforms, deterministic financial engines, and modern distributed systems.',
  primaryCtaLabel: 'Explore Flagship AI System',
  primaryCtaUrl: '/AI-FINANCE-CONTROLLER',
  secondaryCtaLabel: 'Download Resume',
  secondaryCtaUrl: '/assets/resume.pdf',
  profileImage: '/assets/anurag-portrait-sm.webp',
  availabilityBadge: 'OPEN TO INTERNSHIP OPPORTUNITIES',
  supportingText: 'B.Tech CSE (AI & ML) • 2022–2026',
  isVisible: true,
};

const DEFAULT_PROFILE = {
  fullName: 'Anurag Sahu',
  professionalHeadline: 'Computer Science Engineer & Full-Stack Developer',
  shortIntroduction:
    'Passionate about building modern web experiences and continuously growing as a software developer.',
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
};

const DEFAULT_ABOUT = {
  title: 'About Me',
  description:
    'Passionate about building modern web experiences and continuously growing as a software developer.',
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
  ],
  learningJourney:
    'B.Tech CSE (AI & ML) with strong focus on full-stack architecture, algorithms, and applied machine learning.',
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
};

const DEFAULT_PROJECTS = [
  {
    _id: 'proj-1',
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
  },
  {
    _id: 'proj-2',
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
  },
  {
    _id: 'proj-3',
    id: 'portfolio',
    slug: 'portfolio',
    title: 'Portfolio',
    subtitle: 'Production-ready personal platform & developer telemetry dashboard.',
    shortDescription: 'Production-ready personal platform built with React, Express, MongoDB, and telemetry dashboard.',
    description: 'A full-stack personal platform built with modern architecture, REST APIs, MongoDB Mongoose models, and an administrative control center.',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web & Telemetry',
    badge: 'FLAGSHIP PROJECT',
    tagline: 'Building a premium production-ready portfolio with React 18, Node.js, Express backend API, modern glassmorphism design system.',
    status: 'WORKING',
    progress: 95,
    githubUrl: 'https://github.com/anuragsahu0/portfolio',
    liveUrl: 'https://anuragsahu.com',
    thumbnail: '/assets/project-portfolio.webp',
    gallery: [],
    technologies: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
    featured: true,
    visibility: 'PUBLISHED',
    displayOrder: 3,
    metrics: [
      { label: 'Completion', value: '95%', change: 'Working' },
      { label: 'Backend', value: 'Express.js', change: 'Node.js + REST' },
      { label: 'Database', value: 'MongoDB', change: 'Mongoose' },
      { label: 'Security', value: 'JWT + CSP', change: 'Production' },
    ],
    techStack: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
  },
];

const DEFAULT_SETTINGS = {
  siteName: 'Anurag Sahu',
  portfolioUrl: 'https://anuragsahu.com',
  siteDescription: 'Computer Science Engineer & Full-Stack Developer specializing in high-performance web systems and AI applications.',
  availability: 'Open to Internship Opportunities',
  footerText: '© 2026 Anurag Sahu. All rights reserved.',
  contactEmail: 'shivasahu0612@gmail.com',
  contactFormEnabled: true,
  publicEmailVisible: true,
  github: 'https://github.com/anuragsahu0',
  linkedin: 'https://linkedin.com/in/anuragsahu0',
  resumeUrl: '/assets/anurag-sahu-resume.pdf',
  logoUrl: '/assets/as-admin-icon.svg',
  faviconUrl: '/assets/anurag-portrait-sm.webp',
  appleTouchIconUrl: '/assets/anurag-portrait-sm.webp',
  maintenanceMode: false,
  maintenanceMessage: 'System undergoing scheduled optimization. We will be back online shortly.',
  resumeButtonEnabled: true,
  analyticsEnabled: true,
};

const DEFAULT_SEO = {
  title: 'Anurag Sahu — Full-Stack Developer & B.Tech CSE (AI & ML) Sophomore',
  description:
    'Portfolio of Anurag Sahu, Computer Science & Engineering (AI & ML) student specializing in Full-Stack Web Development, React, Node.js, Python, and practical Machine Learning applications. Open for Summer 2026 internships.',
  canonicalUrl: 'https://anuragsahu.com/',
  keywords: 'Anurag Sahu, Full-Stack Developer, AI ML Developer, React Developer, Node.js, Python, Computer Science, Portfolio, Software Engineering Intern',
  author: 'Anurag Sahu',
  robotsDirective: 'index, follow',
  openGraph: {
    title: 'Anurag Sahu — Control Center & Developer Portfolio',
    description: 'Explore engineering projects, interactive systems, and live telemetry for Anurag Sahu.',
    image: '/assets/anurag-portrait.webp',
    url: 'https://anuragsahu.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anurag Sahu — Control Center & Developer Portfolio',
    description: 'Explore engineering projects, interactive systems, and live telemetry for Anurag Sahu.',
    image: '/assets/anurag-portrait.webp',
  },
  faviconUrl: '/assets/anurag-portrait-sm.webp',
  appleTouchIconUrl: '/assets/anurag-portrait-sm.webp',
};

const DEFAULT_RESUME = {
  title: 'Anurag Sahu — Software Engineer Resume (2026)',
  version: 'v1.0',
  url: '/assets/anurag-sahu-resume.pdf',
  fileName: 'anurag-sahu-resume.pdf',
  size: 85200,
  updatedAt: new Date('2026-08-15'),
};

/**
 * GET /api/public/site
 * Single-fetch aggregated published portfolio payload
 * Strips all admin secrets, passwords, tokens, and unpublished drafts
 */
const getPublicSite = async (req, res, next) => {
  try {
    let hero = null;
    let profile = null;
    let about = null;
    let skills = [];
    let experience = [];
    let education = [];
    let projects = [];
    let certificates = [];
    let roadmap = [];
    let socialLinks = [];
    let navigation = [];
    let resume = null;
    let settingsDoc = null;

    const isConnected = Hero.db && Hero.db.readyState === 1;

    if (isConnected) {
      const [
        heroDoc,
        profileDoc,
        aboutDoc,
        skillsDocs,
        expDocs,
        eduDocs,
        projDocs,
        certDocs,
        roadmapDocs,
        socialDocs,
        navDocs,
        resumeDoc,
        settingsData,
      ] = await Promise.allSettled([
        Hero.findOne({ isVisible: true }).lean(),
        Profile.findOne().lean(),
        About.findOne({ isPublished: true }).lean(),
        Skill.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        Experience.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        Education.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        Project.find({ visibility: 'PUBLISHED' }).sort({ displayOrder: 1, order: 1 }).lean(),
        Certificate.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        Roadmap.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        SocialLink.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        Navigation.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
        Resume.findOne({ status: 'ACTIVE' }).sort({ updatedAt: -1 }).lean(),
        Settings.findOne({ singletonId: 'global' }).lean(),
      ]);

      if (heroDoc.status === 'fulfilled' && heroDoc.value) hero = heroDoc.value;
      if (profileDoc.status === 'fulfilled' && profileDoc.value) profile = profileDoc.value;
      if (aboutDoc.status === 'fulfilled' && aboutDoc.value) about = aboutDoc.value;
      if (skillsDocs.status === 'fulfilled' && skillsDocs.value && skillsDocs.value.length) skills = skillsDocs.value;
      if (expDocs.status === 'fulfilled' && expDocs.value) experience = expDocs.value;
      if (eduDocs.status === 'fulfilled' && eduDocs.value) education = eduDocs.value;
      if (projDocs.status === 'fulfilled' && projDocs.value && projDocs.value.length) projects = projDocs.value;
      if (certDocs.status === 'fulfilled' && certDocs.value) certificates = certDocs.value;
      if (roadmapDocs.status === 'fulfilled' && roadmapDocs.value) roadmap = roadmapDocs.value;
      if (socialDocs.status === 'fulfilled' && socialDocs.value) socialLinks = socialDocs.value;
      if (navDocs.status === 'fulfilled' && navDocs.value) navigation = navDocs.value;
      if (resumeDoc.status === 'fulfilled' && resumeDoc.value) resume = resumeDoc.value;
      if (settingsData.status === 'fulfilled' && settingsData.value) settingsDoc = settingsData.value;
    }

    // Apply safe defaults where missing
    const resolvedHero = hero || DEFAULT_HERO;
    const resolvedProfile = profile || DEFAULT_PROFILE;
    const resolvedAbout = about || DEFAULT_ABOUT;
    const resolvedProjects = (projects && projects.length ? projects : DEFAULT_PROJECTS).map((p) => {
      // Standardize portfolio title to clean "Portfolio"
      const title =
        p.id === 'portfolio' || p.slug === 'portfolio'
          ? (p.title && !p.title.includes('Antigravity') ? p.title : 'Portfolio')
          : p.title;

      return {
        _id: p._id,
        id: p.id || p.slug,
        slug: p.slug || p.id,
        title,
        subtitle: p.subtitle || '',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        category: p.category || 'fullstack',
        categoryLabel: p.categoryLabel || '',
        badge: p.badge || '',
        tagline: p.tagline || '',
        status: p.status || 'WORKING',
        progress: p.progress || 0,
        githubUrl: p.githubUrl || p.github || '',
        liveUrl: p.liveUrl || p.demo || '',
        thumbnail: p.thumbnail || p.image || '/assets/project-portfolio.webp',
        gallery: p.gallery || [],
        technologies: p.technologies || p.techStack || [],
        techStack: p.techStack || p.technologies || [],
        metrics: p.metrics || [],
        recruiterHighlights: p.recruiterHighlights || [],
        featured: Boolean(p.featured || p.isFeatured),
        displayOrder: p.displayOrder || p.order || 0,
      };
    });

    const s = settingsDoc ? { ...DEFAULT_SETTINGS, ...settingsDoc } : DEFAULT_SETTINGS;
    const resolvedSettings = {
      siteName: s.siteName,
      portfolioUrl: s.portfolioUrl,
      siteDescription: s.siteDescription,
      availability: s.availability,
      footerText: s.footerText,
      contactEmail: s.publicEmailVisible ? s.contactEmail : null,
      contactFormEnabled: s.contactFormEnabled,
      publicEmailVisible: s.publicEmailVisible,
      github: s.github,
      linkedin: s.linkedin,
      resumeUrl: s.resumeUrl,
      logoUrl: s.logoUrl,
      faviconUrl: s.faviconUrl,
      appleTouchIconUrl: s.appleTouchIconUrl,
      maintenanceMode: s.maintenanceMode,
      maintenanceMessage: s.maintenanceMessage,
      resumeButtonEnabled: s.resumeButtonEnabled,
      analyticsEnabled: s.analyticsEnabled,
    };

    const resolvedSeo = {
      title: s.seoTitle || DEFAULT_SEO.title,
      description: s.seoDescription || DEFAULT_SEO.description,
      canonicalUrl: s.canonicalUrl || DEFAULT_SEO.canonicalUrl,
      keywords: s.keywords || DEFAULT_SEO.keywords,
      author: s.author || DEFAULT_SEO.author,
      robotsDirective: s.robotsDirective || DEFAULT_SEO.robotsDirective,
      openGraph: {
        title: s.ogTitle || DEFAULT_SEO.openGraph.title,
        description: s.ogDescription || DEFAULT_SEO.openGraph.description,
        image: s.ogImage || DEFAULT_SEO.openGraph.image,
        url: s.canonicalUrl || DEFAULT_SEO.openGraph.url,
      },
      twitter: {
        card: s.twitterCard || DEFAULT_SEO.twitter.card,
        title: s.ogTitle || DEFAULT_SEO.twitter.title,
        description: s.ogDescription || DEFAULT_SEO.twitter.description,
        image: s.ogImage || DEFAULT_SEO.twitter.image,
      },
      faviconUrl: s.faviconUrl || DEFAULT_SEO.faviconUrl,
      appleTouchIconUrl: s.appleTouchIconUrl || DEFAULT_SEO.appleTouchIconUrl,
    };

    const resolvedResume = resume
      ? {
          title: resume.title,
          version: resume.version,
          url: resume.url,
          fileName: resume.fileName,
          size: resume.size,
          updatedAt: resume.updatedAt,
        }
      : DEFAULT_RESUME;

    // Cache-Control: allow client & CDN caching with stale-while-revalidate
    res.set('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300');

    return sendSuccess(res, {
      hero: resolvedHero,
      profile: resolvedProfile,
      about: resolvedAbout,
      skills,
      experience,
      education,
      projects: resolvedProjects,
      certificates,
      roadmap,
      socialLinks,
      navigation,
      resume: resolvedResume,
      settings: resolvedSettings,
      seo: resolvedSeo,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /sitemap.xml
 * Dynamic XML sitemap generator reflecting only published content
 */
const getDynamicSitemap = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let publishedProjects = [];

    try {
      if (Project.db && Project.db.readyState === 1) {
        publishedProjects = await Project.find({ visibility: 'PUBLISHED' })
          .select('slug updatedAt')
          .lean();
      }
    } catch (e) {}

    const projectUrls = publishedProjects
      .filter((p) => p.slug && p.slug !== 'portfolio')
      .map((p) => {
        const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today;
        return `  <url>\n    <loc>https://anuragsahu.com/${encodeURIComponent(p.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anuragsahu.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://anuragsahu.com/AI-FINANCE-CONTROLLER</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
${projectUrls ? projectUrls + '\n' : ''}</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
    return res.send(xml);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicSite,
  getDynamicSitemap,
};
