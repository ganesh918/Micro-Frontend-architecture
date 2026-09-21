import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { createAccountStore } from './store.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/signup'];

function authenticate(req, res, next) {
  if (PUBLIC_PATHS.includes(req.path)) return next();
  if (!req.path.startsWith('/api/')) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required', code: 'UNAUTHORIZED' });
  }

  const token = authHeader.slice(7);
  if (!token.startsWith('access_')) {
    return res.status(401).json({ message: 'Invalid or expired token', code: 'INVALID_TOKEN' });
  }

  req.userId = token.split('_')[1];
  next();
}

app.use(authenticate);

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const SEED_USERS = [
  { id: '1', email: 'admin@mfd.io', name: 'Alex Admin', role: 'admin', department: 'Engineering', status: 'active', createdAt: '2024-01-15T10:00:00Z', lastLogin: '2025-09-17T08:30:00Z' },
  { id: '2', email: 'manager@mfd.io', name: 'Morgan Manager', role: 'manager', department: 'Operations', status: 'active', createdAt: '2024-03-20T10:00:00Z', lastLogin: '2025-09-16T14:20:00Z' },
  { id: '3', email: 'viewer@mfd.io', name: 'Victor Viewer', role: 'viewer', department: 'Sales', status: 'active', createdAt: '2024-06-10T10:00:00Z', lastLogin: '2025-09-15T09:00:00Z' },
  { id: '4', email: 'sarah@mfd.io', name: 'Sarah Chen', role: 'manager', department: 'Marketing', status: 'active', createdAt: '2024-08-01T10:00:00Z', lastLogin: '2025-09-14T16:45:00Z' },
  { id: '5', email: 'james@mfd.io', name: 'James Wilson', role: 'viewer', department: 'Support', status: 'inactive', createdAt: '2024-09-12T10:00:00Z' },
  { id: '6', email: 'emma@mfd.io', name: 'Emma Davis', role: 'viewer', department: 'HR', status: 'pending', createdAt: '2025-09-10T10:00:00Z' },
  { id: '7', email: 'priya@mfd.io', name: 'Priya Patel', role: 'manager', department: 'Finance', status: 'active', createdAt: '2024-10-05T10:00:00Z', lastLogin: '2025-09-13T11:20:00Z' },
  { id: '8', email: 'david@mfd.io', name: 'David Kim', role: 'viewer', department: 'Engineering', status: 'active', createdAt: '2024-11-18T10:00:00Z', lastLogin: '2025-09-12T09:45:00Z' },
  { id: '9', email: 'lisa@mfd.io', name: 'Lisa Rodriguez', role: 'admin', department: 'Product', status: 'active', createdAt: '2025-01-08T10:00:00Z', lastLogin: '2025-09-11T15:10:00Z' },
  { id: '10', email: 'michael@mfd.io', name: 'Michael Brown', role: 'viewer', department: 'Sales', status: 'inactive', createdAt: '2025-02-14T10:00:00Z' },
  { id: '11', email: 'nina@mfd.io', name: 'Nina Okonkwo', role: 'manager', department: 'Support', status: 'active', createdAt: '2025-03-22T10:00:00Z', lastLogin: '2025-09-10T13:30:00Z' },
  { id: '12', email: 'tom@mfd.io', name: 'Tom Anderson', role: 'viewer', department: 'Marketing', status: 'pending', createdAt: '2025-05-01T10:00:00Z' },
  { id: '13', email: 'rachel@mfd.io', name: 'Rachel Green', role: 'viewer', department: 'Operations', status: 'active', createdAt: '2025-06-17T10:00:00Z', lastLogin: '2025-09-09T10:05:00Z' },
  { id: '14', email: 'chris@mfd.io', name: 'Chris Taylor', role: 'manager', department: 'HR', status: 'active', createdAt: '2025-07-03T10:00:00Z', lastLogin: '2025-09-08T17:40:00Z' },
  { id: '15', email: 'sofia@mfd.io', name: 'Sofia Martinez', role: 'viewer', department: 'Finance', status: 'active', createdAt: '2025-08-19T10:00:00Z', lastLogin: '2025-09-07T08:55:00Z' },
  { id: '16', email: 'ryan@mfd.io', name: 'Ryan O\'Connor', role: 'viewer', department: 'Product', status: 'pending', createdAt: '2025-09-01T10:00:00Z' },
];

