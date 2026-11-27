import React, { useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import DemoBanner from '../components/common/DemoBanner.jsx';
import Icon from '../components/common/Icon.jsx';
import PageHeading from '../components/common/PageHeading.jsx';
import SummaryStat from '../components/common/SummaryStat.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { ALERTS, ALERT_EVENTS } from '../data/monitoringDemo.js';

const SEVERITIES = ['All', 'Critical', 'High', 'Warning', 'Info'];
const ALERT_STATES = ['All', 'Firing', 'Acknowledged', 'Resolved'];

function AlertDetail({ alert }) {
  if (!alert) {
    return (
      <div className="iw-panel iw-monitor-detail iw-monitor-empty" role="status">
        <Icon name="bell" size={26} />
        <strong>Không tìm thấy cảnh báo</strong>
        <span>Chọn một cảnh báo trong danh sách để xem chi tiết.</span>
      </div>
    );
  }

  return (
    <article className="iw-panel iw-monitor-detail iw-alert-detail" aria-labelledby="alert-detail-title">
      <div className="iw-panel-head">
        <div><div className="iw-section-eyebrow">ALERT DETAILS / DEMO</div><h3 id="alert-detail-title">Chi tiết cảnh báo</h3><p>Thông tin sự kiện trong dữ liệu mẫu.</p></div>
      </div>
      <div className="iw-alert-detail-title">
        <span className={`iw-alert-detail-icon iw-alert-detail-icon--${alert.severity.toLowerCase()}`}><Icon name={alert.icon} size={22} /></span>
        <div><strong>{alert.title}</strong><span>{alert.source} · {alert.group}</span></div>
      </div>
      <div className="iw-alert-badges"><StatusBadge state={alert.severity} /><StatusBadge state={alert.state} /></div>
      <p className="iw-alert-summary">{alert.summary}</p>
      <dl className="iw-monitor-meta">
        <div><dt>Alert ID</dt><dd>{alert.id}</dd></div>
        <div><dt>Source</dt><dd>{alert.source}</dd></div>
        <div><dt>Started</dt><dd>{alert.startedAt}</dd></div>
        <div><dt>Duration</dt><dd>{alert.duration}</dd></div>
        <div><dt>Owner</dt><dd>{alert.owner}</dd></div>
      </dl>
      <div className="iw-alert-description"><strong>Thông tin bổ sung</strong><p>{alert.description}</p></div>
      <div className="iw-monitor-note"><Icon name="shield" size={15} /> Không có hành động acknowledge/resolve thật trong prototype.</div>
    </article>
  );
}

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(ALERT_EVENTS[0]?.id ?? '');
  const filteredAlerts = useMemo(() => ALERT_EVENTS.filter((alert) => {
    const matchesText = `${alert.title} ${alert.source} ${alert.group} ${alert.summary}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesText
      && (severityFilter === 'All' || alert.severity === severityFilter)
      && (stateFilter === 'All' || alert.state === stateFilter);
  }), [query, severityFilter, stateFilter]);
  const selectedAlert = ALERT_EVENTS.find((alert) => alert.id === selectedId);
  const firingCount = ALERT_EVENTS.filter((alert) => alert.state === 'Firing').length;
  const criticalCount = ALERT_EVENTS.filter((alert) => alert.severity === 'Critical' && alert.state !== 'Resolved').length;
  const acknowledgedCount = ALERT_EVENTS.filter((alert) => alert.state === 'Acknowledged').length;
  const resolvedCount = ALERT_EVENTS.filter((alert) => alert.state === 'Resolved').length;

  return (
    <DashboardLayout activePage="alerts" title="Cảnh báo" alerts={ALERTS}>
      <div className="iw-page iw-monitor-page">
        <DemoBanner><b>DEMO / MOCK DATA</b> — Alert Center prototype; chưa kết nối Alertmanager và không gửi thông báo.</DemoBanner>
        <PageHeading
          eyebrow="INFRAWATCH / OPERATIONS / ALERT CENTER"
          title="Trung tâm"
          highlight="cảnh báo"
          description="Ưu tiên sự cố theo mức độ, theo dõi trạng thái và xem ngữ cảnh của từng sự kiện."
          action={<span className="iw-monitor-snapshot"><Icon name="clock" size={15} /> DEMO SNAPSHOT · 24/11/2026</span>}
        />
        <section className="iw-summary-grid" aria-label="Thống kê cảnh báo (demo)">
          <SummaryStat label="Đang kích hoạt" value={firingCount} detail="Trạng thái Firing" icon="bell" tone="rose" />
          <SummaryStat label="Critical đang mở" value={criticalCount} detail="Ưu tiên xử lý cao nhất" icon="activity" tone="amber" />
          <SummaryStat label="Đã tiếp nhận" value={acknowledgedCount} detail="Acknowledged · demo" icon="check" tone="blue" />
          <SummaryStat label="Đã khôi phục" value={resolvedCount} detail="Resolved · demo" icon="shield" tone="mint" />
        </section>

        <section className="iw-alert-workspace">
          <div className="iw-panel iw-alert-list-panel">
            <div className="iw-panel-head iw-panel-head--wrap">
              <div><div className="iw-section-eyebrow">EVENT STREAM / DEMO</div><h3>Cảnh báo và sự kiện</h3><p>Sắp xếp theo thời gian bắt đầu trong bộ dữ liệu mẫu.</p></div>
              <label className="iw-search iw-alert-search">
                <Icon name="search" size={16} />
                <input aria-label="Tìm cảnh báo" placeholder="Tìm tiêu đề, nguồn..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
            </div>
            <div className="iw-alert-filters">
              <label><span>Mức độ</span><select aria-label="Lọc theo mức độ" value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>{SEVERITIES.map((value) => <option key={value} value={value}>{value === 'All' ? 'Tất cả' : value}</option>)}</select></label>
              <label><span>Trạng thái</span><select aria-label="Lọc theo trạng thái cảnh báo" value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>{ALERT_STATES.map((value) => <option key={value} value={value}>{value === 'All' ? 'Tất cả' : value}</option>)}</select></label>
              <span className="iw-alert-result-count">{filteredAlerts.length} sự kiện</span>
            </div>
            <div className="iw-alert-event-list">
              {filteredAlerts.map((alert) => (
                <button
                  type="button"
                  className={`iw-alert-event ${selectedId === alert.id ? 'is-selected' : ''}`}
                  key={alert.id}
                  onClick={() => setSelectedId(alert.id)}
                  aria-pressed={selectedId === alert.id}
                >
                  <span className={`iw-alert-event-icon iw-alert-event-icon--${alert.severity.toLowerCase()}`}><Icon name={alert.icon} size={18} /></span>
                  <span className="iw-alert-event-main"><strong>{alert.title}</strong><small>{alert.source} · {alert.when}</small><span>{alert.summary}</span></span>
                  <span className="iw-alert-event-badges"><StatusBadge state={alert.severity} /><StatusBadge state={alert.state} /></span>
                </button>
              ))}
              {filteredAlerts.length === 0 && <div className="iw-monitor-empty iw-monitor-empty--inline" role="status"><Icon name="search" /><strong>Không có cảnh báo phù hợp</strong><span>Thử thay đổi bộ lọc mức độ hoặc trạng thái.</span></div>}
            </div>
            <div className="iw-table-footer"><span>Hiển thị {filteredAlerts.length}/{ALERT_EVENTS.length} sự kiện</span><span>MOCK DATA · NO ACTIONS</span></div>
          </div>
          <AlertDetail alert={selectedAlert} />
        </section>
        <p className="iw-monitor-footer-note">DEMO ONLY · Acknowledge, resolve và gửi notification chưa được triển khai hoặc kết nối.</p>
      </div>
    </DashboardLayout>
  );
}
