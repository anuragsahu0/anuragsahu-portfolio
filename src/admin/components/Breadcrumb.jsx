import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 select-none" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
            {isLast ? (
              <span className="text-cyan-400 font-semibold uppercase tracking-wider">
                {item.label}
              </span>
            ) : (
              <span className="text-slate-400 hover:text-slate-200 transition-colors">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};
