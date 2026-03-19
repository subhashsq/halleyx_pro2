import { Widget, PIE_DATA_FIELDS } from '../../types';

interface Props {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
  updateConfig: (key: string, value: any) => void;
}

function PieConfigForm({ widget, updateConfig }: Props) {
  const { dataField = 'Product', showLegend = true } = widget.config;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Data</h4>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Data Field</label>
        <select
          value={dataField}
          onChange={(e) => updateConfig('dataField', e.target.value)}
          className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
        >
          {PIE_DATA_FIELDS.map((f) => (
            <option key={f} value={f} className="bg-dark-900">{f}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-white/5 pt-4">
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Options</h4>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLegend}
            onChange={(e) => updateConfig('showLegend', e.target.checked)}
            className="w-4 h-4 rounded bg-dark-800 border-white/10 text-brand-500 focus:ring-brand-500/20"
          />
          <span className="text-xs text-gray-400">Show legend</span>
        </label>
      </div>
    </div>
  );
}

export default PieConfigForm;