/** @type {Record<string, { password: string, userId: string }>} */
const SEED_CREDENTIALS = {
  'admin@mfd.io': { password: 'admin123', userId: '1' },
  'manager@mfd.io': { password: 'manager123', userId: '2' },
  'viewer@mfd.io': { password: 'viewer123', userId: '3' },
};

const accountStore = createAccountStore(SEED_USERS, SEED_CREDENTIALS);

function getUsers() {
  return accountStore.getUsers();
}

function normalizeEmail(email) {
  return email?.trim().toLowerCase() ?? '';
}

let notifications = [
  { id: 'n1', title: 'System Update', message: 'Dashboard v2.1 deployed successfully.', type: 'success', read: false, createdAt: '2025-09-17T07:00:00Z' },
  { id: 'n2', title: 'New User Registration', message: 'Emma Davis has registered and awaits approval.', type: 'info', read: false, createdAt: '2025-09-17T06:30:00Z' },
  { id: 'n3', title: 'High Traffic Alert', message: 'API response times exceeded threshold.', type: 'warning', read: false, createdAt: '2025-09-16T22:00:00Z' },
  { id: 'n4', title: 'Backup Complete', message: 'Daily database backup finished.', type: 'success', read: true, createdAt: '2025-09-16T03:00:00Z' },
  { id: 'n5', title: 'Failed Login Attempts', message: 'Multiple failed login attempts detected.', type: 'error', read: true, createdAt: '2025-09-15T18:00:00Z' },
  { id: 'n6', title: 'New User Registration', message: 'Ryan O\'Connor signed up and is pending review.', type: 'info', read: false, createdAt: '2025-09-17T05:45:00Z' },
  { id: 'n7', title: 'Analytics Report Ready', message: 'Your weekly performance report is ready to download.', type: 'info', read: false, createdAt: '2025-09-17T04:20:00Z' },
  { id: 'n8', title: 'Role Updated', message: 'Sarah Chen\'s role was changed to Manager.', type: 'info', read: false, createdAt: '2025-09-16T20:15:00Z' },
  { id: 'n9', title: 'Storage Warning', message: 'Disk usage reached 85% on the primary server.', type: 'warning', read: false, createdAt: '2025-09-16T19:00:00Z' },
  { id: 'n10', title: 'Export Completed', message: 'User list exported to CSV successfully.', type: 'success', read: true, createdAt: '2025-09-16T17:30:00Z' },
  { id: 'n11', title: 'New User Registration', message: 'Tom Anderson joined the Marketing team.', type: 'info', read: true, createdAt: '2025-09-16T15:10:00Z' },
  { id: 'n12', title: 'Payment Gateway Error', message: 'Stripe webhook delivery failed 3 times.', type: 'error', read: false, createdAt: '2025-09-16T14:05:00Z' },
  { id: 'n13', title: 'Scheduled Maintenance', message: 'Maintenance window scheduled for Sep 20, 2:00 AM UTC.', type: 'warning', read: true, createdAt: '2025-09-16T12:00:00Z' },
  { id: 'n14', title: 'Security Scan Complete', message: 'No vulnerabilities found in the latest dependency scan.', type: 'success', read: true, createdAt: '2025-09-16T09:30:00Z' },
  { id: 'n15', title: 'User Deactivated', message: 'James Wilson\'s account was set to inactive.', type: 'warning', read: true, createdAt: '2025-09-15T16:45:00Z' },
  { id: 'n16', title: 'New Comment', message: 'Lisa Rodriguez commented on the Q3 roadmap document.', type: 'info', read: true, createdAt: '2025-09-15T14:20:00Z' },
  { id: 'n17', title: 'Integration Connected', message: 'Slack workspace linked successfully.', type: 'success', read: false, createdAt: '2025-09-15T11:00:00Z' },
  { id: 'n18', title: 'API Rate Limit', message: 'Analytics API hit 90% of its hourly rate limit.', type: 'warning', read: true, createdAt: '2025-09-14T23:40:00Z' },
  { id: 'n19', title: 'Password Reset Request', message: 'David Kim requested a password reset link.', type: 'info', read: true, createdAt: '2025-09-14T20:15:00Z' },
  { id: 'n20', title: 'Deployment Failed', message: 'Staging deploy for notifications module failed.', type: 'error', read: true, createdAt: '2025-09-14T18:00:00Z' },
];

