import { SITE_CONFIG } from '@/constants/config';

/**
 * ANTI GRAVITY — About Me Data Store
 * Centralized data schema for candidate personal narrative, highlight chips, and profile card details.
 */

export const ABOUT_ME_DATA = {
  sectionTitle: 'About Me',
  sectionSubtitle: 'Passionate about building modern web experiences and continuously growing as a software developer.',
  name: SITE_CONFIG.name,
  degree: 'Computer Science & Engineering (AI & ML)',
  college: SITE_CONFIG.institution,
  currentFocus: 'Full-Stack Development',
  status: 'Open for Internship',
  statusSymbol: '🟢',
  portraitImageWebp: '/assets/anurag-portrait-sm.webp',
  portraitImageJpg: '/assets/anurag-portrait-sm.jpg',
  paragraphs: [
    {
      id: 'p1',
      text: "Hi, I'm Anurag Sahu, a B.Tech student in Computer Science & Engineering (AI & ML) at Maharana Pratap Institute of Professional Studies.",
      highlightWords: ['Anurag Sahu', 'Computer Science & Engineering (AI & ML)', 'Maharana Pratap Institute of Professional Studies']
    },
    {
      id: 'p2',
      text: 'I am passionate about building modern, scalable web applications and continuously improving my problem-solving skills.'
    },
    {
      id: 'p3',
      text: 'My current focus is Full-Stack Development, where I work with both frontend and backend technologies to create responsive, efficient, and user-centric solutions.',
      highlightWords: ['Full-Stack Development']
    },
    {
      id: 'p4',
      text: 'I enjoy learning new technologies, taking on challenging projects, and writing clean, maintainable code.'
    },
    {
      id: 'p5',
      text: "I'm actively seeking opportunities to contribute, grow as a developer, and deliver meaningful software that creates real-world impact."
    }
  ],
  chips: [
    { id: 'c1', label: '🎓 B.Tech CSE (AI & ML)', category: 'education' },
    { id: 'c2', label: '💻 Full-Stack Developer', category: 'role' },
    { id: 'c3', label: '⚡ React • Node.js', category: 'stack' },
    { id: 'c4', label: '🗄 MongoDB', category: 'db' },
    { id: 'c5', label: '🌐 REST APIs', category: 'api' },
    { id: 'c6', label: '🚀 Open to Internship Opportunities', category: 'status' }
  ],
  summaryCard: {
    name: SITE_CONFIG.name,
    education: 'B.Tech CSE (AI & ML)',
    college: SITE_CONFIG.institution,
    currentFocus: 'Full-Stack Development',
    status: 'Open for Internship',
    statusSymbol: '🟢'
  }
};
