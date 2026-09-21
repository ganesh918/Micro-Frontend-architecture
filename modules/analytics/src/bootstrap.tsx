import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AnalyticsPage from './AnalyticsPage';

const qc = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={qc}><AnalyticsPage /></QueryClientProvider>
);
