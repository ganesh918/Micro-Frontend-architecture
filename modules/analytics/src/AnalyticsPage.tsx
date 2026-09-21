import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { Download, BarChart3, Filter } from 'lucide-react';

import { api, formatNumber, publishEvent } from '@mfd/shared-utils';

import type { AnalyticsOverview, AnalyticsReport } from '@mfd/shared-types';

import {

  Badge, Button, Card, ChartSkeleton, EmptyState, ErrorState, MetricCard, MetricCardSkeleton,

} from '@mfd/shared-ui';

import { ChannelChart } from './components/ChannelChart';

import { DeviceBreakdown } from './components/DeviceBreakdown';

import { FunnelChart } from './components/FunnelChart';

import { TopPagesTable } from './components/TopPagesTable';

import { TrendBarChart } from './components/TrendBarChart';



type Period = '7d' | '30d' | '90d' | '12m';



const PERIOD_OPTIONS: { value: Period; label: string }[] = [

  { value: '7d', label: '7 Days' },

  { value: '30d', label: '30 Days' },

  { value: '90d', label: '90 Days' },

  { value: '12m', label: '12 Months' },

];



const CATEGORY_LABELS: Record<AnalyticsReport['category'], string> = {

  performance: 'Performance',

  engagement: 'Engagement',

  acquisition: 'Acquisition',

  retention: 'Retention',

};



