import React from 'react';
import DataTable from './DataTable';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-2xs ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            {headers.map((h, index) => (
              <th key={index} className="py-3.5 px-4 sm:px-6">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '' }) => {
  return (
    <tr className={`hover:bg-slate-50/60 transition-colors ${className}`}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '', align = 'left' }) => {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <td className={`py-4 px-4 sm:px-6 text-slate-700 font-medium ${alignClass} ${className}`}>
      {children}
    </td>
  );
};

export { DataTable };
export default Table;
