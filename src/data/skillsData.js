/**
 * ANTI GRAVITY — Complete Data Store for Skills Laboratory & Technical Telemetry
 * Data-driven architecture for candidate skills, proficiency levels, and category filters.
 */

export const SKILL_CATEGORIES = [
  { id: 'all', label: 'All Stack' },
  { id: 'frontend', label: 'Frontend Web' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'aiml', label: 'AI & Machine Learning' },
  { id: 'databases', label: 'Databases & Storage' },
  { id: 'languages', label: 'Core Languages' },
  { id: 'tools', label: 'DevOps & Tools' },
];

export const SKILLS_DATA = [
  // 1. FRONTEND WEB
  {
    id: 'react',
    name: 'React.js 18',
    category: 'frontend',
    status: 'Building Projects With', // 'Building Projects With' | 'Learning' | 'Explored'
    proficiency: 92,
    icon: 'Atom',
    practicalUsage: 'Used in Portfolio, interactive AI sandbox tools, and dynamic dashboards.',
    highlights: ['Custom Hooks & Context API', 'Framer Motion Animations', 'Component Architecture', 'Performance Optimization'],
    levelLabel: 'Advanced Student Level'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    status: 'Building Projects With',
    proficiency: 95,
    icon: 'Palette',
    practicalUsage: 'Designed obsidian glassmorphism design tokens and dynamic responsive layouts.',
    highlights: ['Custom Utility Classes', 'Responsive Grid Systems', 'Dark Theme Tokens', 'Glassmorphism Effects'],
    levelLabel: 'Advanced Student Level'
  },
  {
    id: 'javascript-es6',
    name: 'JavaScript (ES6+)',
    category: 'frontend',
    status: 'Building Projects With',
    proficiency: 90,
    icon: 'Code2',
    practicalUsage: 'Asynchronous event loops, DOM manipulation, state management, and modern ESNext features.',
    highlights: ['Async/Await & Promises', 'ES6 Modules & Closures', 'DOM Manipulation', 'Event Loop Concepts'],
    levelLabel: 'Advanced Student Level'
  },

  // 2. BACKEND & APIS
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    status: 'Building Projects With',
    proficiency: 86,
    icon: 'Server',
    practicalUsage: 'Built REST API gateways, event-driven web servers, and asynchronous middleware pipelines.',
    highlights: ['Express Middleware', 'REST API Architecture', 'JWT Authentication', 'Asynchronous I/O'],
    levelLabel: 'Intermediate Student Level'
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'backend',
    status: 'Building Projects With',
    proficiency: 88,
    icon: 'Cpu',
    practicalUsage: 'Developed backend API endpoints for portfolio contact submissions and telemetry analytics.',
    highlights: ['Custom Route Handlers', 'Input Validation', 'Error Handling', 'CORS & Security Headers'],
    levelLabel: 'Intermediate Student Level'
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    status: 'Building Projects With',
    proficiency: 82,
    icon: 'Zap',
    practicalUsage: 'High-performance Python web framework for GNN inference models and real-time streaming APIs.',
    highlights: ['Pydantic Schemas', 'Asynchronous Endpoints', 'WebSocket Streaming', 'Automatic OpenAPI Docs'],
    levelLabel: 'Intermediate Student Level'
  },

  // 3. AI & MACHINE LEARNING
  {
    id: 'pytorch',
    name: 'PyTorch',
    category: 'aiml',
    status: 'Building Projects With',
    proficiency: 80,
    icon: 'Bot',
    practicalUsage: 'Built Graph Neural Networks (GNNs), tensor operations, and model loss optimization curves.',
    highlights: ['Custom Neural Layers', 'Tensor Manipulations', 'Graph Neural Networks (GNN)', 'Model Evaluation'],
    levelLabel: 'Academic Focus'
  },
  {
    id: 'python-ml',
    name: 'Python (NumPy / SciPy)',
    category: 'aiml',
    status: 'Building Projects With',
    proficiency: 88,
    icon: 'Terminal',
    practicalUsage: 'Data preprocessing, matrix operations, physics RK4 integration, and data science scripts.',
    highlights: ['NumPy Vectorization', 'Pandas Analysis', 'Matplotlib Visualization', 'Scientific Computing'],
    levelLabel: 'Academic Focus'
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-Learn',
    category: 'aiml',
    status: 'Learning',
    proficiency: 75,
    icon: 'Sparkles',
    practicalUsage: 'Applied linear regression, decision trees, random forests, and feature scaling techniques.',
    highlights: ['Model Training', 'Feature Extraction', 'Cross-Validation', 'Evaluation Metrics'],
    levelLabel: 'Active Coursework'
  },

  // 4. DATABASES & STORAGE
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'databases',
    status: 'Building Projects With',
    proficiency: 84,
    icon: 'Database',
    practicalUsage: 'Relational database schema modeling, indexing, foreign keys, and SQL query optimization.',
    highlights: ['Relational Schema Design', 'SQL Queries & Joins', 'Indexing Strategies', 'ACID Transactions'],
    levelLabel: 'Intermediate Student Level'
  },
  {
    id: 'mongodb',
    name: 'MongoDB / Mongoose',
    category: 'databases',
    status: 'Building Projects With',
    proficiency: 85,
    icon: 'FileCode',
    practicalUsage: 'NoSQL document storage for contact messages, telemetry tracking, and unstructured JSON logs.',
    highlights: ['Document Modeling', 'Aggregation Pipeline', 'Mongoose Schemas', 'CRUD Operations'],
    levelLabel: 'Intermediate Student Level'
  },

  // 5. CORE LANGUAGES
  {
    id: 'cpp',
    name: 'C++',
    category: 'languages',
    status: 'Building Projects With',
    proficiency: 85,
    icon: 'Terminal',
    practicalUsage: 'Used in Object-Oriented Programming coursework, DSA problem solving, and low-latency systems.',
    highlights: ['OOP & Encapsulation', 'Pointers & Memory Control', 'STL Algorithms & Vectors', 'Class Polymorphism'],
    levelLabel: 'Core CS Foundation'
  },

  // 6. DEVOPS & TOOLS
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'tools',
    status: 'Building Projects With',
    proficiency: 90,
    icon: 'GitBranch',
    practicalUsage: 'Version control, feature branching, pull request reviews, and GitHub Actions CI/CD workflows.',
    highlights: ['Branching Strategies', 'PR Workflows', 'Commit History Hygiene', 'GitHub Actions Basics'],
    levelLabel: 'Daily Engineering Standard'
  },
  {
    id: 'docker',
    name: 'Docker Containerization',
    category: 'tools',
    status: 'Learning',
    proficiency: 72,
    icon: 'Box',
    practicalUsage: 'Containerized multi-stage Docker builds for Vite React frontend and Express Node.js backend.',
    highlights: ['Multi-Stage Dockerfiles', 'Container Networking', 'Environment Configuration', 'Image Optimization'],
    levelLabel: 'Active Skill Expansion'
  }
];

export const LAB_PHILOSOPHY = [
  {
    title: 'Theory Reinforced by Practice',
    description: 'Academic concepts from Operating Systems, Algorithms, and ML coursework are applied directly in real software projects.'
  },
  {
    title: 'Modern Tooling Standards',
    description: 'Embracing production-grade tools like React 18, PyTorch, Node.js, and Docker rather than outdated academic frameworks.'
  },
  {
    title: 'Continuous Skill Expansion',
    description: 'Realistic status tracking distinguishes core capabilities from active learning areas.'
  }
];
