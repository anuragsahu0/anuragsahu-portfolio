import {
  LayoutDashboard,
  BarChart3,
  Layers,
  User,
  FileText,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  GitBranch,
  Image,
  Mail,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from './AdminContext';

const iconMap = {
  LayoutDashboard,
  BarChart3,
  Layers,
  Image,
  Mail,
  Settings,
};

const contentIcons = {
  profile: User,
  about: FileText,
  projects: Briefcase,
  skills: Code2,
  experience: Briefcase,
  education: GraduationCap,
  certificates: Award,
  roadmap: GitBranch,
};

export const Sidebar = () => {
  const { activeTab, setActiveTab, onLogout, user } = useAdmin();
  const [contentExpanded, setContentExpanded] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  ];

  const contentSubItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'roadmap', label: 'Roadmap' },
  ];

  const bottomNavItems = [
    { id: 'media', label: 'Media Library', icon: 'Image' },
    { id: 'messages', label: 'Messages', icon: 'Mail' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#070B16] select-none h-screen sticky top-0"
      aria-label="Admin Navigation Sidebar"
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm shadow-sm">
            AS
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wider uppercase text-slate-100 font-mono leading-none">
              ANURAG SAHU
            </h1>
            <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mt-0.5">
              Control Center
            </p>
          </div>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Content Management Group */}
        <div className="pt-2">
          <button
            onClick={() => setContentExpanded(!contentExpanded)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Content</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                contentExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {contentExpanded && (
            <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-0.5">
              {contentSubItems.map((sub) => {
                const SubIcon = contentIcons[sub.id] || FileText;
                const isSubActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveTab(sub.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md font-medium text-[11px] transition-colors ${
                      isSubActive
                        ? 'text-cyan-300 bg-cyan-500/10 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <SubIcon className={`w-3 h-3 ${isSubActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Operational Modules */}
        <div className="pt-2 space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = iconMap[item.icon] || Settings;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-[#050811]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.email ? user.email.split('@')[0] : 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">Verified Admin</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out of Control Center"
            aria-label="Logout"
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
