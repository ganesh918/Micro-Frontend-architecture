/**
 * Global runtime singleton registry.
 * Ensures auth store and event bus are shared across Module Federation bundles.
 */
declare global {
  interface Window {
    __MFD_RUNTIME__?: Record<string, unknown>;
  }
}

export function getRuntime(): Record<string, unknown> {
  if (typeof window !== 'undefined') {
    if (!window.__MFD_RUNTIME__) {
      window.__MFD_RUNTIME__ = {};
    }
    return window.__MFD_RUNTIME__;
  }
  return {};
}

export function getRuntimeSingleton<T>(key: string, factory: () => T): T {
  const runtime = getRuntime();
  if (!runtime[key]) {
    runtime[key] = factory();
  }
  return runtime[key] as T;
}
