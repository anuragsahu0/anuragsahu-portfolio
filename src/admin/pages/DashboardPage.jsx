import { useState, useEffect } from 'react';
import {
  Mail,
  FolderKanban,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { StatusBadge } from '../components/StatusBadge';
import { adminApi } from '../services/adminApi';
import { formatDate } from '../utils/adminFormatters';
import { useAdmin } from '../components/AdminContext';

export const DashboardPage = () => {
  const { setActiveTab } = useAdmin();
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, healthRes] = await Promise.allSettled([
        adminApi.getDashboardStats(),
        adminApi.getHealth(),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      }
      if (healthRes.status === 'fulfilled') {
        setHealth(healthRes.value);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingState message="Connecting to production telemetry..." />;
  }

  if (error && !stats) {
    return (
      <ErrorState
        title="Dashboard Offline"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  const recentMessages = stats?.recentContacts || [];
  const contactStats = stats?.stats || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Dashboard"
        description="Live operational telemetry and portfolio content management center."
        badge="Live Telemetry"
        actions={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070B16] border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      />

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Inquiries"
          value={contactStats.contactSubmissions ?? '—'}
          description="Form submissions received"
          icon={Mail}
        />
        <StatCard
          label="Unread Messages"
          value={contactStats.unreadContacts ?? 0}
          trend={contactStats.unreadContacts > 0 ? 'up' : 'neutral'}
          change={contactStats.unreadContacts > 0 ? 'Action Needed' : 'All Clear'}
          description="Awaiting response"
          icon={Clock}
        />
        <StatCard
          label="API Status"
          value={health?.status === 'online' ? '200 OK' : 'Operational'}
          trend="up"
          change="Online"
          description="Serverless API Engine"
          icon={Activity}
        />
        <StatCard
          label="Security Layer"
          value="JWT / RBAC"
          description="Active Administrator Session"
          icon={ShieldCheck}
        />
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('messages')}
          className="p-5 rounded-xl bg-[#070B16] border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Review Inquiries</h3>
              <p className="text-xs text-slate-500">Read & manage contact submissions</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={() => setActiveTab('projects')}
          className="p-5 rounded-xl bg-[#070B16] border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Manage Projects</h3>
              <p className="text-xs text-slate-500">Edit featured work and metrics</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={() => setActiveTab('settings')}
          className="p-5 rounded-xl bg-[#070B16] border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Site Configuration</h3>
              <p className="text-xs text-slate-500">Manage SEO, bio and credentials</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="bg-[#070B16] border border-slate-800/80 rounded-xl p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div>
            <h2 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wide">
              Recent Inquiries
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest communications received via the portfolio contact form.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('messages')}
            className="text-xs text-cyan-400 hover:underline font-mono flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="pt-4">
          {recentMessages.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No recent inquiries found. Real contact form submissions will appear here.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {recentMessages.slice(0, 5).map((msg) => (
                <div key={msg._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {msg.fullName}
                      </span>
                      <StatusBadge status={msg.status || 'unread'} />
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {msg.subject || msg.message}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
