import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList,
} from 'recharts';
import { Widget, CustomerOrder, FIELD_DB_MAP } from '../../types';

interface Props {
  widget: Widget;
  orders: CustomerOrder[];
}

function ChartWidget({ widget, orders }: Props) {
  const { xAxis = 'Product', yAxis = 'Total amount', chartColor = '#54bd95', showDataLabel = false } = widget.config;

  const xField = FIELD_DB_MAP[xAxis] || xAxis;
  const yField = FIELD_DB_MAP[yAxis] || yAxis;

  const chartData = useMemo(() => {
    if (orders.length === 0) return [];

    // Group by x-axis field and aggregate y-axis
    const grouped: Record<string, number[]> = {};
    orders.forEach((order: any) => {
      const key = String(order[xField] || 'Unknown');
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(Number(order[yField]) || 0);
    });

    return Object.entries(grouped).map(([name, values]) => ({
      name,
      value: values.reduce((a, b) => a + b, 0),
    }));
  }, [orders, xField, yField]);

  if (orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        No data available
      </div>
    );
  }

  const tooltipStyle = {
    contentStyle: { background: '#1e1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' },
    labelStyle: { color: '#9ca3af' },
    itemStyle: { color: '#e5e7eb' },
  };

  const renderChart = () => {
    switch (widget.type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]}>
              {showDataLabel && <LabelList dataKey="value" position="top" fill="#9ca3af" fontSize={10} />}
            </Bar>
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={{ fill: chartColor, r: 4 }}>
              {showDataLabel && <LabelList dataKey="value" position="top" fill="#9ca3af" fontSize={10} />}
            </Line>
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`areaGrad-${widget.i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="value" stroke={chartColor} fill={`url(#areaGrad-${widget.i})`} strokeWidth={2}>
              {showDataLabel && <LabelList dataKey="value" position="top" fill="#9ca3af" fontSize={10} />}
            </Area>
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} name={xAxis} />
            <YAxis type="number" dataKey="value" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} name={yAxis} />
            <Tooltip {...tooltipStyle} />
            <Scatter data={chartData} fill={chartColor}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={chartColor} />
              ))}
            </Scatter>
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col p-3">
      <div className="text-xs font-medium text-gray-300 mb-1 truncate">{widget.title}</div>
      {widget.description && <div className="text-[10px] text-gray-600 mb-2 truncate">{widget.description}</div>}
      <div className="flex-1 min-h-0 min-w-0 w-full text-center">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()!}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartWidget;
