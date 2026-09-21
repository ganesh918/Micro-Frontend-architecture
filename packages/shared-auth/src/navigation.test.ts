import { describe, expect, it } from 'vitest';
import { APP_NAV_ITEMS, canAccessRoute, filterNavByRole } from './navigation';

describe('navigation RBAC', () => {
  it('shows all items to admin', () => {
    const items = filterNavByRole(APP_NAV_ITEMS, (...roles) => roles.includes('admin'));
    expect(items).toHaveLength(4);
  });

  it('hides restricted items from viewer', () => {
    const items = filterNavByRole(APP_NAV_ITEMS, (...roles) => roles.includes('viewer'));
    expect(items.map((item) => item.id)).toEqual(['dashboard', 'notifications']);
  });

  it('allows manager to access user management', () => {
    expect(canAccessRoute('/users', 'manager')).toBe(true);
    expect(canAccessRoute('/users', 'viewer')).toBe(false);
  });
});
