import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '@mfd/shared-types';
import { useAuthStore } from './authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: User['role'][];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
