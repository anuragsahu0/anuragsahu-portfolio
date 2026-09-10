import { Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export const EducationPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Credentials"
        description="Manage university degree coursework, GPA, institution information, and academic milestones."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        }
      />

      <EmptyState
        title="Academic Records Interface Ready"
        description="Connect your degree milestones and coursework modules to the public site via this console."
      />
    </div>
  );
};
