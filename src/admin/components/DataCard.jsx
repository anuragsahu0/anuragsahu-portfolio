export const DataCard = ({ title, subtitle, badge, fields = [], actions, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#070B16] border border-slate-800/80 rounded-xl p-4 transition-all ${
        onClick ? 'cursor-pointer hover:border-cyan-500/30' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/60">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {badge}
      </div>

      {fields.length > 0 && (
        <div className="py-3 space-y-2 text-xs">
          {fields.map((field, idx) => (
            <div key={idx} className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-mono text-[11px]">{field.label}:</span>
              <span className="font-medium text-right">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      {actions && (
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};
