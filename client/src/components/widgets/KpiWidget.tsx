import { useEffect, useState } from 'react';
import { Widget } from '../../types';
import { fetchMetric } from '../../api/api';

interface Props {
  widget: Widget;
  dateFilter: string;
}

function KpiWidget({ widget, dateFilter }: Props) {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { metric = 'Total amount', aggregation = 'Sum', dataFormat = 'Number', decimalPrecision = 0 } = widget.config;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMetric(metric, aggregation, dateFilter)
      .then((v) => { if (!cancelled) setValue(v); })
      .catch(() => { if (!cancelled) setValue(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    const interval = setInterval(() => {
      fetchMetric(metric, aggregation, dateFilter)
        .then((v) => { if (!cancelled) setValue(v); })
        .catch(() => {});
    }, 10000);

    return () => { cancelled = true; clearInterval(interval); };
  }, [metric, aggregation, dateFilter]);

  const formatValue = (v: number) => {
    const precision = decimalPrecision ?? 0;
    if (dataFormat === 'Currency') {
      return `$${v.toFixed(precision)}`;
    }
    return v.toFixed(precision);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 text-center truncate w-full">
        {widget.title}
      </div>
      {widget.description && (
        <div className="text-[10px] text-gray-600 mb-2 text-center truncate w-full">{widget.description}</div>
      )}
      {loading ? (
        <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      ) : value !== null ? (
        <div className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent truncate w-full text-center px-2">
          {formatValue(value)}
        </div>
      ) : (
        <div className="text-gray-600 text-sm">No data</div>
      )}
      <div className="text-[10px] text-gray-600 mt-1">
        {aggregation} of {metric}
      </div>
    </div>
  );
}

export default KpiWidget;
