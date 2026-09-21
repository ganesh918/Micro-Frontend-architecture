import { createRemoteConfig } from '../../packages/federation-config/remote.vite';

export default createRemoteConfig({
  name: 'notifications',
  port: 5005,
  exposes: { './NotificationsPage': './src/NotificationsPage.tsx' },
  dirname: __dirname,
});
