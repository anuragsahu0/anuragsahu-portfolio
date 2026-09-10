import { Save } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/FormField';

export const AboutPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About Section Content"
        description="Craft your biographical introduction, engineering philosophy, and personal story."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5" />
            <span>Publish Updates</span>
          </button>
        }
      />

      <div className="bg-[#070B16] border border-slate-800 rounded-xl p-6 space-y-4 max-w-3xl">
        <FormField label="PRIMARY HEADLINE" id="about-headline">
          <input
            id="about-headline"
            type="text"
            defaultValue="Engineering scalable full-stack applications and exploring machine learning architectures."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </FormField>

        <FormField label="BIOGRAPHY / INTRODUCTORY COPY" id="about-bio">
          <textarea
            id="about-bio"
            rows={6}
            defaultValue="I am a second-year B.Tech CSE (AI & ML) student passionate about engineering clean, performant web platforms. My core focus lies in React, Node.js, Express, and practical AI integrations."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
          />
        </FormField>
      </div>
    </div>
  );
};
