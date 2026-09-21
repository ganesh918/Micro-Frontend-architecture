import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  label?: string;
  fullPage?: boolean;
}

export function Spinner({ size = 32, label = 'Loading...', fullPage = false }: SpinnerProps) {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <Loader2 size={size} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
      {label && <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{label}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        {content}
      </div>
    );
  }

  return content;
}