const activities = [
  { id: 'a1', type: 'user', title: 'New user registered', description: 'Emma Davis joined the platform', timestamp: '2025-09-17T06:30:00Z', userId: '6' },
  { id: 'a2', type: 'system', title: 'Deployment completed', description: 'v2.1.0 deployed to production', timestamp: '2025-09-17T07:00:00Z' },
  { id: 'a3', type: 'alert', title: 'Performance warning', description: 'API latency spike detected on /dashboard/metrics', timestamp: '2025-09-16T22:00:00Z' },
  { id: 'a4', type: 'update', title: 'Settings changed', description: 'Notification preferences updated by Morgan Manager', timestamp: '2025-09-16T14:20:00Z', userId: '2' },
  { id: 'a5', type: 'user', title: 'Role updated', description: 'Sarah Chen promoted to manager', timestamp: '2025-09-15T11:00:00Z', userId: '4' },
  { id: 'a6', type: 'system', title: 'Backup completed', description: 'Daily database backup finished in 4m 12s', timestamp: '2025-09-17T03:00:00Z' },
  { id: 'a7', type: 'user', title: 'Bulk import finished', description: '142 customer records imported successfully', timestamp: '2025-09-16T18:45:00Z', userId: '1' },
  { id: 'a8', type: 'alert', title: 'Failed login attempts', description: '12 failed attempts from IP 192.168.1.45', timestamp: '2025-09-16T16:10:00Z' },
  { id: 'a9', type: 'update', title: 'Report exported', description: 'Weekly Performance report exported to CSV', timestamp: '2025-09-16T11:30:00Z', userId: '2' },
  { id: 'a10', type: 'system', title: 'Cache warmed', description: 'Analytics cache preloaded for 30-day window', timestamp: '2025-09-16T09:00:00Z' },
];

function createTokens(userId) {
  return {
    accessToken: `access_${userId}_${Date.now()}`,
    refreshToken: `refresh_${userId}_${Date.now()}`,
    expiresAt: Date.now() + 3600_000,
  };
}

function paginate(arr, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return {
    data: arr.slice(start, start + pageSize),
    total: arr.length,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(arr.length / pageSize),
  };
}

app.post('/api/auth/signup', async (req, res) => {
  await delay();
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name?.trim() || !normalizedEmail || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required', code: 'VALIDATION_ERROR' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters', code: 'VALIDATION_ERROR' });
  }
  if (accountStore.findCredentials(normalizedEmail)) {
    return res.status(409).json({ message: 'An account with this email already exists', code: 'EMAIL_EXISTS' });
  }

  const id = String(Date.now());
  const user = {
    id,
    email: normalizedEmail,
    name: name.trim(),
    role: 'viewer',
    department: 'General',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  accountStore.registerUser(user, password);

  activities.unshift({
    id: `a${Date.now()}`,
    type: 'user',
    title: 'New user registered',
    description: `${user.name} joined the platform`,
    timestamp: new Date().toISOString(),
    userId: id,
  });

  res.status(201).json({ user, tokens: createTokens(user.id) });
});

app.post('/api/auth/login', async (req, res) => {
  await delay();
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const cred = accountStore.findCredentials(normalizedEmail);
  if (!cred || cred.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password', code: 'AUTH_FAILED' });
  }
  const user = accountStore.findUserById(cred.userId);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password', code: 'AUTH_FAILED' });
  }
  user.lastLogin = new Date().toISOString();
  res.json({ user, tokens: createTokens(user.id) });
});

app.post('/api/auth/logout', (_req, res) => res.status(204).end());
app.post('/api/auth/refresh', async (req, res) => {
  await delay(200);
  const user = getUsers()[0];
  res.json({ user, tokens: createTokens(user.id) });
});

