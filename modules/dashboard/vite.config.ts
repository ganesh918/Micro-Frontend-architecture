import { createRemoteConfig } from '../../packages/federation-config/remote.vite';

export default createRemoteConfig({
  name: 'dashboard',
  port: 5002,
  exposes: { './DashboardPage': './src/DashboardPage.tsx' },
  dirname: __dirname,
});
