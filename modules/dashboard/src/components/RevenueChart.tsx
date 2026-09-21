import { memo } from 'react';
import type { ChartDataPoint } from '@mfd/shared-types';
import { formatNumber } from '@mfd/shared-utils';
import { EmptyState } from '@mfd/shared-ui';
import { BarChart3 } from 'lucide-react';

interface RevenueChartProps {
  data: ChartDataPoint[];
}

export const RevenueChart = memo(function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 size={40} />}
        title="No chart data"
        description="Revenue data will be displayed once available."
      />
    );
  }

  const maxValue = Math.max(...data.map((d) => Math.max(d.value, d.secondary ?? 0)));
  const chartHeight = 200;

  return (
    <div style={{ padding: '8px 0' }}>
      <div className="chart-bars" style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: chartHeight, padding: '0 8px' }}>
        {data.map((point) => {
          const height = (point.value / maxValue) * (chartHeight - 30);
          const secondaryHeight = point.secondary ? (point.secondary / maxValue) * (chartHeight - 30) : 0;
          return (
            <div key={point.label} className="chart-bar-group">
              <span className="chart-bar-tooltip">{formatNumber(point.value)}</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: chartHeight - 30 }}>
                <div
                  className="chart-bar"
                  style={{
                    width: '16px',
                    height: `${height}px`,
                    background: 'var(--color-primary)',
                  }}
                  title={`${point.label}: ${formatNumber(point.value)}`}
                />
                {point.secondary != null && (
                  <div
                    className="chart-bar"
                    style={{
                      width: '16px',
                      height: `${secondaryHeight}px`,
                      background: 'var(--color-primary-light)',
                      border: '1px solid var(--color-primary)',
                    }}
                    title={`Previous: ${formatNumber(point.secondary)}`}
                  />
                )}
              </div>
              <span className="chart-bar-label">{point.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--color-primary)', borderRadius: '2px' }} />
          Current
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', borderRadius: '2px' }} />
          Previous
        </span>
      </div>
    </div>
  );
});