app.get('/api/dashboard/metrics', async (_req, res) => {
  await delay();
  res.json([
    { id: 'm1', label: 'Total Revenue', value: 284500, change: 12.5, trend: 'up' },
    { id: 'm2', label: 'Active Users', value: 3842, change: 8.2, trend: 'up' },
    { id: 'm3', label: 'Conversion Rate', value: 3.24, change: -0.8, trend: 'down', unit: '%' },
    { id: 'm4', label: 'Avg. Session', value: 4.7, change: 2.1, trend: 'up', unit: 'min' },
    { id: 'm5', label: 'Orders', value: 1847, change: 15.3, trend: 'up' },
    { id: 'm6', label: 'New Signups', value: 326, change: 22.4, trend: 'up' },
    { id: 'm7', label: 'Churn Rate', value: 2.1, change: -0.4, trend: 'up', unit: '%' },
    { id: 'm8', label: 'Support Tickets', value: 47, change: -18.2, trend: 'up' },
  ]);
});

app.get('/api/dashboard/activities', async (_req, res) => {
  await delay(300);
  res.json(activities);
});

app.get('/api/dashboard/chart', async (_req, res) => {
  await delay();
  res.json([
    { label: 'Jan', value: 18200, secondary: 16400 },
    { label: 'Feb', value: 21500, secondary: 18200 },
    { label: 'Mar', value: 19800, secondary: 20100 },
    { label: 'Apr', value: 24100, secondary: 19800 },
    { label: 'May', value: 26800, secondary: 22400 },
    { label: 'Jun', value: 25200, secondary: 24100 },
    { label: 'Jul', value: 28900, secondary: 25200 },
    { label: 'Aug', value: 31200, secondary: 26800 },
    { label: 'Sep', value: 28450, secondary: 29500 },
  ]);
});

app.get('/api/dashboard/chart-weekly', async (_req, res) => {
  await delay(200);
  res.json([
    { label: 'Mon', value: 4200, secondary: 3800 },
    { label: 'Tue', value: 5100, secondary: 4200 },
    { label: 'Wed', value: 4800, secondary: 4500 },
    { label: 'Thu', value: 6200, secondary: 5100 },
    { label: 'Fri', value: 5800, secondary: 4900 },
    { label: 'Sat', value: 3200, secondary: 2800 },
    { label: 'Sun', value: 2900, secondary: 2600 },
  ]);
});

app.get('/api/dashboard/summary', async (_req, res) => {
  await delay(300);
  res.json({
    goals: [
      { id: 'g1', label: 'Monthly Revenue', current: 284500, target: 350000, unit: '$' },
      { id: 'g2', label: 'New Customers', current: 326, target: 400 },
      { id: 'g3', label: 'Support SLA', current: 94, target: 98, unit: '%' },
      { id: 'g4', label: 'Platform Uptime', current: 99.7, target: 99.9, unit: '%' },
    ],
    health: [
      { id: 'h1', service: 'API Gateway', status: 'operational', latency: 42, uptime: 99.98 },
      { id: 'h2', service: 'Auth Service', status: 'operational', latency: 28, uptime: 99.99 },
      { id: 'h3', service: 'Analytics Engine', status: 'operational', latency: 156, uptime: 99.92 },
      { id: 'h4', service: 'Notification Hub', status: 'degraded', latency: 312, uptime: 98.45 },
      { id: 'h5', service: 'Database Cluster', status: 'operational', latency: 18, uptime: 99.99 },
    ],
    trafficSources: [
      { id: 't1', label: 'Organic Search', value: 42, change: 5.2, color: '#2563eb' },
      { id: 't2', label: 'Direct', value: 28, change: -1.3, color: '#0d9488' },
      { id: 't3', label: 'Referral', value: 16, change: 8.7, color: '#059669' },
      { id: 't4', label: 'Social', value: 9, change: 12.1, color: '#d97706' },
      { id: 't5', label: 'Email', value: 5, change: 2.4, color: '#7c3aed' },
    ],
    topProducts: [
      { id: 'p1', name: 'Enterprise Plan', category: 'Subscription', revenue: 98400, orders: 124, growth: 18.2 },
      { id: 'p2', name: 'Pro Plan', category: 'Subscription', revenue: 67200, orders: 412, growth: 12.5 },
      { id: 'p3', name: 'Starter Plan', category: 'Subscription', revenue: 34800, orders: 890, growth: 8.3 },
      { id: 'p4', name: 'API Add-on', category: 'Add-on', revenue: 22100, orders: 156, growth: 24.7 },
      { id: 'p5', name: 'Storage Pack', category: 'Add-on', revenue: 15800, orders: 267, growth: -2.1 },
    ],
  });
});

