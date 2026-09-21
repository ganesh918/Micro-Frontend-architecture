import { useSyncExternalStore } from 'react';
import { getRuntimeSingleton } from './runtime';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'mfd-theme';

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return 'dark';
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
}

function createThemeManager() {
  let theme = readStoredTheme();
  const listeners = new Set<() => void>();

  applyTheme(theme);

  return {
    getTheme: () => theme,
    setTheme: (next: Theme) => {
      theme = next;
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      listeners.forEach((listener) => listener());
    },
    toggleTheme: () => {
      const next: Theme = theme === 'light' ? 'dark' : 'light';
      theme = next;
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const themeManager = getRuntimeSingleton('themeManager', createThemeManager);

export function initTheme(): Theme {
  return themeManager.getTheme();
}

export function useTheme() {
  const theme = useSyncExternalStore(
    themeManager.subscribe,
    themeManager.getTheme,
    () => 'dark' as Theme,
  );

  return {
    theme,
    isDark: theme === 'dark',
    setTheme: themeManager.setTheme,
    toggleTheme: themeManager.toggleTheme,
  };
}
