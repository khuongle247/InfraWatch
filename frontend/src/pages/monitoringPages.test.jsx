import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Alerts from './Alerts.jsx';
import Containers from './Containers.jsx';
import Services from './Services.jsx';

describe('monitoring screen prototypes', () => {
  it('renders the container inventory, selected details, and route link', () => {
    const markup = renderToStaticMarkup(<Containers />);

    expect(markup).toContain('DEMO / MOCK DATA');
    expect(markup).toContain('Giám sát <span>containers</span>');
    expect(markup).toContain('infrawatch-prometheus');
    expect(markup).toContain('href="#/containers"');
  });

  it('renders the service catalog, selected details, and route link', () => {
    const markup = renderToStaticMarkup(<Services />);

    expect(markup).toContain('DEMO / MOCK DATA');
    expect(markup).toContain('Giám sát <span>dịch vụ</span>');
    expect(markup).toContain('Prometheus');
    expect(markup).toContain('href="#/services"');
  });

  it('renders the alert event list, selected details, and route link', () => {
    const markup = renderToStaticMarkup(<Alerts />);

    expect(markup).toContain('DEMO / MOCK DATA');
    expect(markup).toContain('Trung tâm <span>cảnh báo</span>');
    expect(markup).toContain('Host CPU usage vượt ngưỡng');
    expect(markup).toContain('href="#/alerts"');
  });
});
