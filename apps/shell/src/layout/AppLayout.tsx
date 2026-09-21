import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@mfd/shared-utils';
import { subscribeEvent } from '@mfd/shared-utils';
import { useAuthStore } from '@mfd/shared-auth';
import { LogoutConfirmModal } from '../components/LogoutConfirmModal';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const unsubBadge = subscribeEvent('nav:badge-update', (event) => {
      setBadges((prev) => ({ ...prev, [event.payload.module]: event.payload.count }));
    });
    const unsubNotif = subscribeEvent('notification:new', (event) => {
      setBadges((prev) => ({ ...prev, notifications: event.payload.count }));
    });
    const unsubLogout = subscribeEvent('auth:logout', () => {
      setBadges({});
    });
    const unsubAnalytics = subscribeEvent('analytics:export', (event) => {
      navigate(`/analytics?report=${event.payload.reportId}`);
    });
    return () => { unsubBadge(); unsubNotif(); unsubLogout(); unsubAnalytics(); };
  }, [navigate]);

  const sidebarOffset = !isMobile && sidebarOpen ? 'var(--sidebar-width)' : '0';

  return (
    <div style={{ minHeight: '100vh' }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        badges={badges}
        onLogout={() => setLogoutConfirmOpen(true)}
      />
      <div
        style={{
          marginLeft: sidebarOffset,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left var(--transition-smooth)',
        }}
      >
        <Header
          onMenuClick={() => setSidebarOpen((o) => !o)}
          onLogout={() => setLogoutConfirmOpen(true)}
        />
        <main
          style={{
            flex: 1,
            padding: isMobile ? '16px' : '24px 32px',
          }}
        >
          <Outlet />
        </main>
      </div>
      <LogoutConfirmModal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          logout();
          setLogoutConfirmOpen(false);
        }}
      />
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 90,
          }}
        />
      )}
    </div>
  );
}
