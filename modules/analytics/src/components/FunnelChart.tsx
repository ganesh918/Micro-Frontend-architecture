import { memo } from 'react';
import type { FunnelStep } from '@mfd/shared-types';
import { formatNumber } from '@mfd/shared-utils';

interface FunnelChartProps {
  steps: FunnelStep[];
}

export const FunnelChart = memo(function FunnelChart({ steps }: FunnelChartProps) {
  const maxValue = steps[0]?.value ?? 1;

  return (
    <div className="funnel-steps" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {steps.map((step, idx) => {
        const widthPct = Math.max((step.value / maxValue) * 100, 12);
        const opacity = 1 - idx * 0.12;

        return (
          <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              className="funnel-step"
              style={{
                width: `${widthPct}%`,
                minWidth: '120px',
                padding: '12px 16px',
                background: `rgba(99, 102, 241, ${opacity})`,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: idx < 2 ? '#fff' : 'var(--color-text)' }}>{step.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: idx < 2 ? '#fff' : 'var(--color-text)' }}>{formatNumber(step.value)}</span>
            </div>
            {idx < steps.length - 1 && (
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                ↓ {steps[idx + 1].conversionRate}% conversion
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});
