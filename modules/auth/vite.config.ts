import { createRemoteConfig } from '../../packages/federation-config/remote.vite';

export default createRemoteConfig({
  name: 'auth',
  port: 5001,
  exposes: {
    './AuthContainer': './src/AuthContainer.tsx',
    './LoginPage': './src/LoginPage.tsx',
    './SignupPage': './src/SignupPage.tsx',
  },
  dirname: __dirname,
});
