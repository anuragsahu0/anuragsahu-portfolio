export const ChartContainer = ({ title, subtitle, action, children }) => {
  return (
    <div className="bg-[#070B16] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide font-mono uppercase">
            {title}
          </h2>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="pt-4 flex-1">{children}</div>
    </div>
  );
};
