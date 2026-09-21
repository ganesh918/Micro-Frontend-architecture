import { cn } from '@mfd/shared-utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const colors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: 'var(--badge-default-bg)', text: 'var(--badge-default-text)' },
  success: { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' },
  warning: { bg: 'var(--badge-warning-bg)', text: 'var(--badge-warning-text)' },
  error: { bg: 'var(--badge-error-bg)', text: 'var(--badge-error-text)' },
  info: { bg: 'var(--badge-info-bg)', text: 'var(--badge-info-text)' },
};

export function Badge({ children, variant = 'default', dot, className }: BadgeProps) {
  const { bg, text } = colors[variant];
  return (
    <span
      className={cn(className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 500,
        background: bg,
        color: text,
      }}
    >
      {dot && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: text }} />
      )}
      {children}
    </span>
  );
}
