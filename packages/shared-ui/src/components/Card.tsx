import { cn } from '@mfd/shared-utils';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
}

const paddingMap = { none: '0', sm: '16px', md: '24px', lg: '32px' };

export function Card({ children, title, subtitle, action, padding = 'md', className, style, interactive = true }: CardProps) {
  return (
    <div
      className={cn('animate-fade-in-up', interactive && 'interactive-card', className)}
      style={{
        background: 'linear-gradient(180deg, var(--color-surface-elevated) 0%, var(--color-surface) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${paddingMap[padding]} ${paddingMap[padding]} 0`,
          }}
        >
          <div>
            {title && <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: paddingMap[padding] }}>{children}</div>
    </div>
  );
}
