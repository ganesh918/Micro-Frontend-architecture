import { memo } from 'react';
import type { ChartDataPoint } from '@mfd/shared-types';
import { formatNumber } from '@mfd/shared-utils';
import { EmptyState } from '@mfd/shared-ui';
import { BarChart3 } from 'lucide-react';

interface TrendBarChartProps {
  data: ChartDataPoint[];
  showValues?: boolean;
  showSecondary?: boolean;
}

export const TrendBarChart = memo(function TrendBarChart({
  data,
  showValues = true,
  showSecondary = true,
}: TrendBarChartProps) {
  if (data.length === 0) {
    return <EmptyState icon={<BarChart3 size={40} />} title="No data" description="Trend data will appear once available." />;
  }

  const maxValue = Math.max(...data.flatMap((d) => [d.value, d.secondary ?? 0]));
  const chartHeight = 200;

  return (
    <div>
      <div className="chart-bars" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: chartHeight, padding: '0 4px' }}>
        {data.map((point) => {
          const height = (point.value / maxValue) * (chartHeight - 40);
          const secondaryHeight = point.secondary ? (point.secondary / maxValue) * (chartHeight - 40) : 0;

          return (
            <div key={point.label} className="chart-bar-group">
              {showValues && (
                <span className="chart-bar-tooltip">{formatNumber(point.value)}</span>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: chartHeight - 40 }}>
                <div
                  className="chart-bar"
                  style={{
                    width: showSecondary && point.secondary != null ? '14px' : '100%',
                    maxWidth: '40px',
                    height: `${height}px`,
                    background: 'linear-gradient(180deg, var(--color-primary) 0%, #818cf8 100%)',
                  }}
                />
                {showSecondary && point.secondary != null && (
                  <div
                    className="chart-bar"
                    style={{
                      width: '14px',
                      height: `${secondaryHeight}px`,
                      background: 'var(--color-primary-light)',
                      border: '1px solid var(--color-primary)',
                      opacity: 0.7,
                    }}
                  />
                )}
              </div>
              <span className="chart-bar-label">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
