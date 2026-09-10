import { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { FormField } from '../components/FormField';

export const AdminLoginPage = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !password) {
      setValidationError('Please provide both your administrator email and password.');
      return;
    }

    onLogin(email.trim(), password, remember);
  };

  return (
    <div className="min-h-screen bg-[#05070E] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      {/* Background Accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 font-mono uppercase">
            ANURAG SAHU
          </h1>
          <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase mt-1">
            CONTROL CENTER
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Secure administrative console for managing portfolio content.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#070B16] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {(error || validationError) && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{validationError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="ADMIN EMAIL" id="admin-email" required>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@anuragsahu.com"
                  autoComplete="email"
                  required
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 font-mono transition-colors"
                />
              </div>
            </FormField>

            <FormField label="MASTER PASSWORD" id="admin-password" required>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 font-mono transition-colors"
                />
              </div>
            </FormField>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50"
                />
                <span>Remember session</span>
              </label>

              <span className="text-slate-400 font-mono text-[11px]">Protected by JWT</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Control Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Safety Note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
            >
              ← Back to Public Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
