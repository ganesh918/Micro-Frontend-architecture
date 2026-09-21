import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Bell, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@mfd/shared-auth';
import { Avatar, Badge, Button } from '@mfd/shared-ui';
import { useQuery } from '@tanstack/react-query';
import { api, useIsMobile, useTheme } from '@mfd/shared-utils';
import type { Notification } from '@mfd/shared-types';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

export function Header({ onMenuClick, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { session } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const user = session?.user;

  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.get<Notification[]>('/notifications', { unreadOnly: 'true' }),
    refetchInterval: 60_000,
  });

  const unreadCount = notifications?.length ?? 0;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 'var(--header-height)',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : '0 24px',
        flexShrink: 0,
      }}
    >
      <button
        onClick={onMenuClick}
        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: '8px', display: 'flex' }}
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            padding: '8px',
            display: 'flex',
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={() => navigate('/notifications')}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            padding: '8px',
            display: 'flex',
          }}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                background: 'var(--color-error)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar name={user.name} size={isMobile ? 30 : 34} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {!isMobile && <span style={{ fontSize: '14px', fontWeight: 500 }}>{user.name}</span>}
              <Badge
                variant={user.role === 'admin' ? 'info' : user.role === 'manager' ? 'warning' : 'default'}
              >
                {user.role}
              </Badge>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          leftIcon={<LogOut size={16} />}
          onClick={onLogout}
          aria-label="Logout"
        >
          {!isMobile && 'Logout'}
        </Button>
      </div>
    </header>
  );
}
