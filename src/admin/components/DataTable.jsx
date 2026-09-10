import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';

export const DataTable = ({
  columns,
  data,
  isLoading,
  emptyMessage = 'No records found.',
  keyField = 'id',
  onRowClick,
}) => {
  if (isLoading) {
    return <LoadingState message="Fetching data..." />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No Records" description={emptyMessage} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-[#070B16]">
      <table className="w-full text-left text-xs text-slate-300 border-collapse">
        <thead className="bg-[#050811] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className={`py-3.5 px-4 font-semibold ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {data.map((row, rowIndex) => (
            <tr
              key={row[keyField] || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-slate-800/30 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className={`py-3 px-4 ${col.cellClassName || ''}`}>
                  {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
