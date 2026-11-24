import React from 'react';
import Icon from '../components/common/Icon.jsx';

const NAV_ITEMS = [
  { id: 'overview', icon: 'dashboard', label: 'Tổng quan', href: '#/overview' },
  { id: 'hosts', icon: 'server', label: 'Máy chủ', href: '#/hosts' },
];

const PLANNED_ITEMS = [
  { icon: 'box', label: 'Containers' },
  { icon: 'activity', label: 'Dịch vụ' },
  { icon: 'bell', label: 'Cảnh báo' },
];

function BrandMark() {
  return (
    <span className="iw-mark" aria-hidden="true">
      <svg viewBox="0 0 46 46" fill="none">
        <path d="m6 30 8-13 9 14 8-19 9 13" stroke="white" strokeWidth="4.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="39" cy="13" r="3.1" fill="#61E8D4" />
      </svg>
    </span>
  );
}

export default function Sidebar({ activePage, mobileOpen, onClose, onNotify }) {
  return (
    <>
      {mobileOpen && (
        <button className="iw-menu-backdrop" aria-label="Đóng thanh điều hướng" onClick={onClose} />
      )}
      <aside className={`iw-sidebar ${mobileOpen ? 'iw-sidebar--open' : ''}`} aria-label="Thanh điều hướng">
        <div className="iw-brand">
          <BrandMark />
          <div>
            <strong>InfraWatch<span className="iw-brand-dot">.</span></strong>
            <small>OBSERVABILITY PLATFORM</small>
          </div>
          <button className="iw-close-menu" type="button" onClick={onClose} aria-label="Đóng menu">
            <Icon name="close" />
          </button>
        </div>
        <div className="iw-sidebar-separator" />
        <div className="iw-nav-label">WORKSPACE</div>
        <nav className="iw-nav" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => (
            <a
              className={`iw-nav-btn ${activePage === item.id ? 'iw-nav-btn--active' : ''}`}
              href={item.href}
              key={item.id}
              aria-current={activePage === item.id ? 'page' : undefined}
              onClick={onClose}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {activePage === item.id && <span className="iw-nav-marker" />}
            </a>
          ))}
          {PLANNED_ITEMS.map((item) => (
            <button
              className="iw-nav-btn"
              type="button"
              key={item.label}
              onClick={() => onNotify(`${item.label} sẽ được xây dựng ở các ngày tiếp theo.`)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              <span className="iw-soon">Sắp có</span>
            </button>
          ))}
        </nav>
        <div className="iw-nav-label iw-nav-label--tools">TOOLS</div>
        <button
          className="iw-nav-btn iw-nav-btn--aux"
          type="button"
          onClick={() => onNotify('Chức năng cài đặt sẽ được phát triển sau Core UI.')}
        >
          <Icon name="settings" />
          <span>Cài đặt</span>
        </button>
        <div className="iw-side-bottom">
          <div className="iw-workspace-card">
            <span className="iw-micro-label"><Icon name="spark" size={13} /> PROJECT SPACE</span>
            <strong>Infrastructure Lab</strong>
            <small>UTH × VNPT NET · N4.7</small>
            <div className="iw-progress"><i /></div>
            <div className="iw-workspace-foot"><span>Core MVP</span><span>Frontend · DEMO</span></div>
          </div>
          <div className="iw-side-user">
            <span className="iw-avatar">PT</span>
            <div><strong>Phan Tấn Thuận</strong><small>M04 · Frontend Engineer</small></div>
            <span className="iw-user-ellipsis" aria-hidden="true">•••</span>
          </div>
        </div>
      </aside>
    </>
  );
}
