import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Failed to Load Content',
  message = 'An unexpected error occurred while communicating with the API.',
  onRetry,
}) => {
  return (
    <div className="p-8 border border-rose-900/40 rounded-2xl bg-rose-950/20 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-200">{title}</h3>
      <p className="text-xs text-rose-300/80 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