app.get('/api/users', async (req, res) => {
  await delay();
  let filtered = [...getUsers()];
  const { search, status, role, page = 1, pageSize = 10 } = req.query;
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (status) filtered = filtered.filter((u) => u.status === status);
  if (role) filtered = filtered.filter((u) => u.role === role);
  res.json(paginate(filtered, page, pageSize));
});

app.get('/api/users/:id', async (req, res) => {
  await delay(200);
  const user = getUsers().find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
  await delay();
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users[idx] = { ...users[idx], ...req.body, id: users[idx].id };
  res.json(users[idx]);
});

app.delete('/api/users/:id', async (req, res) => {
  await delay();
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(idx, 1);
  res.status(204).end();
});

const analyticsReports = [
  {
    id: 'r1', name: 'Weekly Performance', period: 'Sep 10 - Sep 17', category: 'performance',
    metrics: [
      { id: 'am1', label: 'Page Views', value: 125000, change: 15.3, trend: 'up' },
      { id: 'am2', label: 'Bounce Rate', value: 32.1, change: -4.2, trend: 'up', unit: '%' },
      { id: 'am3', label: 'Avg. Load Time', value: 1.8, change: -12.5, trend: 'up', unit: 's' },
      { id: 'am4', label: 'Error Rate', value: 0.24, change: -0.08, trend: 'up', unit: '%' },
    ],
    chartData: [
      { label: 'Week 1', value: 28000, secondary: 24500 },
      { label: 'Week 2', value: 31000, secondary: 26800 },
      { label: 'Week 3', value: 29500, secondary: 28200 },
      { label: 'Week 4', value: 36500, secondary: 30100 },
    ],
  },
  {
    id: 'r2', name: 'User Engagement', period: 'Sep 10 - Sep 17', category: 'engagement',
    metrics: [
      { id: 'am5', label: 'DAU', value: 8420, change: 6.7, trend: 'up' },
      { id: 'am6', label: 'Retention', value: 68.5, change: 1.2, trend: 'up', unit: '%' },
      { id: 'am7', label: 'Session Duration', value: 5.2, change: 8.4, trend: 'up', unit: 'min' },
      { id: 'am8', label: 'Pages / Session', value: 4.8, change: 3.1, trend: 'up' },
    ],
    chartData: [
      { label: 'Mon', value: 7200, secondary: 6800 },
      { label: 'Tue', value: 8100, secondary: 7400 },
      { label: 'Wed', value: 7800, secondary: 7100 },
      { label: 'Thu', value: 8900, secondary: 8200 },
      { label: 'Fri', value: 8420, secondary: 7900 },
      { label: 'Sat', value: 5200, secondary: 4800 },
      { label: 'Sun', value: 4800, secondary: 4500 },
    ],
  },
  {
    id: 'r3', name: 'Acquisition Channels', period: 'Sep 1 - Sep 17', category: 'acquisition',
    metrics: [
      { id: 'am9', label: 'New Leads', value: 2840, change: 22.1, trend: 'up' },
      { id: 'am10', label: 'Cost per Lead', value: 12.4, change: -8.3, trend: 'up' },
      { id: 'am11', label: 'Lead-to-Customer', value: 11.5, change: 2.8, trend: 'up', unit: '%' },
      { id: 'am12', label: 'Ad Spend', value: 35200, change: 5.6, trend: 'down' },
    ],
    chartData: [
      { label: 'Organic', value: 1180 }, { label: 'Paid', value: 890 },
      { label: 'Referral', value: 420 }, { label: 'Social', value: 210 },
      { label: 'Email', value: 140 },
    ],
  },
  {
    id: 'r4', name: 'Retention & Churn', period: 'Aug 17 - Sep 17', category: 'retention',
    metrics: [
      { id: 'am13', label: '30-Day Retention', value: 72.4, change: 3.2, trend: 'up', unit: '%' },
      { id: 'am14', label: 'Churn Rate', value: 2.8, change: -0.6, trend: 'up', unit: '%' },
      { id: 'am15', label: 'LTV', value: 1240, change: 9.8, trend: 'up' },
      { id: 'am16', label: 'NPS Score', value: 62, change: 4.0, trend: 'up' },
    ],
    chartData: [
      { label: 'Month 1', value: 100, secondary: 100 },
      { label: 'Month 2', value: 82, secondary: 78 },
      { label: 'Month 3', value: 72, secondary: 68 },
      { label: 'Month 4', value: 65, secondary: 61 },
      { label: 'Month 5', value: 58, secondary: 55 },
      { label: 'Month 6', value: 52, secondary: 50 },
    ],
  },
];

