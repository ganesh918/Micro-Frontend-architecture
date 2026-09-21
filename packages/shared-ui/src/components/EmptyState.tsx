import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        gap: '12px',
      }}
    >
      <div style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
        {icon ?? <Inbox size={48} />}
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>
      {description && (
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '360px' }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} style={{ marginTop: '8px' }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
