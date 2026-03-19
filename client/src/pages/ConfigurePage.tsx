import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '../store/dashboardStore';
import { WIDGET_CATEGORIES, DEFAULT_WIDGET_SIZES, Widget } from '../types';
import WidgetConfigPanel from '../components/config/WidgetConfigPanel';

const ResponsiveGridLayout = WidthProvider(Responsive);

function ConfigurePage() {
  const navigate = useNavigate();
  const { widgets, setWidgets, addWidget, updateWidget, removeWidget, duplicateWidget, updateLayout, saveDashboard, loadDashboard, dashboardLoaded, layouts, setLayouts } = useDashboardStore();
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Configure Nexus";
    if (!dashboardLoaded) {
      loadDashboard();
    }
  }, [dashboardLoaded, loadDashboard]);
  const syncToStore = useCallback((layout: Layout[]) => {
    updateLayout(layout.map((l) => ({ i: l.i, x: l.x, y: l.y, w: l.w, h: l.h })));
  }, [updateLayout]);

  const handleDrop = useCallback((layout: Layout[], layoutItem: Layout, e: any) => {
    e.preventDefault();
    const type = e?.dataTransfer?.getData('widgetType');
    console.log("DROP FIRED:", type);
    if (!type) return;

    const defaults = DEFAULT_WIDGET_SIZES[type] || { w: 4, h: 4 };
    const newWidget: Widget = {
      i: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: 'Untitled',
      description: '',
      x: layoutItem.x,
      y: layoutItem.y,
      w: defaults.w,
      h: defaults.h,
      config: getDefaultConfig(type),
    };
    addWidget(newWidget);

    // Sync to layouts instantly so it appears cleanly handled
    const newLayoutItem = { i: newWidget.i, x: layoutItem.x, y: layoutItem.y, w: defaults.w, h: defaults.h, minW: 1, minH: 1 };
    setLayouts({
      lg: [...(layouts.lg || []), newLayoutItem],
      md: [...(layouts.md || []), { ...newLayoutItem, w: Math.min(defaults.w, 8) }],
      sm: [...(layouts.sm || []), { ...newLayoutItem, w: 4 }],
    });

    // Save drop immediately to store
    syncToStore([...layout, newLayoutItem]);
    setSelectedWidget(newWidget.i);
  }, [addWidget, syncToStore, layouts, setLayouts]);

  const handleDeleteWidget = useCallback((i: string) => {
    // ✅ Store automatically removes from BOTH widgets and layouts states now
    removeWidget(i);
    if (selectedWidget === i) setSelectedWidget(null);
    setDeleteConfirm(null);
  }, [removeWidget, selectedWidget]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDashboard();
      navigate('/');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLayoutChange = useCallback((_currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  }, []);

  const handleDragStop = useCallback((layout: Layout[]) => syncToStore(layout), [syncToStore]);
  const handleResizeStop = useCallback((layout: Layout[]) => syncToStore(layout), [syncToStore]);

  const selectedWidgetData = widgets.find((w) => w.i === selectedWidget);

  return (
    <div className="animate-fade-in flex gap-6 h-[calc(100vh-100px)]">
      {/* Left Sidebar - Widget Categories */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-24 bg-dark-900/50 rounded-2xl border border-white/5 p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Widget Library</h2>
          {WIDGET_CATEGORIES.map((category) => (
            <div key={category.name} className="mb-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">{category.name}</h3>
              <div className="space-y-1">
                {category.widgets.map((widget) => (
                  <div
                    key={widget.type}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('widgetType', widget.type);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300
                      hover:bg-brand-500/10 hover:text-brand-400 transition-all duration-200
                      border border-transparent hover:border-brand-500/20 group cursor-grab active:cursor-grabbing"
                  >
                    <span className="text-lg">{widget.icon}</span>
                    <span className="font-medium">{widget.label}</span>
                    <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Configure Nexus</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/nexus')}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              id="save-configuration-btn"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl text-sm font-medium
                hover:from-brand-400 hover:to-brand-500 transition-all duration-200 shadow-lg shadow-brand-500/25
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>

        {widgets.length === 0 ? (
          <div
            className="flex items-center justify-center h-[400px] border-2 border-dashed border-white/10 rounded-2xl"
            onDragOver={(e: React.DragEvent) => e.preventDefault()}
            onDrop={(e: React.DragEvent) => {
              e.preventDefault();
              handleDrop([], { x: 0, y: 0, w: 4, h: 4, i: '' }, e);
            }}
          >
            <div className="text-center">
              <p className="text-gray-500 text-sm">Drag widgets from the sidebar to start building your Nexus</p>
              <p className="text-gray-600 text-xs mt-1">Drag any widget type from the left to add it</p>
            </div>
          </div>
        ) : (
          <div
            className="bg-dark-900/30 rounded-2xl border border-white/5 p-4 min-h-[400px]"
            onDragOver={(e: React.DragEvent) => e.preventDefault()}
          >
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1024, md: 768, sm: 0 }}
              cols={{ lg: 12, md: 8, sm: 4 }}
              rowHeight={60}
              isDraggable={true}
              isResizable={true}
              isDroppable={true}
              onDrop={handleDrop}
              onLayoutChange={handleLayoutChange}
              onDragStop={handleDragStop}
              onResizeStop={handleResizeStop}
              containerPadding={[0, 0]}
              margin={[12, 12]}
              draggableHandle=".drag-handle"
              draggableCancel=".no-drag"
              useCSSTransforms={true}
              compactType="vertical"
            >
              {widgets.map((widget) => (
                <div
                  key={widget.i}
                  className={`rounded-2xl border transition-all duration-200 group relative flex flex-col h-full w-full overflow-hidden
                    ${selectedWidget === widget.i
                      ? 'bg-dark-800 border-brand-500/30 shadow-lg shadow-brand-500/10'
                      : 'bg-dark-900/80 border-white/5 hover:border-white/10'
                    }`}
                >
                  {/* Widget Header */}
                  <div className="drag-handle flex items-center justify-between px-3 py-2 border-b border-white/5 cursor-grab active:cursor-grabbing bg-white/[0.02]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs">{getWidgetIcon(widget.type)}</span>
                      <span className="text-xs font-medium text-gray-300 truncate">{widget.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 uppercase flex-shrink-0">{widget.type}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); duplicateWidget(widget.i); }}
                        className="no-drag p-1 rounded-lg hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-all"
                        title="Duplicate"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </button>
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setSelectedWidget(widget.i); }}
                        className="no-drag p-1 rounded-lg hover:bg-brand-500/20 text-gray-400 hover:text-brand-400 transition-all"
                        title="Settings"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(widget.i); }}
                        className="no-drag p-1 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Widget Preview */}
                  <div className="p-3 flex items-center justify-center h-[calc(100%-36px)] text-sm text-gray-500">
                    <span>{getWidgetIcon(widget.type)} {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget</span>
                  </div>

                  {/* Delete Confirmation Overlay */}
                  {deleteConfirm === widget.i && (
                    <div
                      className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-center p-4">
                        <p className="text-sm text-gray-300 mb-3">Delete this widget?</p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteWidget(widget.i); }}
                            className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        )}
      </div>

      {/* Right Sidebar - Config Panel */}
      {selectedWidgetData && (
        <div className="w-80 flex-shrink-0 animate-slide-in">
          <WidgetConfigPanel
            widget={selectedWidgetData}
            onUpdate={(updates) => updateWidget(selectedWidgetData.i, updates)}
            onClose={() => setSelectedWidget(null)}
          />
        </div>
      )}
    </div>
  );
}

function getWidgetIcon(type: string): string {
  const icons: Record<string, string> = {
    bar: '📊', line: '📈', pie: '🥧', area: '📉', scatter: '⚬', table: '📋', kpi: '🎯',
  };
  return icons[type] || '📦';
}

function getDefaultConfig(type: string): any {
  switch (type) {
    case 'kpi':
      return { metric: 'Total amount', aggregation: 'Sum', dataFormat: 'Number', decimalPrecision: 0 };
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
      return { xAxis: 'Product', yAxis: 'Total amount', chartColor: '#54bd95', showDataLabel: false };
    case 'pie':
      return { dataField: 'Product', showLegend: true };
    case 'table':
      return {
        columns: ['Customer ID', 'Customer name', 'Product', 'Quantity', 'Total amount', 'Status'],
        sortBy: 'Order date', pagination: 10, applyFilter: false, filters: [],
        fontSize: 14, headerBackground: '#54bd95',
      };
    default:
      return {};
  }
}

export default ConfigurePage;
