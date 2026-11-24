import React from 'react';
import Overview from './pages/Overview.jsx';
import Hosts from './pages/Hosts.jsx';
import getDashboardPage from './utils/getDashboardPage.js';
import './styles/overview.css';

export default function App() {
  const [page, setPage] = React.useState(() => getDashboardPage(window.location.hash));

  React.useEffect(() => {
    const syncPage = () => setPage(getDashboardPage(window.location.hash));
    if (!window.location.hash) window.history.replaceState(null, '', '#/overview');
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  return page === 'hosts' ? <Hosts /> : <Overview />;
}
