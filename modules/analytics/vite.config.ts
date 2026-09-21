import { createRemoteConfig } from '../../packages/federation-config/remote.vite';

export default createRemoteConfig({
  name: 'analytics',
  port: 5004,
  exposes: { './AnalyticsPage': './src/AnalyticsPage.tsx' },
  dirname: __dirname,
});
