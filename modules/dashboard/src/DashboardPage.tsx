import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Calendar, RefreshCw, TrendingUp } from 'lucide-react';

import { api, formatRelativeTime, publishEvent, subscribeEvent } from '@mfd/shared-utils';

import { useAuthStore } from '@mfd/shared-auth';

import type { ActivityItem, ChartDataPoint, DashboardMetric, DashboardSummary } from '@mfd/shared-types';

import {

  Badge, Button, Card, ChartSkeleton, EmptyState, ErrorState, MetricCard, MetricCardSkeleton,

} from '@mfd/shared-ui';

import { ActivityFeed } from './components/ActivityFeed';

import { AreaLineChart } from './components/AreaLineChart';

import { GoalProgressPanel } from './components/GoalProgressPanel';

import { RevenueChart } from './components/RevenueChart';

import { SystemHealthPanel } from './components/SystemHealthPanel';

import { TopProductsTable } from './components/TopProductsTable';

import { TrafficSourcesChart } from './components/TrafficSourcesChart';



type ChartView = 'monthly' | 'weekly';



export default function DashboardPage() {

  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.session?.user);

  const [chartView, setChartView] = useState<ChartView>('monthly');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);



  const metricsQuery = useQuery({

    queryKey: ['dashboard', 'metrics'],

    queryFn: () => api.get<DashboardMetric[]>('/dashboard/metrics'),

  });



  const activitiesQuery = useQuery({

    queryKey: ['dashboard', 'activities'],

    queryFn: () => api.get<ActivityItem[]>('/dashboard/activities'),

  });



  const chartQuery = useQuery({

    queryKey: ['dashboard', 'chart'],

    queryFn: () => api.get<ChartDataPoint[]>('/dashboard/chart'),

  });



  const weeklyChartQuery = useQuery({

    queryKey: ['dashboard', 'chart-weekly'],

    queryFn: () => api.get<ChartDataPoint[]>('/dashboard/chart-weekly'),

  });



  const summaryQuery = useQuery({

    queryKey: ['dashboard', 'summary'],

    queryFn: () => api.get<DashboardSummary>('/dashboard/summary'),

  });



  useEffect(() => {

    const unsubCreated = subscribeEvent('user:created', () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    });

    const unsubUpdate = subscribeEvent('user:updated', () => {

      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      publishEvent('toast:show', { message: 'Dashboard refreshed after user update', type: 'info' }, 'dashboard');

    });

    const unsubDelete = subscribeEvent('user:deleted', () => {

      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

    });

    const unsubRefresh = subscribeEvent('dashboard:refresh', () => {

      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

    });

    return () => { unsubCreated(); unsubUpdate(); unsubDelete(); unsubRefresh(); };

  }, [queryClient]);



  const isLoading = metricsQuery.isLoading || activitiesQuery.isLoading || chartQuery.isLoading || summaryQuery.isLoading;

  const isError = metricsQuery.isError || activitiesQuery.isError || chartQuery.isError || summaryQuery.isError;



  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        refetchType: 'active',
      });
      setRefreshKey((key) => key + 1);
      publishEvent('toast:show', { message: 'Dashboard refreshed successfully', type: 'success' }, 'dashboard');
    } catch {
      publishEvent('toast:show', { message: 'Failed to refresh dashboard', type: 'error' }, 'dashboard');
    } finally {
      setIsRefreshing(false);
    }
  };



  if (isLoading) {

    return (

      <div className="animate-fade-in">

        <div style={{ marginBottom: '24px' }}>

          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Dashboard</h1>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>

          {Array.from({ length: 8 }).map((_, i) => <MetricCardSkeleton key={i} />)}

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

          <Card title="Revenue Overview"><ChartSkeleton /></Card>

          <Card title="Recent Activity"><ChartSkeleton /></Card>

        </div>

      </div>

    );

  }



  if (isError) {

    return (

      <ErrorState

        title="Failed to load dashboard"

        message="Could not fetch dashboard data. Please check your connection."

        onRetry={handleRefresh}

      />

    );

  }



  const metrics = metricsQuery.data ?? [];

  const activities = activitiesQuery.data ?? [];

  const chartData = chartView === 'monthly' ? (chartQuery.data ?? []) : (weeklyChartQuery.data ?? []);

  const summary = summaryQuery.data;



  return (

    <div className="animate-fade-in">

      {/* Header */}

      <div className="mfd-page-header">

        <div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Dashboard</h1>

            <Badge variant="success" dot className="animate-pulse-glow">Live</Badge>

          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>

            Welcome back, {user?.name?.split(' ')[0] ?? 'User'} — here&apos;s your platform overview for September 2025

          </p>

        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

          <Button variant="outline" size="sm" leftIcon={<Calendar size={14} />}>

            Sep 2025

          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={!isRefreshing ? <RefreshCw size={14} /> : undefined}
            loading={isRefreshing}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>

        </div>

      </div>



      <div
        style={{
          opacity: isRefreshing ? 0.6 : 1,
          transition: 'opacity 0.25s ease',
          pointerEvents: isRefreshing ? 'none' : 'auto',
        }}
      >

      {/* KPI Metrics — 8 cards */}

      {metrics.length === 0 ? (

        <EmptyState title="No metrics available" description="Dashboard metrics will appear once data is collected." />

      ) : (

        <div className="stagger-grid mfd-grid-metrics">

          {metrics.map((metric) => (

            <MetricCard

              key={metric.id}

              label={metric.label}

              value={metric.value}

              change={metric.change}

              trend={metric.trend}

              unit={metric.unit}

              prefix={metric.label.includes('Revenue') ? '$' : undefined}

            />

          ))}

        </div>

      )}



      {/* Revenue chart — full width */}

      <Card

        title="Revenue Overview"

        subtitle={chartView === 'monthly' ? 'Monthly revenue vs previous year' : 'This week vs last week'}

        action={

          <div style={{ display: 'flex', gap: '4px' }}>

            <Button variant={chartView === 'monthly' ? 'primary' : 'ghost'} size="sm" onClick={() => setChartView('monthly')}>

              Monthly

            </Button>

            <Button variant={chartView === 'weekly' ? 'primary' : 'ghost'} size="sm" onClick={() => setChartView('weekly')}>

              Weekly

            </Button>

          </div>

        }

        style={{ marginBottom: '24px' }}

      >

        <AreaLineChart key={`area-${refreshKey}-${chartView}`} data={chartData} height={240} />

      </Card>



      {/* Goals + Traffic Sources */}

      {summary && (

        <div className="stagger-cards mfd-grid-2">

          <Card title="Goal Progress" subtitle="Monthly targets" padding="md">

            <GoalProgressPanel goals={summary.goals} />

          </Card>

          <Card title="Traffic Sources" subtitle="Acquisition breakdown">

            <TrafficSourcesChart sources={summary.trafficSources} />

          </Card>

        </div>

      )}



      {/* Top Products — full width so the table has room */}

      {summary && (

        <Card
          title="Top Products"
          subtitle="By revenue this month"
          padding="none"
          className="stagger-cards"
          style={{ marginBottom: '24px' }}
        >

          <TopProductsTable products={summary.topProducts} />

        </Card>

      )}



      {/* System Health + Recent Activity */}

      <div className="stagger-cards mfd-grid-auto">

        {summary && (

          <Card title="System Health" subtitle="Service status monitor">

            <SystemHealthPanel items={summary.health} />

          </Card>

        )}



        <Card title="Recent Activity" subtitle="Latest platform events">

          <ActivityFeed activities={activities} formatTime={formatRelativeTime} />

        </Card>

      </div>



      {/* Weekly bar chart comparison */}

      <Card title="Weekly Revenue Breakdown" subtitle="Daily comparison — current vs previous week">

        <RevenueChart key={`revenue-${refreshKey}`} data={weeklyChartQuery.data ?? []} />

      </Card>



      {/* Quick insight strip */}

      <div

        className="insight-banner animate-fade-in-up"

        style={{

          marginTop: '24px',

          padding: '16px 20px',

          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(14,165,233,0.08) 100%)',

          borderRadius: 'var(--radius-lg)',

          border: '1px solid var(--color-border)',

          display: 'flex',

          alignItems: 'center',

          gap: '12px',

          flexWrap: 'wrap',

        }}

      >

        <TrendingUp size={20} color="var(--color-primary)" />

        <p style={{ fontSize: '14px', flex: 1 }}>

          <strong>Insight:</strong> Revenue is up 12.5% this month. Enterprise Plan leads with $98.4K — consider expanding Pro Plan marketing to close the gap.

        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => publishEvent('analytics:export', { reportId: 'r1' }, 'dashboard')}
        >
          View Full Report
        </Button>

      </div>

      </div>

    </div>

  );

}


