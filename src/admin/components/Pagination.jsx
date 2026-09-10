import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  onPageChange,
  itemsPerPage = 10,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
      <div>
        {totalItems ? (
          <span>
            Showing{' '}
            <strong className="text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-200">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </strong>{' '}
            of <strong className="text-slate-200">{totalItems}</strong> records
          </span>
        ) : (
          <span>
            Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
            <strong className="text-slate-200">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-[#070B16] text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-mono text-xs text-slate-200 bg-slate-900 border border-slate-800 rounded-lg">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-800 bg-[#070B16] text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
