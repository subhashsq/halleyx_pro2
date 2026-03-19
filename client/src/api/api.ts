import { CustomerOrder, DashboardConfig, Widget } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Orders API
export async function fetchOrders(dateFilter?: string): Promise<CustomerOrder[]> {
  const params = dateFilter ? `?dateFilter=${dateFilter}` : '';
  const res = await fetch(`${API_BASE}/orders${params}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createOrder(order: Omit<CustomerOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomerOrder> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create order');
  }
  return res.json();
}

export async function deleteOrder(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete order');
}

// Dashboard API
export async function fetchDashboard(): Promise<DashboardConfig | null> {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  const data = await res.json();
  if (!data) return null;

  // Parse widget configs
  return {
    ...data,
    widgets: (data.widgets || []).map((w: any) => ({
      ...w,
      i: String(w.id || Math.random()),
      config: typeof w.config === 'string' ? JSON.parse(w.config) : w.config,
    })),
  };
}

export async function saveDashboard(
  name: string,
  dateFilter: string,
  widgets: Widget[]
): Promise<DashboardConfig> {
  const res = await fetch(`${API_BASE}/dashboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      dateFilter,
      widgets: widgets.map((w) => ({
        type: w.type,
        title: w.title,
        description: w.description,
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
        config: w.config,
      })),
    }),
  });
  if (!res.ok) throw new Error('Failed to save dashboard');
  const data = await res.json();
  return {
    ...data,
    widgets: (data.widgets || []).map((w: any) => ({
      ...w,
      i: String(w.id || Math.random()),
      config: typeof w.config === 'string' ? JSON.parse(w.config) : w.config,
    })),
  };
}

// Metrics API
export async function fetchMetric(
  metric: string,
  aggregation: string,
  dateFilter: string
): Promise<number> {
  const res = await fetch(`${API_BASE}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metric, aggregation, dateFilter }),
  });
  if (!res.ok) throw new Error('Failed to fetch metric');
  const data = await res.json();
  return data.value;
}
