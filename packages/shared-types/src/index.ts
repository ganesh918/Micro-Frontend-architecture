export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  avatar?: string;
  department?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface ActivityItem {
  id: string;
  type: 'user' | 'system' | 'alert' | 'update';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  period: string;
  category: 'performance' | 'engagement' | 'acquisition' | 'retention';
  metrics: DashboardMetric[];
  chartData: ChartDataPoint[];
}

export interface TrafficSource {
  id: string;
  label: string;
  value: number;
  change: number;
  color: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface SystemHealthItem {
  id: string;
  service: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  uptime: number;
}

export interface GoalProgress {
  id: string;
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export interface DashboardSummary {
  goals: GoalProgress[];
  health: SystemHealthItem[];
  trafficSources: TrafficSource[];
  topProducts: TopProduct[];
}

export interface FunnelStep {
  label: string;
  value: number;
  conversionRate: number;
}

export interface DeviceStat {
  device: string;
  sessions: number;
  percentage: number;
}

export interface TopPage {
  path: string;
  views: number;
  avgTime: string;
  bounceRate: number;
}

export interface AnalyticsOverview {
  period: string;
  summaryMetrics: DashboardMetric[];
  funnel: FunnelStep[];
  devices: DeviceStat[];
  topPages: TopPage[];
  channels: TrafficSource[];
  hourlyTrend: ChartDataPoint[];
  weeklyComparison: ChartDataPoint[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type ModuleName =
  | 'auth'
  | 'dashboard'
  | 'user-management'
  | 'analytics'
  | 'notifications';

export interface ModuleEvent<T = unknown> {
  type: string;
  payload: T;
  source: ModuleName;
  timestamp: number;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  module: ModuleName;
  badge?: number;
}
