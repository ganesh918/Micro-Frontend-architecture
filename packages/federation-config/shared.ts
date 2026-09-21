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

export function getRemoteEntries(baseUrl?: string): Record<string, string> {
  const base = baseUrl ?? import.meta.env?.VITE_REMOTE_BASE_URL ?? 'http://localhost';
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
