import { memo } from 'react';
import type { TrafficSource } from '@mfd/shared-types';
import { formatPercent } from '@mfd/shared-utils';

interface ChannelChartProps {
  channels: TrafficSource[];
}

export const ChannelChart = memo(function ChannelChart({ channels }: ChannelChartProps) {
  const max = Math.max(...channels.map((c) => c.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {channels.map((channel, idx) => (
        <div key={channel.id} className="channel-bar-row" style={{ animationDelay: `${idx * 0.08}s` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{channel.label}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{channel.value}%</span>
              <span style={{ fontSize: '11px', color: channel.change >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                {channel.change >= 0 ? '+' : ''}{formatPercent(channel.change)}
              </span>
            </div>
          </div>
          <div style={{ height: '10px', background: 'var(--color-bg)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              className="channel-bar-fill"
              style={{
                height: '100%',
                width: `${(channel.value / max) * 100}%`,
                background: channel.color,
                borderRadius: '999px',
                animationDelay: `${idx * 0.1}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});
