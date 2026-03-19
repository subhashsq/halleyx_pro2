import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDashboardStore } from '../store/dashboardStore';
import { DATE_FILTER_OPTIONS } from '../types';
import KpiWidget from '../components/widgets/KpiWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import PieWidget from '../components/widgets/PieWidget';
import TableWidget from '../components/widgets/TableWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

function DashboardPage() {
  const navigate = useNavigate();
  const {
    widgets,
    dateFilter,
    dashboardLoaded,
    dashboardLoading,
    orders,
    setDateFilter,
    loadDashboard,
    loadOrders,
    startPolling,
    stopPolling,
    layouts,
    lastUpdated,
  } = useDashboardStore();

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const lastUpdatedText = (() => {
    if (!lastUpdated) return 'Not updated yet';
    const diffSecs = Math.floor((now - new Date(lastUpdated).getTime()) / 1000);
    if (diffSecs < 60) return 'just now';
    return `${Math.floor(diffSecs / 60)}m ago`;
  })();

  const [snapshotMode, setSnapshotMode] = useState(false);

  // Widget visibility toggle state
  const [hiddenWidgets, setHiddenWidgets] = useState<Record<string, boolean>>({});

  const toggleWidget = (i: string) => {
    setHiddenWidgets(prev => ({ ...prev, [i]: !prev[i] }));
  };

  // Generate dynamic layouts where hidden widgets collapse to height = 1
  const getDynamicLayouts = () => {
    return {
      lg: layouts.lg?.map(l => hiddenWidgets[l.i] ? { ...l, h: 1, minH: 1 } : l) || [],
      md: layouts.md?.map(l => hiddenWidgets[l.i] ? { ...l, h: 1, minH: 1 } : l) || [],
      sm: layouts.sm?.map(l => hiddenWidgets[l.i] ? { ...l, h: 1, minH: 1 } : l) || [],
    };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering when user is interacting with inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return;

      if (e.key.toLowerCase() === 's') {
        setSnapshotMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.title = "Halleyx Nexus";
    loadDashboard();
    loadOrders();
    startPolling();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [dateFilter]);

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case 'kpi':
        return <KpiWidget widget={widget} dateFilter={dateFilter} />;
      case 'bar':
      case 'line':
      case 'area':
      case 'scatter':
        return <ChartWidget widget={widget} orders={orders} />;
      case 'pie':
        return <PieWidget widget={widget} orders={orders} />;
      case 'table':
        return <TableWidget widget={widget} orders={orders} />;
      default:
        return <div className="p-4 text-gray-400">Unknown widget type</div>;
    }
  };

  if (dashboardLoading && !dashboardLoaded) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading Halleyx Nexus...</p>
        </div>
      </div>
    );
  }

  if (dashboardLoaded && widgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center border border-white/5">
            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-200 mb-2">No Widgets in Nexus Dashboard</h2>
            <p className="text-gray-500 text-sm max-w-md">
              Start building your personalized Halleyx Nexus by adding widgets like charts, tables, and KPI cards.
            </p>
          </div>
          <button
            id="configure-dashboard-btn"
            onClick={() => navigate('/nexus/configure')}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium
              hover:from-brand-400 hover:to-brand-500 transition-all duration-200 shadow-lg shadow-brand-500/25
              hover:shadow-brand-400/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Configure Nexus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in transition-all duration-500 ${snapshotMode ? 'snapshot-mode pt-4' : ''}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-500 ${snapshotMode ? 'mb-2 opacity-50 hover:opacity-100' : 'mb-6'}`}>
        {!snapshotMode && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-white">Halleyx Nexus Dashboard</h1>
            <p className="text-[13px] text-brand-300/80 mt-0.5 mb-1">Your central intelligence hub for real-time business insights</p>
            <p className="text-sm text-gray-500">{widgets.length} widget{widgets.length !== 1 ? 's' : ''} configured</p>
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto">
          {!snapshotMode && (
            <div className="flex items-center gap-3 animate-fade-in">
              {/* Last Updated Status */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-dark-900/50 rounded-xl border border-white/5 text-xs text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                Last updated: <span className="text-gray-200 font-medium ml-0.5">{lastUpdatedText}</span>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2 bg-dark-900/50 rounded-xl px-4 py-2 border border-white/5">
                <label className="text-xs text-gray-400 whitespace-nowrap">Show data for</label>
                <select
                  id="global-date-filter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent text-sm text-white border-none outline-none cursor-pointer"
                >
                  {DATE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigate('/nexus/configure')}
                className="px-4 py-2 bg-brand-500/10 text-brand-400 rounded-xl text-sm font-medium
                  hover:bg-brand-500/20 transition-all duration-200 border border-brand-500/20"
              >
                Configure Nexus
              </button>
            </div>
          )}

          {/* Toggle Snapshot Mode */}
          <button
            onClick={() => setSnapshotMode(!snapshotMode)}
            title="Press 'S' to toggle"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
              ${snapshotMode
                ? 'bg-dark-800 text-gray-300 border border-white/10 hover:bg-dark-700 hover:text-white'
                : 'bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20'}`}
          >
            {snapshotMode ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Exit Snapshot
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Snapshot Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <ResponsiveGridLayout
        className="layout"
        layouts={getDynamicLayouts()}
        breakpoints={{ lg: 1024, md: 768, sm: 0 }}
        cols={{ lg: 12, md: 8, sm: 4 }}
        rowHeight={60}
        isDraggable={false}
        isResizable={false}
        compactType={null}
        containerPadding={[0, 0]}
        margin={[16, 16]}
      >
        {widgets.map((widget) => {
          const isHidden = hiddenWidgets[widget.i];
          return (
            <div key={widget.i} className={`rounded-2xl border transition-all duration-500 flex flex-col w-full relative group overflow-hidden ${isHidden ? 'bg-dark-900/40 border-white/5 h-[60px]' : 'bg-dark-900/80 border-white/5 shadow-lg h-full'}`}>
              
              {/* Eye Toggle Button */}
              <button
                onClick={() => toggleWidget(widget.i)}
                className="absolute top-2 right-2 z-50 p-1.5 bg-dark-800/80 hover:bg-dark-700/80 rounded-lg text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 sm:opacity-100 border border-white/5 backdrop-blur-sm shadow-sm"
                title={isHidden ? "Show widget" : "Hide widget"}
              >
                {isHidden ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              
              {/* Widget Content (Fades out when hidden) */}
              <div className={`flex-1 transition-opacity duration-300 w-full h-full ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {renderWidget(widget)}
              </div>
              
              {/* Simplified Title Overlay for Hidden State */}
              {isHidden && (
                <div className="absolute inset-0 p-3 pointer-events-none flex items-start truncate pr-10 animate-fade-in">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-medium text-gray-500 truncate">{widget.title}</span>
                     <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-600 uppercase">Hidden</span>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}

export default DashboardPage;
