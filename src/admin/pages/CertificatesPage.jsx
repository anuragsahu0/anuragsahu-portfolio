import { Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export const CertificatesPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Certifications & Badges"
        description="Verify and display industry credentials, platform certifications, and achievement awards."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certificate</span>
          </button>
        }
      />

      <EmptyState
        title="No Certificates Registered"
        description="Add official credential URLs, verification IDs, and issuer logos in Phase 01."
      />
    </div>
  );
};
