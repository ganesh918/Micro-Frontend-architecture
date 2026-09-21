import { describe, expect, it } from 'vitest';
import { APP_NAV_ITEMS, canAccessRoute, filterNavByRole } from './navigation';

describe('navigation RBAC', () => {
  it('shows all items to admin', () => {
    const items = filterNavByRole(APP_NAV_ITEMS, (...roles) => roles.includes('admin'));
    expect(items).toHaveLength(4);
  });

  it('shows all items to viewer when no roles are configured', () => {
    const items = filterNavByRole(APP_NAV_ITEMS, (...roles) => roles.includes('viewer'));
    expect(items).toHaveLength(4);
  });

  it('allows any role to access all routes by default', () => {
    expect(canAccessRoute('/users', 'viewer')).toBe(true);
    expect(canAccessRoute('/analytics', 'viewer')).toBe(true);
  });
});
