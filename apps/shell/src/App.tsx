import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@mfd/shared-auth';
import { ErrorBoundary } from '@mfd/shared-ui';
import { AppLayout } from './layout/AppLayout';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RemoteRoute } from './components/RemoteRoute';

export default function App() {
  return (
    <ErrorBoundary moduleName="Application">
      <Routes>
        <Route
          path="/login"
          element={
            <RemoteRoute moduleName="Authentication" loader={() => import('auth/AuthContainer')} />
          }
        />
        <Route
          path="/signup"
          element={
            <RemoteRoute moduleName="Authentication" loader={() => import('auth/AuthContainer')} />
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <RemoteRoute moduleName="Dashboard" loader={() => import('dashboard/DashboardPage')} />
            }
          />
          <Route
            path="users"
            element={
              <RemoteRoute moduleName="User Management" loader={() => import('userManagement/UsersPage')} />
            }
          />
          <Route
            path="analytics"
            element={
              <RemoteRoute moduleName="Analytics" loader={() => import('analytics/AnalyticsPage')} />
            }
          />
          <Route
            path="notifications"
            element={
              <RemoteRoute moduleName="Notifications" loader={() => import('notifications/NotificationsPage')} />
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
