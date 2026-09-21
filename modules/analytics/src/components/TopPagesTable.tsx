import { memo } from 'react';
import type { TopPage } from '@mfd/shared-types';
import { formatNumber } from '@mfd/shared-utils';
import { Badge, Table } from '@mfd/shared-ui';

interface TopPagesTableProps {
  pages: TopPage[];
}

export const TopPagesTable = memo(function TopPagesTable({ pages }: TopPagesTableProps) {
  return (
    <Table<TopPage>
      data={pages}
      keyExtractor={(p) => p.path}
      columns={[
        {
          key: 'path',
          header: 'Page',
          render: (p) => (
            <code style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-primary)' }}>{p.path}</code>
          ),
        },
        {
          key: 'views',
          header: 'Views',
          render: (p) => <span style={{ fontWeight: 600 }}>{formatNumber(p.views)}</span>,
        },
        {
          key: 'avgTime',
          header: 'Avg. Time',
          render: (p) => p.avgTime,
        },
        {
          key: 'bounceRate',
          header: 'Bounce Rate',
          render: (p) => (
            <Badge variant={p.bounceRate > 40 ? 'warning' : p.bounceRate > 25 ? 'default' : 'success'}>
              {p.bounceRate}%
            </Badge>
          ),
        },
      ]}
    />
  );
});
