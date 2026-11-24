import { describe, expect, it } from 'vitest';
import getDashboardPage from './getDashboardPage.js';

describe('dashboard hash navigation', () => {
  it('resolves the host monitoring route', () => {
    expect(getDashboardPage('#/hosts')).toBe('hosts');
  });

  it('resolves nested host routes to the host page', () => {
    expect(getDashboardPage('#/hosts/lab-core-01')).toBe('hosts');
  });

  it('uses overview as the default for the root and unknown routes', () => {
    expect(getDashboardPage('')).toBe('overview');
    expect(getDashboardPage('#/')).toBe('overview');
    expect(getDashboardPage('#/unknown')).toBe('overview');
  });
});
