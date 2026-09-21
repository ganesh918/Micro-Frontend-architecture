import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@mfd/shared-auth';
import { Button, Input, PasswordInput } from '@mfd/shared-ui';
import { AuthLayout } from './components/AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      /* error handled in store */
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Enter your credentials to continue"
      footer={
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '20px' }}>
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Create account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          leftIcon={<Mail size={16} />}
          placeholder="you@company.com"
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          leftIcon={<Lock size={16} />}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <Button type="submit" fullWidth loading={isLoading} size="lg">
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
