import { describe, expect, it } from 'vitest';
import getDashboardPage from './getDashboardPage.js';

describe('dashboard hash navigation', () => {
  it.each([
    ['overview', 'overview'],
    ['hosts', 'hosts'],
    ['containers', 'containers'],
    ['services', 'services'],
    ['alerts', 'alerts'],
  ])('resolves the #/%s screen', (route, page) => {
    expect(getDashboardPage(`#/${route}`)).toBe(page);
  });

  it('uses overview as the default for the root and unknown routes', () => {
    expect(getDashboardPage('')).toBe('overview');
    expect(getDashboardPage('#/')).toBe('overview');
    expect(getDashboardPage('#/unknown')).toBe('overview');
  });

  it('keeps nested host paths mapped to the hosts screen', () => {
    expect(getDashboardPage('#/hosts/lab-core-01')).toBe('hosts');
  });
});
