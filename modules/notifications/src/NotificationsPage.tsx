import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { api, formatRelativeTime, publishEvent } from '@mfd/shared-utils';
import type { Notification } from '@mfd/shared-types';
import { Badge, Button, Card, EmptyState, ErrorState, Skeleton } from '@mfd/shared-ui';

const typeConfig: Record<Notification['type'], { icon: React.ReactNode; variant: 'info' | 'success' | 'warning' | 'error' }> = {
  info: { icon: <Info size={18} />, variant: 'info' },
  success: { icon: <CheckCircle size={18} />, variant: 'success' },
  warning: { icon: <AlertTriangle size={18} />, variant: 'warning' },
  error: { icon: <XCircle size={18} />, variant: 'error' },
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<Notification[]>('/notifications'),
    refetchInterval: 30_000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch<Notification>(`/notifications/${id}/read`),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      publishEvent('notification:read', { id: updated.id }, 'notifications');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      publishEvent('nav:badge-update', { module: 'notifications', count: 0 }, 'notifications');
    },
  });

  useEffect(() => {
    if (notificationsQuery.data) {
      const unread = notificationsQuery.data.filter((n) => !n.read).length;
      publishEvent('nav:badge-update', { module: 'notifications', count: unread }, 'notifications');
      publishEvent('notification:new', { count: unread }, 'notifications');
    }
  }, [notificationsQuery.data]);

  if (notificationsQuery.isLoading) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}><h1 style={{ fontSize: '24px', fontWeight: 700 }}>Notifications</h1></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="sm"><Skeleton height={60} /></Card>
          ))}
        </div>
      </div>
    );
  }
  if (notificationsQuery.isError) {
    return <ErrorState title="Failed to load notifications" onRetry={() => notificationsQuery.refetch()} />;
  }

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Notifications</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCheck size={14} />}
            loading={markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell size={48} />}
            title="No notifications"
            description="You're all caught up. New notifications will appear here."
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((notification) => {
            const config = typeConfig[notification.type];
            return (
              <Card
                key={notification.id}
                padding="sm"
                style={{
                  opacity: notification.read ? 0.7 : 1,
                  borderLeft: notification.read ? undefined : '3px solid var(--color-primary)',
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--color-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {config.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{notification.title}</span>
                      <Badge variant={config.variant}>{notification.type}</Badge>
                      {!notification.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {notification.message}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markReadMutation.mutate(notification.id)}
                      loading={markReadMutation.isPending}
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
