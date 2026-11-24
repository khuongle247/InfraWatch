import React from 'react';
import Icon from '../components/common/Icon.jsx';

function NotificationMenu({ alerts }) {
  return (
    <div className="iw-bell-menu">
      <div className="iw-bell-menu-head">
        <strong>Cảnh báo mô phỏng</strong>
        <span>{alerts.length} events</span>
      </div>
      {alerts.map((alert) => (
        <div className="iw-bell-menu-item" key={`${alert.host}-${alert.title}`}>
          <span className={`iw-alert-mini iw-alert-mini--${alert.severity.toLowerCase()}`} />
          <div><strong>{alert.title}</strong><small>{alert.host} · {alert.when}</small></div>
        </div>
      ))}
    </div>
  );
}

export default function Header({ title, alerts, bellOpen, onToggleBell, onOpenMenu, onRefresh }) {
  return (
    <header className="iw-topbar">
      <div className="iw-breadcrumb">
        <button className="iw-menu-btn" type="button" onClick={onOpenMenu} aria-label="Mở menu">
          <Icon name="bars" />
        </button>
        <span className="iw-overline">WORKSPACE</span>
        <Icon name="chevron" size={15} />
        <strong>{title}</strong>
      </div>
      <div className="iw-top-actions">
        <span className="iw-mock-pill"><i /> DEMO · MOCK DATA</span>
        <span className="iw-top-divider" />
        <div className="iw-bell-wrap">
          <button
            className="iw-icon-btn iw-notify-btn"
            type="button"
            aria-label="Xem cảnh báo mô phỏng"
            aria-expanded={bellOpen}
            onClick={onToggleBell}
          >
            <Icon name="bell" size={19} />
            {alerts.length > 0 && <i />}
          </button>
          {bellOpen && <NotificationMenu alerts={alerts} />}
        </div>
        <button className="iw-refresh" type="button" onClick={onRefresh}>
          <Icon name="refresh" size={17} />
          <span>Làm mới</span>
        </button>
      </div>
    </header>
  );
}
