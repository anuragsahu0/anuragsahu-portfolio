import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAdmin } from './AdminContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useAdmin();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-16 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-xl text-xs backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
                : isError
                ? 'bg-rose-950/90 border-rose-500/30 text-rose-200'
                : 'bg-slate-900/90 border-cyan-500/30 text-cyan-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Icon
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isSuccess ? 'text-emerald-400' : isError ? 'text-rose-400' : 'text-cyan-400'
                }`}
              />
              <p className="font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 rounded text-slate-400 hover:text-slate-200"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
