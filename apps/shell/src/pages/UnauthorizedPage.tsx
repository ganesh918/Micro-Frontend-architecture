import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '@mfd/shared-ui';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <ShieldOff size={64} style={{ color: 'var(--color-warning)', margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Access Denied</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          You don&apos;t have permission to access this page. Contact your administrator if you believe this is an error.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
