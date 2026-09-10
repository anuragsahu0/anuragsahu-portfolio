import { Save, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/FormField';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure portfolio SEO tags, telemetry toggles, and security policies."
        badge="Phase 0 Ready"
        actions={
          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm">
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        }
      />

      <div className="bg-[#070B16] border border-slate-800 rounded-xl p-6 space-y-6 max-w-3xl">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Security & Authentication</h2>
            <p className="text-xs text-slate-400">Environment variables and tokens are securely isolated.</p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField label="SITE TITLE" id="site-title">
            <input
              id="site-title"
              type="text"
              defaultValue="Anurag Sahu — Full-Stack Developer & AI/ML Engineer"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </FormField>

          <FormField label="META DESCRIPTION" id="meta-description">
            <textarea
              id="meta-description"
              rows={3}
              defaultValue="Portfolio of Anurag Sahu, Computer Science sophomore specializing in Full-Stack Web Development, React, Node.js, and Machine Learning."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
            />
          </FormField>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200 font-mono text-[11px] uppercase">
              Production Security Verification
            </p>
            <p>
              All sensitive credentials (MongoDB URIs, JWT Secret Keys, and SMTP parameters) are managed exclusively through serverless environment variables. Zero credentials exist in client source code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
