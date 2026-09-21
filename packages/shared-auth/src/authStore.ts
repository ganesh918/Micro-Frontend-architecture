import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession, LoginCredentials, SignupCredentials, User } from '@mfd/shared-types';
import { api, ApiClientError, getRuntimeSingleton, publishEvent } from '@mfd/shared-utils';
import { loginFromLocalAccount, normalizeEmail, saveLocalAccount } from './localAccounts';

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  hasRole: (...roles: User['role'][]) => boolean;
}

type AuthStore = UseBoundStore<StoreApi<AuthState>>;

function createAuthStore(): AuthStore {
  return create<AuthState>()(
    persist(
      (set, get) => ({
        session: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          const payload = {
            email: normalizeEmail(credentials.email),
            password: credentials.password,
          };

          try {
            const session = await api.post<AuthSession>('/auth/login', payload, { skipAuth: true });
            set({ session, isAuthenticated: true, isLoading: false });
            publishEvent('auth:login', { userId: session.user.id }, 'auth');
            publishEvent('toast:show', { message: `Welcome back, ${session.user.name}!`, type: 'success' }, 'auth');
          } catch (err) {
            const canUseLocalFallback =
              err instanceof ApiClientError && err.code === 'AUTH_FAILED';
            const localSession = canUseLocalFallback ? loginFromLocalAccount(payload) : null;

            if (localSession) {
              set({ session: localSession, isAuthenticated: true, isLoading: false });
              publishEvent('auth:login', { userId: localSession.user.id }, 'auth');
              publishEvent('toast:show', { message: `Welcome back, ${localSession.user.name}!`, type: 'success' }, 'auth');
              return;
            }

            const message = err instanceof Error ? err.message : 'Login failed';
            set({ error: message, isLoading: false, isAuthenticated: false });
            throw err;
          }
        },

        signup: async (credentials) => {
          set({ isLoading: true, error: null });
          const payload = {
            name: credentials.name.trim(),
            email: normalizeEmail(credentials.email),
            password: credentials.password,
          };

          try {
            const session = await api.post<AuthSession>('/auth/signup', payload, { skipAuth: true });
            saveLocalAccount(payload, session.user);
            set({ session, isAuthenticated: true, isLoading: false });
            publishEvent('auth:login', { userId: session.user.id }, 'auth');
            publishEvent('toast:show', { message: `Welcome, ${session.user.name}!`, type: 'success' }, 'auth');
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Signup failed';
            set({ error: message, isLoading: false, isAuthenticated: false });
            throw err;
          }
        },

        logout: () => {
          const userId = get().session?.user.id;
          set({ session: null, isAuthenticated: false, error: null });
          if (userId) {
            api.post('/auth/logout').catch(() => undefined);
          }
          publishEvent('auth:logout', null, 'auth');
          publishEvent('toast:show', { message: 'Signed out successfully', type: 'info' }, 'auth');
        },

        refreshSession: async () => {
          const { session } = get();
          if (!session?.tokens.refreshToken) return;

          try {
            const updated = await api.post<AuthSession>('/auth/refresh', {
              refreshToken: session.tokens.refreshToken,
            });
            set({ session: updated, isAuthenticated: true });
          } catch {
            set({ session: null, isAuthenticated: false });
            publishEvent('auth:session-expired', null, 'auth');
          }
        },

        clearError: () => set({ error: null }),

        hasRole: (...roles) => {
          const role = get().session?.user.role;
          return role ? roles.includes(role) : false;
        },
      }),
      {
        name: 'mfd-auth-storage',
        partialize: (state) => ({
          session: state.session,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  );
}

function getStore(): AuthStore {
  return getRuntimeSingleton('authStore', createAuthStore);
}

export const useAuthStore: AuthStore = new Proxy((() => undefined) as unknown as AuthStore, {
  apply(_target, _thisArg, args) {
    return (getStore() as (...a: unknown[]) => unknown)(...args);
  },
  get(_target, prop) {
    const store = getStore();
    const value = store[prop as keyof AuthStore];
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(store) : value;
  },
});

export function getCurrentUser(): User | null {
  return getStore().getState().session?.user ?? null;
}