const analyticsOverviewByPeriod = {
  '7d': {
    period: 'Last 7 days',
    summaryMetrics: [
      { id: 's1', label: 'Total Sessions', value: 48200, change: 11.2, trend: 'up' },
      { id: 's2', label: 'Unique Visitors', value: 28400, change: 8.7, trend: 'up' },
      { id: 's3', label: 'Conversion Rate', value: 3.8, change: 0.5, trend: 'up', unit: '%' },
      { id: 's4', label: 'Revenue', value: 68400, change: 14.2, trend: 'up' },
    ],
    funnel: [
      { label: 'Visitors', value: 28400, conversionRate: 100 },
      { label: 'Product Views', value: 18200, conversionRate: 64.1 },
      { label: 'Add to Cart', value: 4200, conversionRate: 23.1 },
      { label: 'Checkout', value: 1680, conversionRate: 40.0 },
      { label: 'Purchase', value: 1080, conversionRate: 64.3 },
    ],
    devices: [
      { device: 'Desktop', sessions: 24100, percentage: 50 },
      { device: 'Mobile', sessions: 19300, percentage: 40 },
      { device: 'Tablet', sessions: 4800, percentage: 10 },
    ],
    topPages: [
      { path: '/dashboard', views: 12400, avgTime: '4m 32s', bounceRate: 18.2 },
      { path: '/pricing', views: 8900, avgTime: '2m 18s', bounceRate: 42.5 },
      { path: '/analytics', views: 7200, avgTime: '5m 45s', bounceRate: 12.8 },
      { path: '/users', views: 5800, avgTime: '3m 12s', bounceRate: 22.1 },
      { path: '/docs/getting-started', views: 4600, avgTime: '6m 02s', bounceRate: 28.4 },
    ],
    channels: [
      { id: 'c1', label: 'Organic Search', value: 38, change: 4.2, color: '#2563eb' },
      { id: 'c2', label: 'Direct', value: 26, change: -2.1, color: '#0d9488' },
      { id: 'c3', label: 'Paid Ads', value: 18, change: 12.4, color: '#059669' },
      { id: 'c4', label: 'Social', value: 12, change: 8.9, color: '#d97706' },
      { id: 'c5', label: 'Email', value: 6, change: 1.2, color: '#7c3aed' },
    ],
    hourlyTrend: [
      { label: '00', value: 1200 }, { label: '04', value: 800 }, { label: '08', value: 4200 },
      { label: '12', value: 6800 }, { label: '16', value: 7200 }, { label: '20', value: 5400 },
    ],
    weeklyComparison: [
      { label: 'Mon', value: 6200, secondary: 5800 },
      { label: 'Tue', value: 7100, secondary: 6400 },
      { label: 'Wed', value: 6800, secondary: 6200 },
      { label: 'Thu', value: 7800, secondary: 7100 },
      { label: 'Fri', value: 8200, secondary: 7400 },
      { label: 'Sat', value: 4200, secondary: 3800 },
      { label: 'Sun', value: 3800, secondary: 3400 },
    ],
  },
  '30d': {
    period: 'Last 30 days',
    summaryMetrics: [
      { id: 's1', label: 'Total Sessions', value: 198400, change: 18.5, trend: 'up' },
      { id: 's2', label: 'Unique Visitors', value: 112000, change: 14.2, trend: 'up' },
      { id: 's3', label: 'Conversion Rate', value: 3.5, change: 0.3, trend: 'up', unit: '%' },
      { id: 's4', label: 'Revenue', value: 284500, change: 12.5, trend: 'up' },
    ],
    funnel: [
      { label: 'Visitors', value: 112000, conversionRate: 100 },
      { label: 'Product Views', value: 72800, conversionRate: 65.0 },
      { label: 'Add to Cart', value: 16800, conversionRate: 23.1 },
      { label: 'Checkout', value: 6720, conversionRate: 40.0 },
      { label: 'Purchase', value: 4320, conversionRate: 64.3 },
    ],
    devices: [
      { device: 'Desktop', sessions: 99200, percentage: 50 },
      { device: 'Mobile', sessions: 79400, percentage: 40 },
      { device: 'Tablet', sessions: 19800, percentage: 10 },
    ],
    topPages: [
      { path: '/dashboard', views: 48200, avgTime: '4m 28s', bounceRate: 19.1 },
      { path: '/pricing', views: 36400, avgTime: '2m 24s', bounceRate: 44.2 },
      { path: '/analytics', views: 28800, avgTime: '5m 52s', bounceRate: 13.5 },
      { path: '/users', views: 22400, avgTime: '3m 08s', bounceRate: 23.8 },
      { path: '/docs/getting-started', views: 18600, avgTime: '6m 18s', bounceRate: 27.2 },
    ],
    channels: [
      { id: 'c1', label: 'Organic Search', value: 42, change: 5.2, color: '#2563eb' },
      { id: 'c2', label: 'Direct', value: 28, change: -1.3, color: '#0d9488' },
      { id: 'c3', label: 'Paid Ads', value: 14, change: 9.8, color: '#059669' },
      { id: 'c4', label: 'Social', value: 11, change: 6.4, color: '#d97706' },
      { id: 'c5', label: 'Email', value: 5, change: 2.1, color: '#7c3aed' },
    ],
    hourlyTrend: [
      { label: 'Week 1', value: 42000 }, { label: 'Week 2', value: 48000 },
      { label: 'Week 3', value: 52000 }, { label: 'Week 4', value: 56400 },
    ],
    weeklyComparison: [
      { label: 'W1', value: 42000, secondary: 38000 },
      { label: 'W2', value: 48000, secondary: 41000 },
      { label: 'W3', value: 52000, secondary: 44000 },
      { label: 'W4', value: 56400, secondary: 48000 },
    ],
  },
  '90d': {
    period: 'Last 90 days',
    summaryMetrics: [
      { id: 's1', label: 'Total Sessions', value: 542000, change: 24.8, trend: 'up' },
      { id: 's2', label: 'Unique Visitors', value: 298000, change: 19.6, trend: 'up' },
      { id: 's3', label: 'Conversion Rate', value: 3.2, change: -0.2, trend: 'down', unit: '%' },
      { id: 's4', label: 'Revenue', value: 812400, change: 28.4, trend: 'up' },
    ],
    funnel: [
      { label: 'Visitors', value: 298000, conversionRate: 100 },
      { label: 'Product Views', value: 193700, conversionRate: 65.0 },
      { label: 'Add to Cart', value: 44750, conversionRate: 23.1 },
      { label: 'Checkout', value: 17900, conversionRate: 40.0 },
      { label: 'Purchase', value: 11510, conversionRate: 64.3 },
    ],
    devices: [
      { device: 'Desktop', sessions: 271000, percentage: 50 },
      { device: 'Mobile', sessions: 216800, percentage: 40 },
      { device: 'Tablet', sessions: 54200, percentage: 10 },
    ],
    topPages: [
      { path: '/dashboard', views: 128400, avgTime: '4m 35s', bounceRate: 18.8 },
      { path: '/pricing', views: 98200, avgTime: '2m 20s', bounceRate: 43.1 },
      { path: '/analytics', views: 76400, avgTime: '5m 48s', bounceRate: 12.9 },
      { path: '/users', views: 59800, avgTime: '3m 15s', bounceRate: 24.2 },
      { path: '/docs/getting-started', views: 48200, avgTime: '6m 22s', bounceRate: 26.8 },
    ],
    channels: [
      { id: 'c1', label: 'Organic Search', value: 40, change: 3.8, color: '#2563eb' },
      { id: 'c2', label: 'Direct', value: 30, change: 0.5, color: '#0d9488' },
      { id: 'c3', label: 'Paid Ads', value: 16, change: 15.2, color: '#059669' },
      { id: 'c4', label: 'Social', value: 10, change: 4.2, color: '#d97706' },
      { id: 'c5', label: 'Email', value: 4, change: 0.8, color: '#7c3aed' },
    ],
    hourlyTrend: [
      { label: 'Jul', value: 168000 }, { label: 'Aug', value: 182000 }, { label: 'Sep', value: 192000 },
    ],
    weeklyComparison: [
      { label: 'Month 1', value: 168000, secondary: 142000 },
      { label: 'Month 2', value: 182000, secondary: 158000 },
      { label: 'Month 3', value: 192000, secondary: 168000 },
    ],
  },
  '12m': {
    period: 'Last 12 months',
    summaryMetrics: [
      { id: 's1', label: 'Total Sessions', value: 2180000, change: 42.1, trend: 'up' },
      { id: 's2', label: 'Unique Visitors', value: 1240000, change: 38.4, trend: 'up' },
      { id: 's3', label: 'Conversion Rate', value: 3.1, change: 0.8, trend: 'up', unit: '%' },
      { id: 's4', label: 'Revenue', value: 3240000, change: 52.8, trend: 'up' },
    ],
    funnel: [
      { label: 'Visitors', value: 1240000, conversionRate: 100 },
      { label: 'Product Views', value: 806000, conversionRate: 65.0 },
      { label: 'Add to Cart', value: 186200, conversionRate: 23.1 },
      { label: 'Checkout', value: 74480, conversionRate: 40.0 },
      { label: 'Purchase', value: 47890, conversionRate: 64.3 },
    ],
    devices: [
      { device: 'Desktop', sessions: 1090000, percentage: 50 },
      { device: 'Mobile', sessions: 872000, percentage: 40 },
      { device: 'Tablet', sessions: 218000, percentage: 10 },
    ],
    topPages: [
      { path: '/dashboard', views: 524000, avgTime: '4m 42s', bounceRate: 17.5 },
      { path: '/pricing', views: 398000, avgTime: '2m 28s', bounceRate: 41.8 },
      { path: '/analytics', views: 312000, avgTime: '5m 55s', bounceRate: 11.9 },
      { path: '/users', views: 248000, avgTime: '3m 22s', bounceRate: 22.4 },
      { path: '/docs/getting-started', views: 198000, avgTime: '6m 35s', bounceRate: 25.1 },
    ],
    channels: [
      { id: 'c1', label: 'Organic Search', value: 44, change: 8.2, color: '#2563eb' },
      { id: 'c2', label: 'Direct', value: 26, change: 2.1, color: '#0d9488' },
      { id: 'c3', label: 'Paid Ads', value: 15, change: 22.4, color: '#059669' },
      { id: 'c4', label: 'Social', value: 10, change: 18.2, color: '#d97706' },
      { id: 'c5', label: 'Email', value: 5, change: 4.8, color: '#7c3aed' },
    ],
    hourlyTrend: [
      { label: 'Jan', value: 142000 }, { label: 'Feb', value: 158000 },
      { label: 'Mar', value: 168000 }, { label: 'Apr', value: 172000 },
      { label: 'May', value: 182000 }, { label: 'Jun', value: 188000 },
      { label: 'Jul', value: 192000 }, { label: 'Aug', value: 198000 },
      { label: 'Sep', value: 210000 },
    ],
    weeklyComparison: [
      { label: 'Q1', value: 468000, secondary: 380000 },
      { label: 'Q2', value: 542000, secondary: 420000 },
      { label: 'Q3', value: 600000, secondary: 480000 },
      { label: 'Q4', value: 0, secondary: 0 },
    ].filter((d) => d.value > 0),
  },
};

app.get('/api/analytics/reports', async (_req, res) => {
  await delay();
  res.json(analyticsReports);
});

app.get('/api/analytics/overview', async (req, res) => {
  await delay(350);
  const period = String(req.query.period ?? '30d');
  const overview = analyticsOverviewByPeriod[period] ?? analyticsOverviewByPeriod['30d'];
  res.json(overview);
});

app.get('/api/notifications', async (req, res) => {
  await delay();
  const { unreadOnly } = req.query;
  let list = [...notifications];
  if (unreadOnly === 'true') list = list.filter((n) => !n.read);
  res.json(list);
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  await delay(200);
  const n = notifications.find((x) => x.id === req.params.id);
  if (!n) return res.status(404).json({ message: 'Notification not found' });
  n.read = true;
  res.json(n);
});

app.patch('/api/notifications/read-all', async (_req, res) => {
  await delay(200);
  notifications.forEach((n) => { n.read = true; });
  res.json({ success: true });
});

export default app;

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
  });
}
