export const PageHeader = ({ title, description, badge, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100 font-display">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
