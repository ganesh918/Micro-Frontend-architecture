import { memo } from 'react';
import type { GoalProgress } from '@mfd/shared-types';
import { formatNumber } from '@mfd/shared-utils';

interface GoalProgressPanelProps {
  goals: GoalProgress[];
}

export const GoalProgressPanel = memo(function GoalProgressPanel({ goals }: GoalProgressPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {goals.map((goal, idx) => {
        const pct = Math.min((goal.current / goal.target) * 100, 100);
        const isCurrency = goal.unit === '$';
        const formatVal = (v: number) => (isCurrency ? `$${formatNumber(v)}` : `${formatNumber(v)}${goal.unit ?? ''}`);

        return (
          <div key={goal.id} className="progress-row" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{goal.label}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {formatVal(goal.current)} / {formatVal(goal.target)}
              </span>
            </div>
            <div style={{ height: '8px', background: 'var(--color-bg)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                className="progress-bar-fill"
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: pct >= 90 ? 'var(--color-success)' : pct >= 70 ? 'var(--color-primary)' : '#f59e0b',
                  borderRadius: '999px',
                  animationDelay: `${idx * 0.12}s`,
                }}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {pct.toFixed(0)}% of target reached
            </p>
          </div>
        );
      })}
    </div>
  );
});
