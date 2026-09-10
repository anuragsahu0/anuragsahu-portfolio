/**
 * ANURAG SAHU CONTROL CENTER — Type Definitions & Data Schemas
 * Clean schema models defining portfolio content contracts.
 */

export const ADMIN_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  VIEWER: 'viewer',
};

export const CONTENT_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin/dashboard' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', path: '/admin/analytics' },
  {
    id: 'content',
    label: 'Content',
    icon: 'Layers',
    children: [
      { id: 'profile', label: 'Profile', path: '/admin/profile' },
      { id: 'about', label: 'About', path: '/admin/about' },
      { id: 'projects', label: 'Projects', path: '/admin/projects' },
      { id: 'skills', label: 'Skills', path: '/admin/skills' },
      { id: 'experience', label: 'Experience', path: '/admin/experience' },
      { id: 'education', label: 'Education', path: '/admin/education' },
      { id: 'certificates', label: 'Certificates', path: '/admin/certificates' },
      { id: 'roadmap', label: 'Roadmap', path: '/admin/roadmap' },
    ],
  },
  { id: 'media', label: 'Media Library', icon: 'Image', path: '/admin/media' },
  { id: 'messages', label: 'Messages', icon: 'Mail', path: '/admin/messages' },
  { id: 'settings', label: 'Settings', icon: 'Settings', path: '/admin/settings' },
];

export const MESSAGE_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  ARCHIVED: 'archived',
};

export const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'fullstack', label: 'Full-Stack' },
  { value: 'aiml', label: 'AI & Machine Learning' },
  { value: 'systems', label: 'Systems & Backend' },
  { value: 'research', label: 'Research & Labs' },
];
