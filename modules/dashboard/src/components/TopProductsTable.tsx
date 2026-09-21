import { memo } from 'react';
import type { TopProduct } from '@mfd/shared-types';
import { formatCurrency, formatNumber } from '@mfd/shared-utils';
import { Badge, Table } from '@mfd/shared-ui';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface TopProductsTableProps {
  products: TopProduct[];
}

export const TopProductsTable = memo(function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <Table<TopProduct>
      data={products}
      keyExtractor={(p) => p.id}
      columns={[
        {
          key: 'name',
          header: 'Product',
          render: (p) => (
            <div>
              <div style={{ fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{p.category}</div>
            </div>
          ),
        },
        {
          key: 'revenue',
          header: 'Revenue',
          render: (p) => <span style={{ fontWeight: 600 }}>{formatCurrency(p.revenue)}</span>,
        },
        {
          key: 'orders',
          header: 'Orders',
          render: (p) => formatNumber(p.orders),
        },
        {
          key: 'growth',
          header: 'Growth',
          render: (p) => (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: p.growth >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
              {p.growth >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(p.growth)}%
            </span>
          ),
        },
        {
          key: 'rank',
          header: 'Rank',
          width: '60px',
          render: (p) => {
            const index = products.indexOf(p);
            return (
              <Badge variant={index === 0 ? 'info' : 'default'}>
                #{index + 1}
              </Badge>
            );
          },
        },
      ]}
    />
  );
});
