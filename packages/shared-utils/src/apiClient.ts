import type { ApiError } from '@mfd/shared-types';
import { publishEvent } from './eventBus';

const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? '/api';

export class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
};

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem('mfd-auth-storage');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.session?.tokens?.accessToken ?? null;
  } catch {
    return null;
  }
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  if (!params) return url;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = (isJson ? body : { message: String(body) }) as ApiError;

    if (response.status === 401) {
      unauthorizedHandler?.();
      publishEvent('auth:session-expired', null, 'dashboard');
    }

    if (response.status === 403) {
      publishEvent('toast:show', { message: error.message || 'Access denied', type: 'error' }, 'dashboard');
    }

    throw new ApiClientError(
      error.message || `Request failed with status ${response.status}`,
      response.status,
      error.code
    );
  }

  return body as T;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, skipAuth, ...rest } = options;
  const token = skipAuth ? null : getAuthToken();

  const response = await fetch(buildUrl(path, params), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  return handleResponse<T>(response);
}

export const api = {
  get: <T>(path: string, params?: RequestOptions['params']) =>
    apiClient<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    apiClient<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),

  put: <T>(path: string, body?: unknown) =>
    apiClient<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(path: string, body?: unknown) =>
    apiClient<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string) => apiClient<T>(path, { method: 'DELETE' }),
};
