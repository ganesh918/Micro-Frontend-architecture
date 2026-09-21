import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { federationShared, getBuildConfig, getRemoteEntries } from '../../packages/federation-config/shared';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../..'), '');
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: getRemoteEntries(env.VITE_REMOTE_BASE_URL),
        shared: federationShared,
      }),
    ],
    resolve: {
      alias: {
        '@mfd/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
        '@mfd/shared-utils': path.resolve(__dirname, '../../packages/shared-utils/src'),
        '@mfd/shared-auth': path.resolve(__dirname, '../../packages/shared-auth/src'),
        '@mfd/shared-ui': path.resolve(__dirname, '../../packages/shared-ui/src'),
      },
    },
    cacheDir: 'node_modules/.vite-shell',
    server: {
      port: 5000,
      strictPort: true,
      host: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET ?? 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    build: getBuildConfig(isProd),
  };
});
