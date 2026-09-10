import { Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export const RoadmapPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering Roadmap"
        description="Plan and publish upcoming learning tracks, development sprints, and feature rollouts."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Roadmap Item</span>
          </button>
        }
      />

      <EmptyState
        title="Roadmap Pipeline Ready"
        description="Manage active milestones, target completion dates, and project statuses for public display."
      />
    </div>
  );
};
