import { execSync } from 'child_process';
import { cpSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const remotes = [
  { module: 'auth', dest: 'auth' },
  { module: 'dashboard', dest: 'dashboard' },
  { module: 'user-management', dest: 'user-management' },
  { module: 'analytics', dest: 'analytics' },
  { module: 'notifications', dest: 'notifications' },
];

function run(command, extraEnv = {}) {
  execSync(command, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
    shell: true,
  });
}

console.log('Step 1/3: Building remote modules...');
run('npm run build:remotes');

console.log('Step 2/3: Building shell for production...');
run('npm run build -w @mfd/shell', {
  VITE_REMOTE_BASE_URL: '',
  VITE_API_BASE_URL: '/api',
});

const shellDist = path.join(root, 'apps/shell/dist');
const apiDir = path.join(root, 'api');
const apiServerSrc = path.join(root, 'apps/api-server/src/index.js');

console.log('Step 3/3: Packaging static remotes and API for Vercel...');

if (!existsSync(apiServerSrc)) {
  throw new Error(`Missing API source: ${apiServerSrc}`);
}

cpSync(apiServerSrc, path.join(apiDir, 'server.js'));
cpSync(
  path.join(root, 'apps/api-server/src/store.js'),
  path.join(apiDir, 'store.js')
);

for (const { module, dest } of remotes) {
  const src = path.join(root, 'modules', module, 'dist');
  const target = path.join(shellDist, dest);

  if (!existsSync(src)) {
    throw new Error(`Missing build output: ${src}`);
  }

  console.log(`Copying ${module} -> apps/shell/dist/${dest}/`);
  cpSync(src, target, { recursive: true });
}

console.log('Vercel build complete.');
