import { Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export const MediaPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Store and optimize portfolio images, project previews, screenshots, and resumes."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </button>
        }
      />

      <EmptyState
        title="Media Storage Ready"
        description="Local assets and cloud storage adapters will be configured for real file uploads in Phase 01."
      />
    </div>
  );
};
