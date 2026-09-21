import { memo } from 'react';
import { User, AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import type { ActivityItem } from '@mfd/shared-types';
import { EmptyState } from '@mfd/shared-ui';

interface ActivityFeedProps {
  activities: ActivityItem[];
  formatTime: (date: string) => string;
}

const iconMap: Record<ActivityItem['type'], { icon: React.ReactNode; color: string }> = {
  user: { icon: <User size={14} />, color: 'var(--color-primary)' },
  system: { icon: <RefreshCw size={14} />, color: 'var(--color-secondary)' },
  alert: { icon: <AlertTriangle size={14} />, color: 'var(--color-accent)' },
  update: { icon: <Settings size={14} />, color: 'var(--color-tertiary)' },
};

export const ActivityFeed = memo(function ActivityFeed({ activities, formatTime }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        title="No recent activity"
        description="Platform events and user actions will appear here."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {activities.map((activity, idx) => {
        const { icon, color } = iconMap[activity.type];
        return (
          <div
            key={activity.id}
            className="activity-item"
            style={{
              display: 'flex',
              gap: '12px',
              padding: '14px 0',
              borderBottom: idx < activities.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div
              className="activity-icon"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `${color}15`,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{activity.title}</p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{activity.description}</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
});
