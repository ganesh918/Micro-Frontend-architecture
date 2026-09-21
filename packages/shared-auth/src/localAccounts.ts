import type { AuthSession, LoginCredentials, SignupCredentials, User } from '@mfd/shared-types';

const LOCAL_ACCOUNTS_KEY = 'mfd-registered-accounts';

type StoredAccount = {
  user: User;
  password: string;
};

function readAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredAccount>) : {};
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, StoredAccount>): void {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createSession(user: User): AuthSession {
  return {
    user,
    tokens: {
      accessToken: `access_${user.id}_${Date.now()}`,
      refreshToken: `refresh_${user.id}_${Date.now()}`,
      expiresAt: Date.now() + 3600_000,
    },
  };
}

export function saveLocalAccount(credentials: SignupCredentials, user: User): void {
  const accounts = readAccounts();
  const email = normalizeEmail(credentials.email);
  accounts[email] = { user, password: credentials.password };
  writeAccounts(accounts);
}

export function loginFromLocalAccount(credentials: LoginCredentials): AuthSession | null {
  const email = normalizeEmail(credentials.email);
  const account = readAccounts()[email];
  if (!account || account.password !== credentials.password) {
    return null;
  }

  return createSession({
    ...account.user,
    lastLogin: new Date().toISOString(),
  });
}
