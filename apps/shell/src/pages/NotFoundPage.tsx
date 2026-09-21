import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '@mfd/shared-ui';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <FileQuestion size={64} style={{ color: 'var(--color-text-muted)', margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Page Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
