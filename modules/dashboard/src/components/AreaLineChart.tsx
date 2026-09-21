import { memo, useMemo } from 'react';
import type { ChartDataPoint } from '@mfd/shared-types';
import { formatNumber } from '@mfd/shared-utils';
import { EmptyState } from '@mfd/shared-ui';
import { LineChart } from 'lucide-react';

interface AreaLineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showSecondary?: boolean;
}

export const AreaLineChart = memo(function AreaLineChart({
  data,
  height = 220,
  showSecondary = true,
}: AreaLineChartProps) {
  const chart = useMemo(() => {
    if (data.length === 0) return null;

    const padding = { top: 20, right: 12, bottom: 28, left: 12 };
    const width = 100;
    const innerH = height - padding.top - padding.bottom;
    const maxVal = Math.max(...data.flatMap((d) => [d.value, d.secondary ?? 0])) * 1.1;

    const xStep = (width - padding.left - padding.right) / Math.max(data.length - 1, 1);

    const toPoint = (value: number, index: number) => ({
      x: padding.left + index * xStep,
      y: padding.top + innerH - (value / maxVal) * innerH,
    });

    const primaryPoints = data.map((d, i) => toPoint(d.value, i));
    const secondaryPoints = showSecondary
      ? data.map((d, i) => toPoint(d.secondary ?? 0, i))
      : [];

    const toPath = (points: { x: number; y: number }[]) =>
      points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const toArea = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      const baseY = padding.top + innerH;
      return `${toPath(points)} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
    };

    return { primaryPoints, secondaryPoints, toPath, toArea, padding, innerH, maxVal };
  }, [data, height, showSecondary]);

  if (!chart || data.length === 0) {
    return (
      <EmptyState
        icon={<LineChart size={40} />}
        title="No chart data"
        description="Chart data will appear once available."
      />
    );
  }

  const { primaryPoints, secondaryPoints, toPath, toArea, padding, innerH } = chart;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padding.left}
            y1={padding.top + innerH * (1 - ratio)}
            x2={100 - padding.right}
            y2={padding.top + innerH * (1 - ratio)}
            stroke="var(--color-border)"
            strokeWidth="0.3"
            strokeDasharray="1 1"
          />
        ))}

        {showSecondary && secondaryPoints.length > 0 && (
          <>
            <path className="chart-area-path" d={toArea(secondaryPoints)} fill="rgba(99,102,241,0.08)" />
            <path
              className="chart-line-path"
              d={toPath(secondaryPoints)}
              fill="none"
              stroke="var(--color-primary-light)"
              strokeWidth="0.8"
              strokeDasharray="2 1"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}

        <path className="chart-area-path" d={toArea(primaryPoints)} fill="rgba(99,102,241,0.18)" />
        <path
          className="chart-line-path"
          d={toPath(primaryPoints)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />

        {primaryPoints.map((p, i) => (
          <circle
            key={data[i].label}
            cx={p.x}
            cy={p.y}
            r="1.2"
            fill="var(--color-primary)"
            style={{ animation: `scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.8 + i * 0.06}s backwards` }}
          />
        ))}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginTop: '4px' }}>
        {data.map((d) => (
          <span key={d.label} style={{ fontSize: '11px', color: 'var(--color-text-muted)', flex: 1, textAlign: 'center' }}>
            {d.label}
          </span>
        ))}
      </div>

      {showSecondary && (
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '16px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px' }} />
            Current — {formatNumber(data[data.length - 1]?.value ?? 0)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '16px', height: '3px', background: 'var(--color-primary-light)', borderRadius: '2px', borderTop: '1px dashed var(--color-primary)' }} />
            Previous — {formatNumber(data[data.length - 1]?.secondary ?? 0)}
          </span>
        </div>
      )}
    </div>
  );
});
