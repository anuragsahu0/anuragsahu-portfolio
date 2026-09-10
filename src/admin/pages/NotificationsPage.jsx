import { Bell, CheckCheck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="System alerts, security notifications, and incoming contact warnings."
        badge="Zero Pending"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070B16] border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium transition-colors">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All As Read</span>
          </button>
        }
      />

      <EmptyState
        icon={Bell}
        title="No New Notifications"
        description="All system operations and background handlers are currently operating normally."
      />
    </div>
  );
};
