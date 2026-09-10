import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({ label, value, change, trend = 'neutral', icon: Icon, description }) => {
  const getTrendBadge = () => {
    if (trend === 'up') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded">
          <TrendingDown className="w-3 h-3" />
          {change}
        </span>
      );
    }
    if (change) {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
          <Minus className="w-3 h-3" />
          {change}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#070B16] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 tracking-tight">
          {value}
        </span>
        {getTrendBadge()}
      </div>

      {description && (
        <p className="text-[11px] text-slate-400 mt-2">
          {description}
        </p>
      )}
    </div>
  );
};
