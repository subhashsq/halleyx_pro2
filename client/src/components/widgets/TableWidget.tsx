import { useMemo, useState } from 'react';
import { Widget, CustomerOrder, FIELD_DB_MAP, TableFilter } from '../../types';

interface Props {
  widget: Widget;
  orders: CustomerOrder[];
}

function TableWidget({ widget, orders }: Props) {
  const {
    columns = ['Customer ID', 'Customer name', 'Product', 'Quantity', 'Total amount', 'Status'],
    sortBy = 'Order date',
    pagination = 10,
    applyFilter = false,
    filters = [],
    fontSize = 14,
    headerBackground = '#54bd95',
  } = widget.config;

  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    // Apply filters
    if (applyFilter && filters && filters.length > 0) {
      data = data.filter((order: any) => {
        return filters.every((f: TableFilter) => {
          const field = FIELD_DB_MAP[f.column] || f.column;
          const val = String(order[field] || '').toLowerCase();
          const filterVal = f.value.toLowerCase();

          switch (f.operator) {
            case 'contains': return val.includes(filterVal);
            case 'equals': return val === filterVal;
            case 'startsWith': return val.startsWith(filterVal);
            case 'endsWith': return val.endsWith(filterVal);
            default: return true;
          }
        });
      });
    }

    // Sort
    if (sortBy === 'Ascending') {
      data.sort((a, b) => (a.orderDate > b.orderDate ? 1 : -1));
    } else if (sortBy === 'Descending') {
      data.sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1));
    } else {
      // Order date (default) — descending
      data.sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1));
    }

    return data;
  }, [orders, sortBy, applyFilter, filters]);

  const totalPages = Math.ceil(filteredOrders.length / pagination);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pagination, currentPage * pagination);

  const getFieldValue = (order: any, col: string) => {
    const field = FIELD_DB_MAP[col];
    if (!field) return '';
    const val = order[field];
    if (col === 'Order date') return val ? new Date(val).toLocaleDateString() : '';
    if (col === 'Total amount' || col === 'Unit price') return `$${Number(val).toFixed(2)}`;
    return String(val ?? '');
  };

  if (orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-white/5">
        <div className="text-xs font-medium text-gray-300 truncate">{widget.title}</div>
        {widget.description && <div className="text-[10px] text-gray-600 truncate">{widget.description}</div>}
      </div>
      <div className="flex-1 overflow-x-auto min-w-0 w-full">
        <table className="w-full" style={{ fontSize: `${fontSize}px` }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left text-[11px] font-semibold text-white uppercase tracking-wider whitespace-nowrap sticky top-0"
                  style={{ backgroundColor: headerBackground }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedOrders.map((order, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2 text-gray-300 max-w-[120px] truncate" title={getFieldValue(order, col)}>
                    {getFieldValue(order, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded hover:bg-white/5 disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded hover:bg-white/5 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableWidget;
