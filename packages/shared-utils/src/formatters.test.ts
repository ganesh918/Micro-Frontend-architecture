import { describe, expect, it } from 'vitest';
import { formatCurrency, formatNumber, formatPercent } from './formatters';

describe('formatters', () => {
  it('formats currency values', () => {
    expect(formatCurrency(284500)).toBe('$284,500.00');
  });

  it('formats large numbers compactly', () => {
    expect(formatNumber(3842)).toBe('3,842');
  });

  it('formats percentages with sign', () => {
    expect(formatPercent(12.5)).toBe('+12.5%');
    expect(formatPercent(-0.8)).toBe('-0.8%');
  });
});
