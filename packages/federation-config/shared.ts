/** Shared Module Federation configuration used by shell and all remotes */

export const federationShared = {
  react: { singleton: true, requiredVersion: '^18.3.1' },
  'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
  'react-router-dom': { singleton: true, requiredVersion: '^6.28.2' },
  '@tanstack/react-query': { singleton: true, requiredVersion: '^5.66.0' },
  zustand: { singleton: true, requiredVersion: '^5.0.3' },
};

const REMOTE_PORTS: Record<string, number> = {
  auth: 5001,
  dashboard: 5002,
  userManagement: 5003,
  analytics: 5004,
  notifications: 5005,
};

const REMOTE_PATHS: Record<string, string> = {
  auth: '/auth',
  dashboard: '/dashboard',
  userManagement: '/user-management',
  analytics: '/analytics',
  notifications: '/notifications',
};

export function getRemoteEntries(baseUrl?: string, isProd = import.meta.env?.PROD): Record<string, string> {
  const configuredBase = baseUrl ?? import.meta.env?.VITE_REMOTE_BASE_URL;
  const useLocalhost = configuredBase === 'http://localhost';

  // Production (Vercel): serve remotes as static subfolders on the same origin
  if (isProd && !useLocalhost) {
    const origin = (configuredBase ?? '').replace(/\/$/, '');
    return Object.fromEntries(
      Object.entries(REMOTE_PATHS).map(([name, remotePath]) => [
        name,
        `${origin}${remotePath}/assets/remoteEntry.js`,
      ])
    );
  }

  // Development: each remote runs on its own port
  const base = configuredBase && configuredBase.length > 0 ? configuredBase : 'http://localhost';
  return Object.fromEntries(
    Object.entries(REMOTE_PORTS).map(([name, port]) => [
      name,
      `${base}:${port}/assets/remoteEntry.js`,
    ])
  );
}

export function getBuildConfig(isProd: boolean) {
  return {
    target: 'esnext' as const,
    minify: isProd,
    cssCodeSplit: false,
    modulePreload: isProd,
  };
}
