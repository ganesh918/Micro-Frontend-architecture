import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { formatNumber, formatPercent } from '@mfd/shared-utils';

interface MetricCardProps {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
  prefix?: string;
}

export function MetricCard({ label, value, change, trend, unit, prefix }: MetricCardProps) {
  const trendColor =
    trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-error)' : 'var(--color-text-muted)';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="mfd-metric-card">
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '8px' }}>
        {label}
      </p>
      <p className="mfd-metric-value" style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
        {prefix}{formatNumber(value)}{unit && <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-muted)' }}>{unit}</span>}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: trendColor, fontSize: '13px', fontWeight: 500 }}>
        <TrendIcon size={14} />
        <span>{formatPercent(change)}</span>
        <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>vs last period</span>
      </div>
    </div>
  );
}
