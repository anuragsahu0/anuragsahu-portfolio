import {
  LayoutDashboard,
  Mail,
  Briefcase,
  Menu,
  X,
  BarChart3,
  User,
  FileText,
  Code2,
  GraduationCap,
  Award,
  GitBranch,
  Image,
  Settings,
  LogOut,
  Star,
  Globe,
  FileCheck,
  Share2,
  Navigation as NavIcon,
  Bell,
  History,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from './AdminContext';

export const MobileNavigation = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, onLogout, user } = useAdmin();

  const primaryDockItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code2 },
  ];

  const drawerSections = [
    {
      title: 'Core Modules',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Content Modules',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'about', label: 'About', icon: FileText },
        { id: 'hero', label: 'Hero Section', icon: Star },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'skills', label: 'Skills', icon: Code2 },
        { id: 'experience', label: 'Experience', icon: Layers },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'roadmap', label: 'Roadmap', icon: GitBranch },
      ],
    },
    {
      title: 'Site Configuration',
      items: [
        { id: 'navigation', label: 'Navigation', icon: NavIcon },
        { id: 'social-links', label: 'Social Links', icon: Share2 },
        { id: 'resume', label: 'Resume', icon: FileCheck },
        { id: 'seo', label: 'SEO & Meta', icon: Globe },
      ],
    },
    {
      title: 'Operations & Telemetry',
      items: [
        { id: 'media', label: 'Media Library', icon: Image },
        { id: 'messages', label: 'Messages', icon: Mail },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'activity', label: 'Activity Log', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ─── Mobile Bottom Navigation Dock (Fluid & Touch-Optimized) ─── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070B16]/95 backdrop-blur-lg border-t border-slate-800/90 px-3 py-2 flex items-center justify-around select-none safe-area-pb"
        aria-label="Mobile Bottom Navigation"
      >
        {primaryDockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors min-w-[56px] ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More / Menu Drawer Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors min-w-[56px] ${
            isMobileMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Open Full Menu"
        >
          <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      {/* ─── Slide-over Drawer for All Admin Modules ─── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <div className="relative ml-auto w-full max-w-xs bg-[#070B16] border-l border-slate-800 h-full flex flex-col z-10 shadow-2xl">
            {/* Drawer Header */}
            <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                  AS
                </div>
                <span className="text-xs font-bold font-mono tracking-wider text-slate-100 uppercase">
                  CONTROL CENTER
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {drawerSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <p className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                          isActive
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold'
                            : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/40'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}

              <div className="pt-3 border-t border-slate-800/80">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>View Public Website</span>
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#050811]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {user?.email || 'admin@anuragsahu.dev'}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-mono">Authenticated Owner</p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
