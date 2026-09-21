import mitt, { type Emitter, type Handler } from 'mitt';
import type { ModuleEvent, ModuleName } from '@mfd/shared-types';
import { getRuntimeSingleton } from './runtime';

export type AppEvents = {
  'auth:login': ModuleEvent<{ userId: string }>;
  'auth:logout': ModuleEvent<null>;
  'auth:session-expired': ModuleEvent<null>;
  'notification:new': ModuleEvent<{ count: number }>;
  'notification:read': ModuleEvent<{ id: string }>;
  'user:updated': ModuleEvent<{ userId: string }>;
  'user:deleted': ModuleEvent<{ userId: string }>;
  'dashboard:refresh': ModuleEvent<null>;
  'analytics:export': ModuleEvent<{ reportId: string }>;
  'nav:badge-update': ModuleEvent<{ module: ModuleName; count: number }>;
  'toast:show': ModuleEvent<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>;
};

function createEventBus(): Emitter<AppEvents> {
  return mitt<AppEvents>();
}

const emitter = getRuntimeSingleton('eventBus', createEventBus);

export function publishEvent<K extends keyof AppEvents>(
  type: K,
  payload: AppEvents[K]['payload'],
  source: ModuleName
): void {
  emitter.emit(type, {
    type: type as string,
    payload,
    source,
    timestamp: Date.now(),
  } as AppEvents[K]);
}

export function subscribeEvent<K extends keyof AppEvents>(
  type: K,
  handler: Handler<AppEvents[K]>
): () => void {
  emitter.on(type, handler);
  return () => emitter.off(type, handler);
}

export { emitter as eventBus };
