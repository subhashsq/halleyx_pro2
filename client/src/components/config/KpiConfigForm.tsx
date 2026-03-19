import { Widget, METRIC_FIELDS, NUMERIC_FIELDS, AGGREGATION_OPTIONS } from '../../types';

interface Props {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
  updateConfig: (key: string, value: any) => void;
}

function KpiConfigForm({ widget, updateConfig }: Props) {
  const { metric = 'Total amount', aggregation = 'Sum', dataFormat = 'Number', decimalPrecision = 0 } = widget.config;

  const isNumericMetric = NUMERIC_FIELDS.includes(metric);

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Data Settings</h4>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Select Metric</label>
        <select
          value={metric}
          onChange={(e) => {
            updateConfig('metric', e.target.value);
            // Reset aggregation to Count if non-numeric
            if (!NUMERIC_FIELDS.includes(e.target.value) && aggregation !== 'Count') {
              updateConfig('aggregation', 'Count');
            }
          }}
          className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
        >
          {METRIC_FIELDS.map((f) => (
            <option key={f} value={f} className="bg-dark-900">{f}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Aggregation</label>
        <select
          value={aggregation}
          onChange={(e) => updateConfig('aggregation', e.target.value)}
          className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
        >
          {AGGREGATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt} disabled={opt !== 'Count' && !isNumericMetric} className="bg-dark-900">
              {opt} {opt !== 'Count' && !isNumericMetric ? '(numeric only)' : ''}
            </option>
          ))}
        </select>
        {!isNumericMetric && aggregation !== 'Count' && (
          <p className="text-[10px] text-yellow-500 mt-1">Only Count is available for non-numeric fields</p>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Data Format</label>
        <select
          value={dataFormat}
          onChange={(e) => updateConfig('dataFormat', e.target.value)}
          className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
        >
          <option value="Number" className="bg-dark-900">Number</option>
          <option value="Currency" className="bg-dark-900">Currency</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Decimal Precision</label>
        <input
          type="number"
          min={0}
          value={decimalPrecision}
          onChange={(e) => updateConfig('decimalPrecision', Math.max(0, Number(e.target.value)))}
          className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
        />
      </div>
    </div>
  );
}

export default KpiConfigForm;
