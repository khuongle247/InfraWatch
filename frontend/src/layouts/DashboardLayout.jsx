import React, { useEffect, useState } from 'react';
import Icon from '../components/common/Icon.jsx';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function DashboardLayout({ activePage, title, alerts = [], onRefresh, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const refresh = () => {
    onRefresh?.();
    setNotice('Đã làm mới dữ liệu mô phỏng — chưa kết nối API.');
  };

  return (
    <div className="iw-app">
      <Sidebar
        activePage={activePage}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNotify={setNotice}
      />
      <main className="iw-main">
        <Header
          title={title}
          alerts={alerts}
          bellOpen={bellOpen}
          onToggleBell={() => setBellOpen((open) => !open)}
          onOpenMenu={() => setMobileOpen(true)}
          onRefresh={refresh}
        />
        {children}
      </main>
      {notice && (
        <div className="iw-toast" role="status">
          <Icon name="check" size={17} />
          {notice}
          <button type="button" aria-label="Đóng thông báo" onClick={() => setNotice('')}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
