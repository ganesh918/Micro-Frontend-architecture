import { cn } from '@mfd/shared-utils';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = 16,
  variant = 'rectangular',
  className,
  style,
}: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        width,
        height,
        borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? '4px' : 'var(--radius-sm)',
        ...style,
      }}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '20px 24px' }}>
      <Skeleton width="60%" height={14} style={{ marginBottom: 12 }} />
      <Skeleton width="40%" height={28} style={{ marginBottom: 12 }} />
      <Skeleton width="50%" height={12} />
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '14px 16px', borderBottom: '1px solid var(--color-border)' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={14} style={{ flex: i === 0 ? 2 : 1 }} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: 200, padding: '16px 8px' }}>
      {[80, 120, 95, 140, 110, 70, 65].map((h, i) => (
        <Skeleton key={i} height={h} style={{ flex: 1 }} />
      ))}
    </div>
  );
}
