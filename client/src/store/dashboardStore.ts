import { create } from 'zustand';
import { Layouts } from 'react-grid-layout';
import { Widget, CustomerOrder, DashboardConfig } from '../types';
import * as api from '../api/api';

interface DashboardStore {
  // Dashboard state
  widgets: Widget[];
  layouts: Layouts;
  dateFilter: string;
  dashboardLoaded: boolean;
  dashboardLoading: boolean;
  lastUpdated: Date | null;

  // Orders state
  orders: CustomerOrder[];
  ordersLoading: boolean;

  // Polling
  pollingInterval: ReturnType<typeof setInterval> | null;

  // Actions
  setWidgets: (widgets: Widget[]) => void;
  setDateFilter: (filter: string) => void;
  addWidget: (widget: Widget) => void;
  updateWidget: (i: string, updates: Partial<Widget>) => void;
  removeWidget: (i: string) => void;
  duplicateWidget: (i: string) => void;
  updateLayout: (layout: Array<{ i: string; x: number; y: number; w: number; h: number }>) => void;
  setLayouts: (layouts: Layouts) => void;

  // API actions
  loadDashboard: () => Promise<void>;
  saveDashboard: () => Promise<void>;
  loadOrders: () => Promise<void>;
  createOrder: (order: Omit<CustomerOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;

  // Polling
  startPolling: () => void;
  stopPolling: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  widgets: [],
  layouts: { lg: [], md: [], sm: [] },
  dateFilter: 'all',
  dashboardLoaded: false,
  dashboardLoading: false,
  lastUpdated: null,
  orders: [],
  ordersLoading: false,
  pollingInterval: null,

  setLayouts: (layouts) => set({ layouts }),

  setWidgets: (widgets) => set({ widgets }),

  setDateFilter: (dateFilter) => set({ dateFilter }),

  addWidget: (widget) => set((state) => ({
    widgets: [...state.widgets, widget],
  })),

  updateWidget: (i, updates) => set((state) => ({
    widgets: state.widgets.map((w) =>
      w.i === i ? { ...w, ...updates } : w
    ),
  })),

  removeWidget: (i) => set((state) => ({
    widgets: state.widgets.filter((w) => w.i !== i),
    layouts: {
      lg: (state.layouts.lg || []).filter((l) => l.i !== i),
      md: (state.layouts.md || []).filter((l) => l.i !== i),
      sm: (state.layouts.sm || []).filter((l) => l.i !== i),
    }
  })),

  duplicateWidget: (i) => set((state) => {
    const original = state.widgets.find((w) => w.i === i);
    if (!original) return state;

    let newX = original.x + 1;
    let newY = original.y + 1;

    if (newX + original.w > 12) {
      newX = 0;
      newY = original.y + original.h;
    }

    const newWidget: Widget = {
      ...original,
      i: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${original.title} (Copy)`,
      x: newX,
      y: newY,
    };

    const newLayoutItem = { i: newWidget.i, x: newX, y: newY, w: original.w, h: original.h, minW: 1, minH: 1 };

    return {
      widgets: [...state.widgets, newWidget],
      layouts: {
        lg: [...(state.layouts.lg || []), newLayoutItem],
        md: [...(state.layouts.md || []), { ...newLayoutItem, w: Math.min(original.w, 8), x: Math.min(newX, Math.max(0, 8 - Math.min(original.w, 8))) }],
        sm: [...(state.layouts.sm || []), { ...newLayoutItem, w: 4, x: 0 }],
      }
    };
  }),

  updateLayout: (layout) => set((state) => ({
    widgets: state.widgets.map((w) => {
      const l = layout.find((item) => item.i === w.i);
      if (l) {
        return { ...w, x: l.x, y: l.y, w: l.w, h: l.h };
      }
      return w;
    }),
  })),

  loadDashboard: async () => {
    set({ dashboardLoading: true });
    try {
      const data = await api.fetchDashboard();
      if (data) {
        set({
          widgets: data.widgets,
          layouts: {
            lg: data.widgets.map((w: any) => ({ i: w.i, x: w.x, y: w.y, w: w.w, h: w.h, minW: 1, minH: 1 })),
            md: data.widgets.map((w: any) => ({ i: w.i, x: Math.min(w.x, 8 - Math.min(w.w, 8)), y: w.y, w: Math.min(w.w, 8), h: w.h, minW: 1, minH: 1 })),
            sm: data.widgets.map((w: any) => ({ i: w.i, x: 0, y: w.y, w: 4, h: w.h, minW: 1, minH: 1 })),
          },
          dateFilter: data.dateFilter || 'all',
          dashboardLoaded: true,
        });
      } else {
        set({ dashboardLoaded: true });
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      set({ dashboardLoaded: true });
    } finally {
      set({ dashboardLoading: false });
    }
  },

  saveDashboard: async () => {
    const { widgets, dateFilter } = get();
    try {
      const data = await api.saveDashboard('My Dashboard', dateFilter, widgets);
      set({ widgets: data.widgets });
    } catch (err) {
      console.error('Failed to save dashboard:', err);
      throw err;
    }
  },

  loadOrders: async () => {
    set({ ordersLoading: true });
    try {
      const dateFilter = get().dateFilter;
      const orders = await api.fetchOrders(dateFilter);
      set({ orders, lastUpdated: new Date() });
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      set({ ordersLoading: false });
    }
  },

  createOrder: async (order) => {
    await api.createOrder(order);
    await get().loadOrders();
  },

  deleteOrder: async (id) => {
    await api.deleteOrder(id);
    await get().loadOrders();
  },

  startPolling: () => {
    const existing = get().pollingInterval;
    if (existing) clearInterval(existing);

    const interval = setInterval(() => {
      get().loadOrders();
    }, 10000);

    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    const interval = get().pollingInterval;
    if (interval) {
      clearInterval(interval);
      set({ pollingInterval: null });
    }
  },
}));
