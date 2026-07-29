import React from 'react';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your request.',
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <SkeletonLoader type="table" count={5} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xs ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className={`py-3.5 px-4 sm:px-6 ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/90">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-slate-50/70 transition-colors">
              {columns.map((col, colIndex) => (
                <td
                  key={col.key || colIndex}
                  className={`py-4 px-4 sm:px-6 text-slate-700 font-medium ${col.className || ''}`}
                >
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
