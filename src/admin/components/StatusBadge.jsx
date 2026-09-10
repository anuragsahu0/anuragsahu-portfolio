export const StatusBadge = ({ status, variant }) => {
  const getBadgeConfig = () => {
    switch (variant || status?.toLowerCase()) {
      case 'active':
      case 'online':
      case 'working':
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'unread':
      case 'pending':
      case 'coming soon':
      case 'in progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'error':
      case 'failed':
      case 'offline':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'read':
      case 'archived':
      case 'draft':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700/60';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${getBadgeConfig()}`}
    >
      {status}
    </span>
  );
};
