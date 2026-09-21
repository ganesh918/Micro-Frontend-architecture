import { Component, type ReactNode } from 'react';
import { ErrorState, Spinner } from '@mfd/shared-ui';

interface ModuleLoaderProps {
  children: ReactNode;
  moduleName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * Handles remote module load failures with retry — critical for Module Federation resilience.
 */
export class ModuleLoader extends Component<ModuleLoaderProps, State> {
  state: State = { hasError: false, error: null, retryCount: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    console.error(`[ModuleLoader] Failed to load ${this.props.moduleName}:`, error);
  }

  handleRetry = (): void => {
    this.setState((s) => ({ hasError: false, error: null, retryCount: s.retryCount + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title={`${this.props.moduleName} module unavailable`}
          message={
            this.state.error?.message ??
            'The remote module failed to load. Ensure all micro-frontend services are running.'
          }
          onRetry={this.state.retryCount < 3 ? this.handleRetry : undefined}
        />
      );
    }

    return (
      <ModuleLoaderInner key={this.state.retryCount}>{this.props.children}</ModuleLoaderInner>
    );
  }
}

function ModuleLoaderInner({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ModuleFallback({ name }: { name: string }) {
  return <Spinner fullPage label={`Loading ${name} module...`} />;
}
