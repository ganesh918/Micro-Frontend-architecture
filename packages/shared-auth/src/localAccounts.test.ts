import { beforeEach, describe, expect, it } from 'vitest';
import { loginFromLocalAccount, normalizeEmail, saveLocalAccount } from './localAccounts';
import type { User } from '@mfd/shared-types';

const demoUser: User = {
  id: '99',
  email: 'demo@test.com',
  name: 'Demo User',
  role: 'viewer',
  status: 'active',
  createdAt: '2025-01-01T00:00:00Z',
};

describe('localAccounts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('normalizes email casing and whitespace', () => {
    expect(normalizeEmail('  Demo@Test.COM ')).toBe('demo@test.com');
  });

  it('persists and restores signup credentials locally', () => {
    saveLocalAccount(
      { name: 'Demo User', email: 'demo@test.com', password: 'secret12' },
      demoUser
    );

    const session = loginFromLocalAccount({ email: 'demo@test.com', password: 'secret12' });
    expect(session?.user.email).toBe('demo@test.com');
    expect(session?.tokens.accessToken).toMatch(/^access_99_/);
  });

  it('rejects invalid password', () => {
    saveLocalAccount(
      { name: 'Demo User', email: 'demo@test.com', password: 'secret12' },
      demoUser
    );

    expect(loginFromLocalAccount({ email: 'demo@test.com', password: 'wrong' })).toBeNull();
  });
});
