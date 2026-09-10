import { Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export const ExperiencePage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Experience Management"
        description="Curate work history, internships, freelance positions, and leadership roles."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        }
      />

      <EmptyState
        title="No Experience Records Configured"
        description="The clean CMS experience management service is initialized and ready for Phase 01 data modeling."
      />
    </div>
  );
};
