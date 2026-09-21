import { cn } from '@mfd/shared-utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const colors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: '#f1f5f9', text: '#475569' },
  success: { bg: '#d1fae5', text: '#065f46' },
  warning: { bg: '#fef3c7', text: '#92400e' },
  error: { bg: '#fee2e2', text: '#991b1b' },
  info: { bg: '#dbeafe', text: '#1e40af' },
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
