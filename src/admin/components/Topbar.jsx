import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  Shield,
  Activity,
} from 'lucide-react';
import { useAdmin } from './AdminContext';

export const Topbar = () => {
  const { activeTab, setIsMobileMenuOpen, searchQuery, setSearchQuery, user } = useAdmin();

  const getBreadcrumb = () => {
    const map = {
      dashboard: 'Overview / System Telemetry',
      analytics: 'Analytics / Traffic & Engagement',
      profile: 'Content / Personal Profile',
      about: 'Content / Biography & Focus',
      projects: 'Content / Portfolio Projects',
      skills: 'Content / Technical Skills',
      experience: 'Content / Work Experience',
      education: 'Content / Academic Records',
      certificates: 'Content / Certifications',
      roadmap: 'Content / Engineering Roadmap',
      media: 'Media / Asset Library',
      messages: 'Communications / Contact Inquiries',
      settings: 'System / Configuration & Security',
    };
    return map[activeTab] || 'Control Center';
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
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>Anurag Sahu</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold uppercase">{activeTab}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-200 capitalize">
            {getBreadcrumb()}
          </h2>
        </div>
      </div>

      {/* Right: Search, Live Status, Public Link & Profile */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            aria-label="Search records"
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono"
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
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          aria-label="Notifications"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold font-mono">
          {user?.email ? user.email.charAt(0).toUpperCase() : <Shield className="w-3.5 h-3.5" />}
        </div>
      </div>
    </header>
  );
};
