import { Widget } from '../../types';
import KpiConfigForm from './KpiConfigForm';
import ChartConfigForm from './ChartConfigForm';
import PieConfigForm from './PieConfigForm';
import TableConfigForm from './TableConfigForm';

interface Props {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
  onClose: () => void;
}

function WidgetConfigPanel({ widget, onUpdate, onClose }: Props) {
  const updateConfig = (key: string, value: any) => {
    onUpdate({ config: { ...widget.config, [key]: value } });
  };

  const renderConfigForm = () => {
    switch (widget.type) {
      case 'kpi':
        return <KpiConfigForm widget={widget} onUpdate={onUpdate} updateConfig={updateConfig} />;
      case 'bar':
      case 'line':
      case 'area':
      case 'scatter':
        return <ChartConfigForm widget={widget} onUpdate={onUpdate} updateConfig={updateConfig} />;
      case 'pie':
        return <PieConfigForm widget={widget} onUpdate={onUpdate} updateConfig={updateConfig} />;
      case 'table':
        return <TableConfigForm widget={widget} onUpdate={onUpdate} updateConfig={updateConfig} />;
      default:
        return <div className="text-gray-500 text-sm">No configuration available</div>;
    }
  };

  return (
    <div className="sticky top-24 bg-dark-900/50 rounded-2xl border border-white/5 overflow-y-auto max-h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white">Widget Settings</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4 space-y-4">
        {/* Common Fields */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Widget Title *</label>
          <input
            type="text"
            value={widget.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white
              focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Widget Type</label>
          <input
            type="text"
            value={widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}
            disabled
            className="w-full px-3 py-2 bg-dark-800/50 border border-white/5 rounded-lg text-sm text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
          <textarea
            value={widget.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white
              focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all resize-none"
          />
        </div>

        <div className="border-t border-white/5 pt-4">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Size</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Width</label>
              <input
                type="number"
                min={1}
                value={widget.w}
                onChange={(e) => onUpdate({ w: Math.max(1, Number(e.target.value)) })}
                className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white
                  focus:border-brand-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Height</label>
              <input
                type="number"
                min={1}
                value={widget.h}
                onChange={(e) => onUpdate({ h: Math.max(1, Number(e.target.value)) })}
                className="w-full px-3 py-2 bg-dark-800 border border-white/10 rounded-lg text-sm text-white
                  focus:border-brand-500/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4">
          {renderConfigForm()}
        </div>
      </div>
    </div>
  );
}

export default WidgetConfigPanel;
