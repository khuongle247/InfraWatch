import React from 'react';
import Overview from './pages/Overview.jsx';
import Hosts from './pages/Hosts.jsx';
import Containers from './pages/Containers.jsx';
import Services from './pages/Services.jsx';
import Alerts from './pages/Alerts.jsx';
import useDashboardRoute from './hooks/useDashboardRoute.js';
import './styles/overview.css';
import './styles/monitoring.css';

const DASHBOARD_PAGES = {
  overview: Overview,
  hosts: Hosts,
  containers: Containers,
  services: Services,
  alerts: Alerts,
};

export default function App() {
  const page = useDashboardRoute();
  const Page = DASHBOARD_PAGES[page];
  return <Page />;
}
