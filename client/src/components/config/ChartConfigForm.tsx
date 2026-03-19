import { Widget, CHART_AXIS_FIELDS } from '../../types';

interface Props {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
  updateConfig: (key: string, value: any) => void;
}

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

function ChartConfigForm({ widget, updateConfig }: Props) {
  const { xAxis = 'Product', yAxis = 'Total amount', chartColor = '#54bd95', showDataLabel = false } = widget.config;

  const handleColorChange = (value: string) => {
    // Allow partial input while typing
    updateConfig('chartColor', value);
  };

  const isValidColor = HEX_REGEX.test(chartColor);

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Data</h4>

      <div>
        <label className="block text-xs text-gray-500 mb-1">X-Axis</label>
        <select
          value={xAxis}
          onChange={(e) => updateConfig('xAxis', e.target.value)}
          className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
        >
          {CHART_AXIS_FIELDS.map((f) => (
            <option key={f} value={f} className="bg-dark-900">{f}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Y-Axis</label>
        <select
          value={yAxis}
          onChange={(e) => updateConfig('yAxis', e.target.value)}
          className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white outline-none"
        >
          {CHART_AXIS_FIELDS.map((f) => (
            <option key={f} value={f} className="bg-dark-900">{f}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-white/5 pt-4">
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Styling</h4>

        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Chart Color (HEX)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={isValidColor ? chartColor : '#54bd95'}
              onChange={(e) => updateConfig('chartColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={chartColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#54bd95"
              className={`flex-1 px-3 py-2 bg-dark-800 border rounded-lg text-sm text-white outline-none
                ${isValidColor ? 'border-white/10' : 'border-red-500/50'}`}
            />
          </div>
          {!isValidColor && chartColor.length > 0 && (
            <p className="text-[10px] text-red-400 mt-1">Invalid HEX color format. Use #RRGGBB</p>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDataLabel}
            onChange={(e) => updateConfig('showDataLabel', e.target.checked)}
            className="w-4 h-4 rounded bg-dark-800 border-white/10 text-brand-500 focus:ring-brand-500/20"
          />
          <span className="text-xs text-gray-400">Show data labels</span>
        </label>
      </div>
    </div>
  );
}

export default ChartConfigForm;
