import { useEffect, useState } from 'react';
import getDashboardPage from '../utils/getDashboardPage.js';

export default function useDashboardRoute() {
  const [page, setPage] = useState(() => getDashboardPage(window.location.hash));

  useEffect(() => {
    const syncPage = () => setPage(getDashboardPage(window.location.hash));
    if (!window.location.hash) window.history.replaceState(null, '', '#/overview');
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  return page;
}
