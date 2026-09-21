import type { NavItem, User } from '@mfd/shared-types';

export const APP_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'dashboard', module: 'dashboard' },
  {
    id: 'users',
    label: 'User Management',
    path: '/users',
    icon: 'users',
    module: 'user-management',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'analytics',
    module: 'analytics',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'notifications',
    module: 'notifications',
  },
];

export function filterNavByRole(
  items: NavItem[],
  hasRole: (...roles: User['role'][]) => boolean
): NavItem[] {
  return items.filter((item) => !item.roles?.length || hasRole(...item.roles));
}

export function canAccessRoute(path: string, role: User['role'] | undefined): boolean {
  const item = APP_NAV_ITEMS.find((entry) => entry.path === path);
  if (!item?.roles?.length) return true;
  return role ? item.roles.includes(role) : false;
}
