import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { DataCard } from '../components/DataCard';
import { SearchInput } from '../components/SearchInput';
import { StatusBadge } from '../components/StatusBadge';
import { adminApi } from '../services/adminApi';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getProjects();
        setProjects(res.projects || []);
      } catch (_err) {
        // Phase 0 graceful fallback
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'title',
      header: 'Project Title',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-100">{val}</p>
          <p className="text-[11px] text-slate-400 font-mono">{row.subtitle}</p>
        </div>
      ),
    },
    {
      key: 'categoryLabel',
      header: 'Category',
      render: (val) => <span className="font-mono text-slate-300">{val || 'Full-Stack'}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (val) => <StatusBadge status={val !== false ? 'Active' : 'Draft'} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Management"
        description="Manage featured projects, tech stacks, repository URLs, and live demo links."
        badge="Phase 0 Ready"
        actions={
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        }
      />

      <div className="flex items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Filter projects by title or tech stack..."
        />
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={filteredProjects}
          isLoading={isLoading}
          emptyMessage="No project records configured yet. Connect to real project database in Phase 01."
        />
      </div>

      <div className="md:hidden space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-800 rounded-2xl bg-[#070B16] text-center text-xs text-slate-500">
            No project records found. Ready for CMS binding.
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <DataCard
              key={proj.id || proj._id}
              title={proj.title}
              subtitle={proj.subtitle}
              badge={<StatusBadge status="Active" />}
              fields={[
                { label: 'Category', value: proj.categoryLabel || 'Full-Stack' },
                { label: 'Tech Stack', value: proj.techStack?.slice(0, 3).join(', ') || '—' },
              ]}
            />
          ))
        )}
      </div>
    </div>
  );
};
