export const LoadingState = ({ message = 'Loading records...' }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      <p className="text-xs font-mono text-slate-400">{message}</p>
    </div>
  );
};
