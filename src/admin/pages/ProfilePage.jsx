import { Save } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/FormField';
import { useAdmin } from '../components/AdminContext';

export const ProfilePage = () => {
  const { user } = useAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Profile"
        description="Configure public display name, primary email, location, and social links."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        }
      />

      <div className="bg-[#070B16] border border-slate-800 rounded-xl p-6 space-y-6 max-w-3xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xl font-bold">
            AS
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Anurag Sahu</h2>
            <p className="text-xs text-slate-400">Computer Science Sophomore (AI & ML)</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Candidate
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="FULL NAME" id="profile-name">
            <input
              id="profile-name"
              type="text"
              defaultValue="Anurag Sahu"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </FormField>

          <FormField label="PRIMARY EMAIL" id="profile-email">
            <input
              id="profile-email"
              type="email"
              defaultValue={user?.email || 'shivasahu0612@gmail.com'}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </FormField>

          <FormField label="GITHUB PROFILE" id="profile-github">
            <input
              id="profile-github"
              type="url"
              defaultValue="https://github.com/anuragsahu0"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </FormField>

          <FormField label="LINKEDIN PROFILE" id="profile-linkedin">
            <input
              id="profile-linkedin"
              type="url"
              defaultValue="https://linkedin.com/in/anuragsahu0"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
};
