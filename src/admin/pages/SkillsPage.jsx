import { useState, useEffect } from 'react';
import { Plus, Code2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { DataCard } from '../components/DataCard';
import { StatusBadge } from '../components/StatusBadge';
import { adminApi } from '../services/adminApi';

export const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getSkills();
        setSkills(res.skills || []);
      } catch (_err) {
        setSkills([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const columns = [
    {
      key: 'name',
      header: 'Skill / Technology',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-100">{val}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Domain',
      render: (val) => (
        <span className="font-mono text-slate-400 uppercase text-[10px]">{val}</span>
      ),
    },
    {
      key: 'proficiency',
      header: 'Proficiency',
      render: (val) => (
        <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${val || 75}%` }} />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val || 'Active'} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Matrix"
        description="Organize technical proficiencies, frameworks, languages, and competency categories."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        }
      />

      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={skills}
          isLoading={isLoading}
          emptyMessage="No skill records loaded yet. Ready for CMS binding in Phase 01."
        />
      </div>

      <div className="md:hidden space-y-3">
        {skills.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-800 rounded-2xl bg-[#070B16] text-center text-xs text-slate-500">
            No skill records loaded. Ready for Phase 01 CMS.
          </div>
        ) : (
          skills.map((s) => (
            <DataCard
              key={s.id || s._id}
              title={s.name}
              subtitle={s.category}
              badge={<StatusBadge status={s.status || 'Active'} />}
              fields={[{ label: 'Proficiency', value: `${s.proficiency || 80}%` }]}
            />
          ))
        )}
      </div>
    </div>
  );
};
