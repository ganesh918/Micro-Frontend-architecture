import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuthStore } from '@mfd/shared-auth';
import { initTheme, registerUnauthorizedHandler, publishEvent } from '@mfd/shared-utils';
import { ToastContainer } from '@mfd/shared-ui';
import '@mfd/shared-ui/styles/global.css';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Operation failed';
        publishEvent('toast:show', { message, type: 'error' }, 'dashboard');
      },
    },
  },
});

initTheme();

registerUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
  publishEvent('toast:show', { message: 'Session expired. Please sign in again.', type: 'warning' }, 'auth');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
