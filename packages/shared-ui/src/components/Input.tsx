import { cn } from '@mfd/shared-utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  className,
  id,
  style,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const hasRight = Boolean(rightElement);

  return (
    <div className={cn(className)} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: `${leftIcon ? '10px' : '10px'} ${hasRight ? '44px' : '14px'} 10px ${leftIcon ? '40px' : '14px'}`,
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
            background: 'var(--color-surface)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color var(--transition)',
            ...style,
          }}
          {...props}
        />
        {rightElement}
      </div>
      {error && <span style={{ fontSize: '13px', color: 'var(--color-error)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{hint}</span>}
    </div>
  );
}
