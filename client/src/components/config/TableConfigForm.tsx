import { useState } from 'react';
import { Widget, TABLE_COLUMN_OPTIONS, TableFilter } from '../../types';

interface Props {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
  updateConfig: (key: string, value: any) => void;
}

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

function TableConfigForm({ widget, onUpdate, updateConfig }: Props) {
  const {
    columns = ['Customer ID', 'Customer name', 'Product', 'Quantity', 'Total amount', 'Status'],
    sortBy = 'Order date',
    pagination = 10,
    applyFilter = false,
    filters = [],
    fontSize = 14,
    headerBackground = '#54bd95',
  } = widget.config;

  const isValidColor = HEX_REGEX.test(headerBackground);

  const handleColumnToggle = (col: string) => {
    const newCols = columns.includes(col)
      ? columns.filter((c: string) => c !== col)
      : [...columns, col];
    updateConfig('columns', newCols);
  };

  const addFilter = () => {
    const newFilters: TableFilter[] = [...(filters || []), { column: 'Customer name', operator: 'contains', value: '' }];
    updateConfig('filters', newFilters);
  };

  const updateFilter = (index: number, field: string, value: string) => {
    const newFilters = [...(filters || [])];
    newFilters[index] = { ...newFilters[index], [field]: value };
    updateConfig('filters', newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = (filters || []).filter((_: any, i: number) => i !== index);
    updateConfig('filters', newFilters);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Columns</h4>

      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {TABLE_COLUMN_OPTIONS.map((col) => (
          <label key={col} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={columns.includes(col)}
              onChange={() => handleColumnToggle(col)}
              className="w-3.5 h-3.5 rounded bg-dark-800 border-white/10 text-brand-500 focus:ring-brand-500/20"
            />
            <span className="text-xs text-gray-400">{col}</span>
          </label>
        ))}
      </div>

      <div className="border-t border-white/5 pt-4">
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Options</h4>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => updateConfig('sortBy', e.target.value)}
              className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
            >
              <option value="Ascending" className="bg-dark-900">Ascending</option>
              <option value="Descending" className="bg-dark-900">Descending</option>
              <option value="Order date" className="bg-dark-900">Order date</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Pagination</label>
            <select
              value={pagination}
              onChange={(e) => updateConfig('pagination', Number(e.target.value))}
              className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
            >
              <option value={5} className="bg-dark-900">5 per page</option>
              <option value={10} className="bg-dark-900">10 per page</option>
              <option value={15} className="bg-dark-900">15 per page</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={applyFilter}
              onChange={(e) => updateConfig('applyFilter', e.target.checked)}
              className="w-4 h-4 rounded bg-dark-800 border-white/10 text-brand-500 focus:ring-brand-500/20"
            />
            <span className="text-xs text-gray-400">Apply filter</span>
          </label>

          {applyFilter && (
            <div className="space-y-2 pl-2 border-l-2 border-brand-500/20">
              {(filters || []).map((filter: TableFilter, idx: number) => (
                <div key={idx} className="flex flex-col gap-1 bg-dark-800/50 rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Filter {idx + 1}</span>
                    <button onClick={() => removeFilter(idx)} className="text-gray-500 hover:text-red-400 text-xs">&times;</button>
                  </div>
                  <select
                    value={filter.column}
                    onChange={(e) => updateFilter(idx, 'column', e.target.value)}
                    className="w-full px-2 py-1 bg-dark-800 border border-white/5 rounded text-xs text-white outline-none"
                  >
                    {TABLE_COLUMN_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-dark-900">{c}</option>
                    ))}
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                    className="w-full px-2 py-1 bg-dark-800 border border-white/5 rounded text-xs text-white outline-none"
                  >
                    <option value="contains" className="bg-dark-900">Contains</option>
                    <option value="equals" className="bg-dark-900">Equals</option>
                    <option value="startsWith" className="bg-dark-900">Starts with</option>
                    <option value="endsWith" className="bg-dark-900">Ends with</option>
                  </select>
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                    placeholder="Filter value..."
                    className="w-full px-2 py-1 bg-dark-800 border border-white/5 rounded text-xs text-white outline-none placeholder-gray-600"
                  />
                </div>
              ))}
              <button
                onClick={addFilter}
                className="text-xs text-brand-400 hover:text-brand-300 px-2 py-1"
              >
                + Add filter
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Styling</h4>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Font Size ({fontSize}px)</label>
            <input
              type="range"
              min={12}
              max={18}
              value={fontSize}
              onChange={(e) => updateConfig('fontSize', Number(e.target.value))}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>12px</span><span>18px</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Header Background (HEX)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={isValidColor ? headerBackground : '#54bd95'}
                onChange={(e) => updateConfig('headerBackground', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={headerBackground}
                onChange={(e) => updateConfig('headerBackground', e.target.value)}
                placeholder="#54bd95"
                className={`flex-1 px-3 py-2 bg-dark-800 border rounded-lg text-sm text-white outline-none
                  ${isValidColor ? 'border-white/10' : 'border-red-500/50'}`}
              />
            </div>
            {!isValidColor && headerBackground.length > 0 && (
              <p className="text-[10px] text-red-400 mt-1">Invalid HEX color format</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableConfigForm;
