import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bell,
  X,
  Layers,
  LogOut,
} from 'lucide-react';
import { useIsMobile } from '@mfd/shared-utils';
import { APP_NAV_ITEMS } from '@mfd/shared-auth';

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={20} />,
  users: <Users size={20} />,
  analytics: <BarChart3 size={20} />,
  notifications: <Bell size={20} />,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  badges: Record<string, number>;
  onLogout: () => void;
}

export function Sidebar({ open, onClose, badges, onLogout }: SidebarProps) {
  const isMobile = useIsMobile();
  const navItems = APP_NAV_ITEMS;

  return (
    <aside
      className="mfd-sidebar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 'var(--sidebar-width)',
        height: '100vh',
        color: 'var(--color-sidebar-text-active)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--transition-smooth), box-shadow var(--transition-smooth), background-color var(--transition-smooth), color var(--transition-smooth)',
        overflow: 'hidden',
        zIndex: isMobile ? 100 : 50,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: open ? 'var(--shadow-lg)' : 'none',
        borderRight: '1px solid var(--color-sidebar-border)',
      }}
    >
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-sidebar-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={24} color="var(--color-sidebar-brand)" />
          <span style={{ fontWeight: 700, fontSize: '18px', whiteSpace: 'nowrap' }}>MFD Platform</span>
        </div>
        {isMobile && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-sidebar-text)', padding: '4px' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const badge = badges[item.module] ?? badges[item.id];
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                `sidebar-nav-link${isActive ? ' sidebar-nav-link--active' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                background: isActive ? 'var(--color-sidebar-hover)' : 'transparent',
              })}
            >
              <span className="sidebar-nav-icon">{iconMap[item.icon]}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge != null && badge > 0 && (
                <span
                  style={{
                    background: 'var(--color-error)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '1px 7px',
                    borderRadius: '999px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '12px', borderTop: '1px solid var(--color-sidebar-border)' }}>
        <button
          type="button"
          className="sidebar-nav-link sidebar-nav-link--logout"
          onClick={() => {
            onLogout();
            if (isMobile) onClose();
          }}
        >
          <span className="sidebar-nav-icon"><LogOut size={20} /></span>
          <span style={{ flex: 1 }}>Logout</span>
        </button>
      </div>

      <div style={{ padding: '12px 24px 16px', fontSize: '12px', color: 'var(--color-sidebar-muted)' }}>
        Micro-Frontend v1.0
      </div>
    </aside>
  );
}
