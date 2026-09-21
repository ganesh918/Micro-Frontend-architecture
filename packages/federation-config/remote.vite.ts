import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { federationShared, getBuildConfig } from './shared';

interface RemoteConfigOptions {
  name: string;
  port: number;
  exposes: Record<string, string>;
  dirname: string;
}

export function createRemoteConfig({ name, port, exposes, dirname }: RemoteConfigOptions) {
  return defineConfig(({ mode }) => {
    const isProd = mode === 'production';

    return {
      plugins: [
        react(),
        federation({
          name,
          filename: 'remoteEntry.js',
          exposes,
          shared: federationShared,
        }),
      ],
      resolve: {
        alias: {
          '@mfd/shared-types': path.resolve(dirname, '../../packages/shared-types/src'),
          '@mfd/shared-utils': path.resolve(dirname, '../../packages/shared-utils/src'),
          '@mfd/shared-auth': path.resolve(dirname, '../../packages/shared-auth/src'),
          '@mfd/shared-ui': path.resolve(dirname, '../../packages/shared-ui/src'),
        },
      },
      cacheDir: `node_modules/.vite-${name}`,
      server: { port, strictPort: true, cors: true, host: true },
      preview: { port, strictPort: true, cors: true, host: true },
      build: getBuildConfig(isProd),
    };
  });
}

export { loadEnv };
