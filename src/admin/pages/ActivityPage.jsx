import { Activity } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export const ActivityPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit & Activity Log"
        description="Immutable administrative action history and authentication records."
        badge="Audit Ready"
      />

      <EmptyState
        icon={Activity}
        title="No Activity Recorded"
        description="Administrative audit logging will begin recording events upon full CMS activation."
      />
    </div>
  );
};
