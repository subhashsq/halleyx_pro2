import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Widget, CustomerOrder, FIELD_DB_MAP } from '../../types';

interface Props {
  widget: Widget;
  orders: CustomerOrder[];
}

const COLORS = ['#54bd95', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#84cc16'];

function PieWidget({ widget, orders }: Props) {
  const { dataField = 'Product', showLegend = true } = widget.config;
  const dbField = FIELD_DB_MAP[dataField] || dataField;

  const chartData = useMemo(() => {
    if (orders.length === 0) return [];
    const grouped: Record<string, number> = {};
    orders.forEach((order: any) => {
      const key = String(order[dbField] || 'Unknown');
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [orders, dbField]);

  if (orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-3">
      <div className="text-xs font-medium text-gray-300 mb-1 truncate">{widget.title}</div>
      {widget.description && <div className="text-[10px] text-gray-600 mb-2 truncate">{widget.description}</div>}
      <div className="flex-1 min-h-0 min-w-0 w-full text-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%"
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1e1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              labelStyle={{ color: '#9ca3af' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            {showLegend && (
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }}
                iconType="circle"
                iconSize={8}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieWidget;
