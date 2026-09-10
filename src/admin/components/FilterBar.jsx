export const FilterBar = ({ options, activeFilter, onSelect }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
      {options.map((option) => {
        const isActive = activeFilter === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'bg-[#070B16] text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
