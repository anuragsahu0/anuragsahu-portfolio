import React from 'react';
import { TimelineItem } from './TimelineItem';
import { Code, Globe, Server, Cpu, Rocket } from 'lucide-react';

/**
 * Timeline Component (Refined Evergreen Milestones)
 * Milestone-based growth journey without rigid calendar years or exaggerated claims.
 */
export const Timeline = () => {
  const milestones = [
    {
      stage: 'STAGE 01',
      title: 'Programming & Logic Foundations',
      badge: 'CORE BASICS',
      description: 'Started programming with C++, focusing on data structures, object-oriented concepts, and core algorithmic logic.',
      icon: Code,
    },
    {
      stage: 'STAGE 02',
      title: 'Web Development & UI Fundamentals',
      badge: 'FRONTEND DEVELOPMENT',
      description: 'Learned HTML5, CSS3, JavaScript (ES6+), and React. Focused on building responsive and accessible user interfaces.',
      icon: Globe,
    },
    {
      stage: 'STAGE 03',
      title: 'Full-Stack Web Engineering',
      badge: 'FULL-STACK SWE',
      description: 'Gained experience with Node.js, Express, and databases (PostgreSQL, MongoDB) to build end-to-end web applications with API routing.',
      icon: Server,
    },
    {
      stage: 'STAGE 04',
      title: 'Applied AI & Machine Learning',
      badge: 'SPECIALIZATION',
      description: 'Exploring machine learning concepts in Python with PyTorch and Scikit-Learn alongside linear algebra coursework.',
      icon: Cpu,
    },
    {
      stage: 'STAGE 05',
      title: 'Project Building & Internship Preparation',
      badge: 'CURRENT FOCUS',
      description: 'Building practical projects like ANTI GRAVITY to apply computer science concepts and prepare for software engineering internships.',
      icon: Rocket,
    },
  ];

  return (
    <div className="relative max-w-2xl mx-auto pt-2">
      {milestones.map((item, idx) => (
        <TimelineItem
          key={idx}
          year={item.stage}
          title={item.title}
          badge={item.badge}
          description={item.description}
          icon={item.icon}
          isLast={idx === milestones.length - 1}
        />
      ))}
    </div>
  );
};