export default function AnalyticsPage() {

  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const [period, setPeriod] = useState<Period>('30d');
  const [searchParams] = useSearchParams();
  const reportsSectionRef = useRef<HTMLDivElement>(null);



  const reportsQuery = useQuery({

    queryKey: ['analytics', 'reports'],

    queryFn: () => api.get<AnalyticsReport[]>('/analytics/reports'),

  });



  const overviewQuery = useQuery({

    queryKey: ['analytics', 'overview', period],

    queryFn: () => api.get<AnalyticsOverview>(`/analytics/overview?period=${period}`),

  });



  const handleExport = (reportId: string) => {

    publishEvent('analytics:export', { reportId }, 'analytics');

    publishEvent('toast:show', { message: 'Report export started — check downloads', type: 'info' }, 'analytics');

  };



  const isLoading = reportsQuery.isLoading || overviewQuery.isLoading;

  const isError = reportsQuery.isError || overviewQuery.isError;

  useEffect(() => {
    const reportId = searchParams.get('report');
    const reports = reportsQuery.data;
    if (!reportId || !reports?.length) return;

    if (reports.some((report) => report.id === reportId)) {
      setSelectedReport(reportId);
    }
  }, [searchParams, reportsQuery.data]);

  useEffect(() => {
    if (!searchParams.get('report') || !selectedReport) return;

    reportsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [searchParams, selectedReport]);



  if (isLoading) {

    return (

      <div>

        <div style={{ marginBottom: '24px' }}><h1 style={{ fontSize: '24px', fontWeight: 700 }}>Analytics</h1></div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>

          {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

          <Card title="Conversion Funnel"><ChartSkeleton /></Card>

          <Card title="Traffic Channels"><ChartSkeleton /></Card>

        </div>

      </div>

    );

  }



  if (isError) {

    return <ErrorState title="Failed to load analytics" onRetry={() => { void reportsQuery.refetch(); void overviewQuery.refetch(); }} />;

  }



  const reports = reportsQuery.data ?? [];

  const overview = overviewQuery.data;

  const activeReport = reports.find((r) => r.id === (selectedReport ?? reports[0]?.id));



  if (reports.length === 0 || !overview) {

    return (

      <EmptyState

        icon={<BarChart3 size={48} />}

        title="No analytics reports"

        description="Reports will appear here once data is available."

      />

    );

  }



  return (

    <div className="animate-fade-in">

      {/* Header */}

      <div className="mfd-page-header">

        <div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Analytics</h1>

            <Badge variant="info">{overview.period}</Badge>

          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>

            Performance insights, conversion funnels, and traffic analysis

          </p>

        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

          {activeReport && (

            <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={() => handleExport(activeReport.id)}>

              Export Report

            </Button>

          )}

        </div>

      </div>



      {/* Period selector */}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>

        <Filter size={14} color="var(--color-text-muted)" />

        {PERIOD_OPTIONS.map((opt) => (

          <Button

            key={opt.value}

            variant={period === opt.value ? 'primary' : 'outline'}

            size="sm"

            onClick={() => setPeriod(opt.value)}

          >

            {opt.label}

          </Button>

        ))}

      </div>



      {/* Overview KPIs */}

      <div className="stagger-grid mfd-grid-metrics">

        {overview.summaryMetrics.map((metric) => (

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



      {/* Funnel + Channels */}

      <div className="stagger-cards mfd-grid-2">

        <Card title="Conversion Funnel" subtitle="Visitor to purchase journey">

          <FunnelChart steps={overview.funnel} />

        </Card>

        <Card title="Traffic Channels" subtitle="Acquisition source breakdown">

          <ChannelChart channels={overview.channels} />

        </Card>

      </div>



      {/* Device breakdown + Hourly/period trend */}

      <div className="stagger-cards mfd-grid-2">

        <Card title="Device Breakdown" subtitle="Sessions by device type">

          <DeviceBreakdown devices={overview.devices} />

        </Card>

        <Card title="Traffic Trend" subtitle={`Session volume — ${overview.period.toLowerCase()}`}>

          <TrendBarChart data={overview.hourlyTrend} showSecondary={false} />

        </Card>

      </div>



      {/* Period comparison */}

      <Card title="Period Comparison" subtitle="Current vs previous period" style={{ marginBottom: '24px' }}>

        <TrendBarChart data={overview.weeklyComparison} />

      </Card>



      {/* Top pages */}

      <Card title="Top Pages" subtitle="Most visited pages by views" padding="none" style={{ marginBottom: '24px' }}>

        <TopPagesTable pages={overview.topPages} />

      </Card>



      {/* Report tabs */}

      <div ref={reportsSectionRef} style={{ marginBottom: '16px' }}>

        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Detailed Reports</h2>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

          {reports.map((report) => (
            <div key={report.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Button
                variant={activeReport?.id === report.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedReport(report.id)}
              >
                {report.name}
              </Button>
              <Badge variant="default">{CATEGORY_LABELS[report.category]}</Badge>
            </div>
          ))}

        </div>

      </div>



      {activeReport && (

        <>

          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>

            Period: {activeReport.period}

          </p>



          <div className="stagger-grid mfd-grid-metrics">

            {activeReport.metrics.map((metric) => (

              <MetricCard

                key={metric.id}

                label={metric.label}

                value={metric.value}

                change={metric.change}

                trend={metric.trend}

                unit={metric.unit}

                prefix={metric.label.includes('Revenue') || metric.label.includes('Spend') || metric.label === 'LTV' ? '$' : undefined}

              />

            ))}

          </div>



          <Card title="Trend Analysis" subtitle={activeReport.name} action={

            <Button variant="ghost" size="sm" leftIcon={<Download size={14} />} onClick={() => handleExport(activeReport.id)}>

              Export

            </Button>

          }>

            <TrendBarChart data={activeReport.chartData} />

          </Card>

        </>

      )}



      {/* Summary insight */}

      <div

        className="insight-banner animate-fade-in-up"

        style={{

          marginTop: '24px',

          padding: '16px 20px',

          background: 'var(--color-bg)',

          borderRadius: 'var(--radius-lg)',

          border: '1px solid var(--color-border)',

        }}

      >

        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>

          <strong style={{ color: 'var(--color-text)' }}>Summary:</strong>{' '}

          {formatNumber(overview.summaryMetrics[0]?.value ?? 0)} total sessions with a{' '}

          {overview.summaryMetrics[2]?.value ?? 0}% conversion rate.

          Top traffic source is {overview.channels[0]?.label} at {overview.channels[0]?.value}%.

          {overview.funnel[4] && ` ${formatNumber(overview.funnel[4].value)} purchases completed.`}

        </p>

      </div>

    </div>

  );

}


