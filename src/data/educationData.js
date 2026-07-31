/**
 * Centralized Education & Growth Journey Data Store
 * Data-driven schema storing academic timeline, coursework, certifications, achievements, and roadmap.
 */

export const EDUCATION_HISTORY = [
  {
    id: 'btech-cse-aiml',
    institution: 'Maharana Pratap Institute of Professional Studies',
    degree: 'B.Tech in Computer Science & Engineering (AI & ML)',
    duration: '2024 — 2028 (Expected)',
    currentStatus: 'Second Year Student (CGPA: 9.2 / 10.0)',
    location: 'India',
    relevantCoursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (C++)',
      'Database Management Systems',
      'Operating Systems & System Logic',
      'Linear Algebra & Applied ML'
    ],
    highlights: [
      'Ranked top 5% in academic coursework',
      'Lead Student Coordinator for Tech & AI Student Chapter',
      'Organized college-level hackathons and coding contests'
    ]
  },
  {
    id: 'senior-secondary',
    institution: 'Higher Secondary Education (CBSE / State Board)',
    degree: 'Senior Secondary Schooling (Class XII - PCM)',
    duration: '2022 — 2024',
    currentStatus: 'Completed with Distinction',
    location: 'India',
    relevantCoursework: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science (Python)'],
    highlights: [
      'Scored 90%+ in Mathematics & Computer Science',
      'Built first Python automation scripts in high school'
    ]
  }
];

export const RELEVANT_COURSEWORK = [
  {
    id: 'dsa',
    code: 'CS201',
    title: 'Data Structures & Algorithms',
    status: 'Completed',
    importance: 'Fundamental for writing time-efficient code and passing technical coding assessments.'
  },
  {
    id: 'oop',
    code: 'CS202',
    title: 'Object-Oriented Programming (C++)',
    status: 'Completed',
    importance: 'Teaches modular class design, inheritance, polymorphism, and memory encapsulation.'
  },
  {
    id: 'dbms',
    code: 'CS203',
    title: 'Database Management Systems',
    status: 'Current Semester',
    importance: 'Essential for designing normalized SQL schemas, ACID transactions, and indexed queries.'
  },
  {
    id: 'os',
    code: 'CS204',
    title: 'Operating Systems',
    status: 'Current Semester',
    importance: 'Explains process scheduling, multithreading synchronization, and memory management.'
  },
  {
    id: 'cn',
    code: 'CS301',
    title: 'Computer Networks',
    status: 'Upcoming',
    importance: 'Critical for understanding HTTP/HTTPS protocols, TCP/IP sockets, and REST API routing.'
  },
  {
    id: 'aiml-fundamentals',
    code: 'AI201',
    title: 'Artificial Intelligence & Machine Learning',
    status: 'Current Semester',
    importance: 'Covers linear regression, decision trees, gradient descent, and PyTorch tensor basics.'
  }
];

export const CERTIFICATIONS_DATA = [
  {
    id: 'cert-python',
    title: 'Python for Data Science & AI',
    platform: 'Coursera / IBM',
    status: 'Completed',
    date: '2025',
    credentialUrl: 'https://coursera.org/verify/credential-placeholder'
  },
  {
    id: 'cert-fullstack',
    title: 'Full-Stack Web Engineering',
    platform: 'freeCodeCamp / Udemy',
    status: 'Completed',
    date: '2025',
    credentialUrl: 'https://freecodecamp.org/certification/placeholder'
  },
  {
    id: 'cert-pytorch',
    title: 'Deep Learning with PyTorch',
    platform: 'Udacity / DeepLearning.AI',
    status: 'In Progress',
    date: 'Expected Q2 2026',
    credentialUrl: '#'
  }
];

export const ACHIEVEMENTS_DATA = [
  {
    id: 'ach-hackathon',
    category: 'Hackathons',
    title: 'National Student AI Hackathon Top Finalist',
    date: '2025',
    desc: 'Built an interactive AI hyperparameter tuning interface using FastAPI and React.'
  },
  {
    id: 'ach-academic',
    category: 'Academic Honor',
    title: 'Consistent Academic Distinction (CGPA: 9.2/10.0)',
    date: '2024 — Present',
    desc: 'Maintained top academic standing in Computer Science & AI coursework.'
  },
  {
    id: 'ach-coding',
    category: 'Coding Contests',
    title: '150+ DSA Problems Solved across LeetCode & GFG',
    date: '2025 — Present',
    desc: 'Practiced array, string, dynamic programming, and graph algorithms.'
  }
];

export const EDUCATION_ROADMAP = [
  { topic: 'System Design Basics', desc: 'Learning load balancers, caching strategies (Redis), and stateless API nodes.', status: 'ACTIVE STUDY' },
  { topic: 'Docker Containerization', desc: 'Containerizing Node.js & Python FastAPI microservices with docker-compose.', status: 'PRACTICING' },
  { topic: 'Cloud Fundamentals (AWS)', desc: 'Exploring EC2 instances, S3 object buckets, and Vercel serverless functions.', status: 'EXPLORING' },
  { topic: 'CI/CD Pipelines', desc: 'Configuring GitHub Actions for automated linting, testing, and deployment.', status: 'NEXT UP' }
];

export const CURRENT_FOCUS_DATA = [
  'Building production-ready full-stack React & Node.js web applications',
  'Preparing for Summer 2026 Software Engineering & AI/ML Internships',
  'Strengthening Data Structures & Algorithms problem-solving in C++',
  'Exploring PyTorch deep learning models & FastAPI deployment endpoints'
];

export const FUTURE_GOALS_DATA = {
  shortTerm: [
    'Secure a Summer 2026 Software Engineering or AI/ML Internship.',
    'Build 3 major full-stack open-source web applications.',
    'Solve 250+ Data Structures & Algorithms problems.'
  ],
  longTerm: [
    'Grow into a skilled Full-Stack & AI Software Engineer.',
    'Architect scalable, intelligent web applications that serve real users.',
    'Contribute meaningfully to AI & web developer open-source tools.'
  ]
};
