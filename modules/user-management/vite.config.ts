import { createRemoteConfig } from '../../packages/federation-config/remote.vite';

export default createRemoteConfig({
  name: 'userManagement',
  port: 5003,
  exposes: { './UsersPage': './src/UsersPage.tsx' },
  dirname: __dirname,
});
