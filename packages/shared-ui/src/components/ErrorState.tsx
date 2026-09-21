import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<void>;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

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
      <div style={{ color: 'var(--color-error)', opacity: 0.8 }}>
        <AlertTriangle size={48} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '400px' }}>{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={!isRetrying ? <RefreshCw size={14} /> : undefined}
          loading={isRetrying}
          onClick={handleRetry}
          disabled={isRetrying}
          style={{ marginTop: '8px' }}
        >
          {isRetrying ? 'Retrying...' : 'Try again'}
        </Button>
      )}
    </div>
  );
}
