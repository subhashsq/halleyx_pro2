import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ConfigurePage from './pages/ConfigurePage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Halleyx Nexus
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-1 bg-dark-900/50 rounded-xl p-1">
              <NavLink
                to="/nexus"
                end
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-400 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                Nexus
              </NavLink>
              <NavLink
                to="/nexus/configure"
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-400 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                Configure
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-400 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                Orders
              </NavLink>
            </div>

            {/* Formal User Name Display */}
            <div className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_6px_rgba(84,189,149,0.8)]"></div>
              <span className="text-[11px] sm:text-xs font-medium text-gray-400 tracking-[0.15em] uppercase pointer-events-none select-none">
                Subhash
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/nexus" replace />} />
          <Route path="/nexus" element={<DashboardPage />} />
          <Route path="/nexus/configure" element={<ConfigurePage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
