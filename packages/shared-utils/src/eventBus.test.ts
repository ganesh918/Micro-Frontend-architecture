import { beforeEach, describe, expect, it, vi } from 'vitest';
import { publishEvent, subscribeEvent } from './eventBus';

describe('eventBus', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('delivers typed events to subscribers', () => {
    const handler = vi.fn();
    const unsubscribe = subscribeEvent('toast:show', handler);

    publishEvent('toast:show', { message: 'Hello', type: 'success' }, 'dashboard');

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].payload.message).toBe('Hello');
    expect(handler.mock.calls[0][0].source).toBe('dashboard');

    unsubscribe();
    publishEvent('toast:show', { message: 'Again', type: 'info' }, 'dashboard');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('supports cross-module user update events', () => {
    const handler = vi.fn();
    subscribeEvent('user:updated', handler);

    publishEvent('user:updated', { userId: '42' }, 'user-management');

    expect(handler.mock.calls[0][0].payload.userId).toBe('42');
  });
});
