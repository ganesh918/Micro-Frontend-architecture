import { Suspense, type ComponentType } from 'react';
import { ErrorBoundary } from '@mfd/shared-ui';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import { ModuleFallback, ModuleLoader } from './ModuleLoader';

interface RemoteRouteProps {
  moduleName: string;
  loader: () => Promise<{ default: ComponentType }>;
}

export function RemoteRoute({ moduleName, loader }: RemoteRouteProps) {
  const LazyComponent = lazyWithRetry(loader);

  return (
    <ModuleLoader moduleName={moduleName}>
      <ErrorBoundary moduleName={moduleName}>
        <Suspense fallback={<ModuleFallback name={moduleName} />}>
          <LazyComponent />
        </Suspense>
      </ErrorBoundary>
    </ModuleLoader>
  );
}
