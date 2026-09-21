import { Layers } from 'lucide-react';
import { Card } from '@mfd/shared-ui';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', color: '#fff' }}>
          <Layers size={48} style={{ margin: '0 auto 12px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>MFD Platform</h1>
          <p style={{ opacity: 0.85, marginTop: '4px' }}>Micro-Frontend Dashboard</p>
        </div>

        <Card padding="lg">
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>{title}</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{subtitle}</p>
          </div>
          {children}
          {footer}
        </Card>
      </div>
    </div>
  );
}
