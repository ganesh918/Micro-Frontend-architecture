import { memo } from 'react';
import type { SystemHealthItem } from '@mfd/shared-types';
import { Badge } from '@mfd/shared-ui';
import { Activity } from 'lucide-react';

interface SystemHealthPanelProps {
  items: SystemHealthItem[];
}

const statusVariant = {
  operational: 'success' as const,
  degraded: 'warning' as const,
  down: 'error' as const,
};

export const SystemHealthPanel = memo(function SystemHealthPanel({ items }: SystemHealthPanelProps) {
  const operationalCount = items.filter((i) => i.status === 'operational').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
        <Activity size={16} color="var(--color-success)" />
        <span style={{ fontSize: '13px', fontWeight: 500 }}>
          {operationalCount}/{items.length} services operational
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="health-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 8px',
              borderBottom: idx < items.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{item.service}</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {item.latency}ms latency · {item.uptime}% uptime
              </p>
            </div>
            <Badge variant={statusVariant[item.status]} dot>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
});
