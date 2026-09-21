import { memo } from 'react';
import type { TrafficSource } from '@mfd/shared-types';
import { formatPercent } from '@mfd/shared-utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface TrafficSourcesChartProps {
  sources: TrafficSource[];
}

export const TrafficSourcesChart = memo(function TrafficSourcesChart({ sources }: TrafficSourcesChartProps) {
  const total = sources.reduce((sum, s) => sum + s.value, 0);

  let cumulative = 0;
  const segments = sources.map((source) => {
    const start = cumulative;
    cumulative += (source.value / total) * 360;
    return { ...source, start, end: cumulative };
  });

  const describeArc = (start: number, end: number) => {
    const r = 40;
    const cx = 50;
    const cy = 50;
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((end - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <svg viewBox="0 0 100 100" style={{ width: '140px', height: '140px', flexShrink: 0 }}>
          {segments.map((seg) => (
            <path
              key={seg.id}
              className="donut-segment"
              d={describeArc(seg.start, seg.end)}
              fill={seg.color}
              opacity={0.9}
            />
          ))}
          <circle cx="50" cy="50" r="24" fill="var(--color-surface)" />
          <text x="50" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--color-text)">
            {total}%
          </text>
        </svg>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }}>
          {sources.map((source) => (
            <div key={source.id} className="list-row-hover channel-bar-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: source.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>{source.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{source.value}%</span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '11px',
                  color: source.change >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                }}
              >
                {source.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {formatPercent(Math.abs(source.change))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
