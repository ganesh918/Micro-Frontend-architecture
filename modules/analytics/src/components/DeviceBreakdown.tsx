import { memo } from 'react';
import type { DeviceStat } from '@mfd/shared-types';
import { formatNumber } from '@mfd/shared-utils';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface DeviceBreakdownProps {
  devices: DeviceStat[];
}

const deviceIcons: Record<string, React.ReactNode> = {
  Desktop: <Monitor size={18} />,
  Mobile: <Smartphone size={18} />,
  Tablet: <Tablet size={18} />,
};

const deviceColors: Record<string, string> = {
  Desktop: 'var(--color-primary)',
  Mobile: 'var(--color-secondary)',
  Tablet: 'var(--color-success)',
};

export const DeviceBreakdown = memo(function DeviceBreakdown({ devices }: DeviceBreakdownProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {devices.map((device, idx) => (
        <div key={device.device} className="progress-row channel-bar-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ color: deviceColors[device.device] ?? 'var(--color-primary)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }} className="device-icon">
              {deviceIcons[device.device] ?? <Monitor size={18} />}
            </span>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{device.device}</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{device.percentage}%</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{formatNumber(device.sessions)} sessions</span>
          </div>
          <div style={{ height: '8px', background: 'var(--color-bg)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              className="progress-bar-fill channel-bar-fill"
              style={{
                height: '100%',
                width: `${device.percentage}%`,
                background: deviceColors[device.device] ?? 'var(--color-primary)',
                borderRadius: '999px',
                animationDelay: `${idx * 0.12}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});
