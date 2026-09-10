import { Menu, ExternalLink, Activity } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { Breadcrumb } from './Breadcrumb';
import { Search } from './Search';
import { NotificationButton } from './NotificationButton';
import { AdminProfile } from './AdminProfile';

export const Topbar = () => {
  const { activeTab, setIsMobileMenuOpen, searchQuery, setSearchQuery, user, onLogout } = useAdmin();

  const getBreadcrumbItems = () => {
    const map = {
      dashboard: [{ label: 'Overview' }, { label: 'Telemetry' }],
      analytics: [{ label: 'Analytics' }, { label: 'Traffic' }],
      profile: [{ label: 'Content' }, { label: 'Profile' }],
      about: [{ label: 'Content' }, { label: 'About' }],
      projects: [{ label: 'Content' }, { label: 'Projects' }],
      skills: [{ label: 'Content' }, { label: 'Skills' }],
      experience: [{ label: 'Content' }, { label: 'Experience' }],
      education: [{ label: 'Content' }, { label: 'Education' }],
      certificates: [{ label: 'Content' }, { label: 'Certificates' }],
      roadmap: [{ label: 'Content' }, { label: 'Roadmap' }],
      media: [{ label: 'Assets' }, { label: 'Media Library' }],
      messages: [{ label: 'Inbox' }, { label: 'Inquiries' }],
      settings: [{ label: 'System' }, { label: 'Settings' }],
      notifications: [{ label: 'System' }, { label: 'Notifications' }],
      activity: [{ label: 'System' }, { label: 'Audit Log' }],
    };
    return [{ label: 'Anurag Sahu' }, ...(map[activeTab] || [{ label: activeTab }])];
  };

  return (
    <header
      className="h-16 border-b border-slate-800/80 bg-[#070B16]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none"
      aria-label="Admin Control Center Topbar"
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <Breadcrumb items={getBreadcrumbItems()} />
          <h2 className="text-xs sm:text-sm font-semibold text-slate-200 capitalize mt-0.5">
            {activeTab} Management Console
          </h2>
        </div>
      </div>

      {/* Right: Search, Live Status, Public Link & Profile */}
      <div className="flex items-center gap-3">
        {/* Search Bar with Shortcut */}
        <div className="hidden md:block">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search console..."
          />
        </div>

        {/* Live Health Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
          <Activity className="w-3 h-3 animate-pulse" />
          <span className="font-semibold">API HEALTH: 200 OK</span>
        </div>

        {/* View Public Website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 text-xs font-medium transition-colors"
          title="Open Live Portfolio"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Notification Bell */}
        <NotificationButton unreadCount={0} />

        {/* User Avatar & Dropdown */}
        <AdminProfile user={user} onLogout={onLogout} />
      </div>
    </header>
  );
};
