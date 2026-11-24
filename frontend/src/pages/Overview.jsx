import React, { useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Icon from '../components/common/Icon.jsx';
import MetricCard from '../components/common/MetricCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { ALERTS, HOSTS, OVERVIEW_METRICS } from '../data/monitoringDemo.js';

function linePath(values, width = 730, height = 235, inset = 18, max = 100) {
  return values.map((value, index) => (
    `${index ? 'L' : 'M'} ${inset + (width - inset * 2) * index / (values.length - 1)} ${height - inset - (height - inset * 2) * value / max}`
  )).join(' ');
}

function areaPath(values, width = 730, height = 235, inset = 18) {
  return `${linePath(values, width, height, inset)} L ${width - inset} ${height - inset} L ${inset} ${height - inset} Z`;
}

function TrendChart({ range, pulse }) {
  const count = range === '1H' ? 16 : range === '6H' ? 26 : 32;
  const { cpu, ram } = useMemo(() => {
    const cpu = Array.from({ length: count }, (_, index) => Math.max(
      18,
      Math.min(89, 44 + Math.sin(index * 0.64) * 12 + Math.sin(index * 1.91) * 7 + Math.sin((index + pulse) * 0.21) * 4 + index * 0.22),
    ));
    const ram = Array.from({ length: count }, (_, index) => Math.max(
      20,
      Math.min(87, 60 + Math.sin(index * 0.34 + 0.8) * 7 + Math.cos(index * 0.98) * 4 + Math.sin((index + pulse) * 0.2) * 2),
    ));
    return { cpu, ram };
  }, [count, pulse]);
  const ticks = range === '1H'
    ? ['12:00', '12:15', '12:30', '12:45', '13:00']
    : range === '6H'
      ? ['08:00', '09:30', '11:00', '12:30', '14:00']
      : ['00:00', '06:00', '12:00', '18:00', '23:59'];

  return (
    <div className="iw-trend-wrap">
      <div className="iw-chart-axis" aria-hidden="true">
        <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
      </div>
      <div className="iw-chart-main">
        <svg className="iw-trend" viewBox="0 0 730 235" preserveAspectRatio="none" role="img" aria-label="Biểu đồ đường mô phỏng CPU và Memory theo thời gian">
          <defs>
            <linearGradient id="iw-cpu-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6385ff" stopOpacity=".30" /><stop offset="100%" stopColor="#6385ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="iw-ram-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#61e8d4" stopOpacity=".14" /><stop offset="100%" stopColor="#61e8d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[18, 68, 118, 168, 218].map((y) => <line key={y} x1="18" x2="712" y1={y} y2={y} stroke="#334260" strokeDasharray="4 7" strokeOpacity=".75" />)}
          <path d={areaPath(ram)} fill="url(#iw-ram-area)" />
          <path d={areaPath(cpu)} fill="url(#iw-cpu-area)" />
          <path d={linePath(ram)} fill="none" stroke="#5ae4d0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d={linePath(cpu)} fill="none" stroke="#7e95ff" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <circle cx="712" cy={217 - cpu.at(-1) * 1.99} r="5.5" fill="#8c9fff" stroke="#121c31" strokeWidth="3" />
        </svg>
        <div className="iw-chart-ticks">{ticks.map((tick) => <span key={tick}>{tick}</span>)}</div>
      </div>
    </div>
  );
}

function HealthRing() {
  return (
    <div className="iw-health-visual" aria-label="Health score mô phỏng 96.8 phần trăm">
      <div className="iw-orbit iw-orbit--outer" /><div className="iw-orbit iw-orbit--middle" /><div className="iw-orbit iw-orbit--inner" />
      <div className="iw-orbit-node iw-orbit-node--one" /><div className="iw-orbit-node iw-orbit-node--two" /><div className="iw-orbit-node iw-orbit-node--three" />
      <div className="iw-health-core"><span>INFRA HEALTH · DEMO</span><strong>96.8<small>%</small></strong><em><i /> Stable</em></div>
      <div className="iw-orbit-callout iw-orbit-callout--left"><i /> 5 hosts</div>
      <div className="iw-orbit-callout iw-orbit-callout--right"><Icon name="activity" size={13} /> Analytics</div>
    </div>
  );
}

function exportDemoCsv() {
  const columns = ['Host', 'IP', 'Role', 'CPU (%)', 'Memory (%)', 'Status'];
  const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const body = [columns, ...HOSTS.map((host) => [
    host.id,
    host.ip,
    host.role,
    host.cpu ?? 0,
    host.memory ?? 0,
    host.state,
  ])].map((row) => row.map(escapeCsv).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF', body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'infrawatch-demo-hosts.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function Overview() {
  const [range, setRange] = useState('6H');
  const [pulse, setPulse] = useState(0);
  const [search, setSearch] = useState('');
  const [lastRefresh, setLastRefresh] = useState('Chưa làm mới');
  const query = search.trim().toLowerCase();
  const filteredHosts = HOSTS.filter((host) => (
    `${host.id} ${host.ip} ${host.role} ${host.zone} ${host.state}`.toLowerCase().includes(query)
  ));
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const refreshDemo = () => {
    setPulse((current) => current + 1);
    setLastRefresh(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  return (
    <DashboardLayout activePage="overview" title="Tổng quan" alerts={ALERTS} onRefresh={refreshDemo}>
      <div className="iw-page">
        <div className="iw-banner">
          <Icon name="shield" size={17} />
          <span><b>PREVIEW BUILD</b> — Giao diện dùng số liệu minh họa; chưa kết nối Prometheus/FastAPI.</span>
          <span className="iw-banner-right">INFRAWATCH / M04</span>
        </div>
        <div className="iw-heading">
          <div>
            <div className="iw-eyebrow"><span /> INFRAWATCH INTELLIGENCE HUB <b>/</b> OVERVIEW</div>
            <h1>Tổng quan <span>hệ thống</span></h1>
            <p>Góc nhìn toàn diện về hiệu suất, tính sẵn sàng và sức khỏe hạ tầng.</p>
          </div>
          <div className="iw-heading-date"><Icon name="clock" size={16} /><span>DEMO · {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
        </div>
        <section className="iw-hero">
          <div className="iw-hero-copy">
            <span className="iw-hero-tag"><i /> INFRASTRUCTURE INTELLIGENCE <Icon name="spark" size={15} /></span>
            <h2>Control every layer.<br /><span>See every signal.</span></h2>
            <p>Một không gian điều hành thống nhất, giúp theo dõi tài nguyên, độ sẵn sàng và những tín hiệu bất thường trong hệ thống.</p>
            <div className="iw-hero-buttons">
              <button className="iw-primary-btn" type="button" onClick={() => scrollTo('metrics')}>Khám phá tài nguyên <Icon name="arrow" size={17} /></button>
              <a className="iw-secondary-btn" href="#/hosts">Tình trạng máy chủ</a>
            </div>
            <span className="iw-hero-foot"><i /> DEMO ENVIRONMENT / SIMULATION DATA</span>
          </div>
          <HealthRing />
        </section>
        <div className="iw-quick-status">
          <span><i className="mint" /> 3 máy chủ hoạt động ổn định</span>
          <span><i className="blue" /> 1 máy chủ cần theo dõi</span>
          <span><i className="rose" /> 1 máy chủ mất kết nối</span>
          <span className="iw-status-right">SIMULATION DATA · {lastRefresh}</span>
        </div>
        <section id="metrics" className="iw-metrics-grid" aria-label="Tổng quan tài nguyên">
          {OVERVIEW_METRICS.map((item) => <MetricCard key={item.title} item={item} pulse={pulse} />)}
        </section>
        <section className="iw-analytics-grid">
          <article className="iw-panel iw-trend-panel">
            <div className="iw-panel-head">
              <div><div className="iw-section-eyebrow">RESOURCE ANALYTICS</div><h3>Hiệu suất theo thời gian</h3><p>Biến động CPU và Memory của môi trường mô phỏng</p></div>
              <div className="iw-period" role="group" aria-label="Khoảng thời gian">
                {['1H', '6H', '24H'].map((value) => (
                  <button key={value} type="button" className={range === value ? 'is-active' : ''} aria-pressed={range === value} onClick={() => setRange(value)}>{value}</button>
                ))}
              </div>
            </div>
            <div className="iw-legend">
              <span><i className="iw-legend-cpu" /> CPU <b>42.8%</b></span>
              <span><i className="iw-legend-ram" /> Memory <b>67.4%</b></span>
              <span className="iw-chart-description"><Icon name="activity" size={15} /> {range} view</span>
            </div>
            <TrendChart range={range} pulse={pulse} />
          </article>
          <article className="iw-panel iw-distribution-panel">
            <div className="iw-panel-head">
              <div><div className="iw-section-eyebrow">INFRASTRUCTURE STATUS</div><h3>Tình trạng hạ tầng</h3><p>Phân bố máy chủ trong môi trường mẫu</p></div>
              <span className="iw-panel-kebab" aria-label="Trạng thái mẫu"><Icon name="shield" size={18} /></span>
            </div>
            <div className="iw-donut-layout">
              <div className="iw-donut" role="img" aria-label="3 healthy, 1 warning, 1 offline">
                <div className="iw-donut-center"><strong>5</strong><span>TOTAL HOSTS</span></div>
              </div>
              <div className="iw-donut-labels">
                <div><span><i className="mint" />Healthy</span><b>3 <small>60%</small></b></div>
                <div><span><i className="amber" />Warning</span><b>1 <small>20%</small></b></div>
                <div><span><i className="rose" />Offline</span><b>1 <small>20%</small></b></div>
              </div>
            </div>
            <div className="iw-distribution-foot"><Icon name="shield" size={17} /><span>DEMO · Đang theo dõi trong môi trường Lab</span></div>
          </article>
        </section>
        <section className="iw-bottom-grid">
          <article className="iw-panel iw-hosts-panel" id="hosts">
            <div className="iw-panel-head iw-panel-head--wrap">
              <div><div className="iw-section-eyebrow">HOST INVENTORY / DEMO</div><h3>Máy chủ đang giám sát</h3><p>Chọn một host để mở trang Host Monitoring.</p></div>
              <div className="iw-table-tools">
                <label className="iw-search">
                  <Icon name="search" size={16} />
                  <input aria-label="Tìm máy chủ" placeholder="Tìm kiếm máy chủ..." value={search} onChange={(event) => setSearch(event.target.value)} />
                </label>
                <button className="iw-outline-btn" type="button" onClick={exportDemoCsv} title="Xuất danh sách host mô phỏng"><Icon name="download" size={16} /><span>CSV</span></button>
              </div>
            </div>
            <div className="iw-table-scroll">
              <table>
                <thead><tr><th scope="col">MÁY CHỦ</th><th scope="col">CPU</th><th scope="col">MEMORY</th><th scope="col">TRẠNG THÁI</th></tr></thead>
                <tbody>
                  {filteredHosts.map((host) => (
                    <tr key={host.id}>
                      <td>
                        <a className="iw-host-name iw-host-link" href="#/hosts">
                          <span className="iw-host-symbol"><Icon name="server" size={18} /></span>
                          <span><strong>{host.id}</strong><small>{host.ip} · {host.role}</small></span>
                        </a>
                      </td>
                      <td><span className="iw-cell-meter"><span>{host.cpu === null ? '—' : `${host.cpu}%`}</span><span className="iw-mini-bar"><i style={{ width: `${host.cpu ?? 0}%` }} /></span></span></td>
                      <td><span className="iw-cell-meter"><span>{host.memory === null ? '—' : `${host.memory}%`}</span><span className="iw-mini-bar"><i style={{ width: `${host.memory ?? 0}%` }} /></span></span></td>
                      <td><StatusBadge state={host.state} /></td>
                    </tr>
                  ))}
                  {filteredHosts.length === 0 && <tr><td colSpan="4" className="iw-empty">Không tìm thấy máy chủ phù hợp trong dữ liệu mẫu.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="iw-table-footer"><span>Hiển thị {filteredHosts.length}/{HOSTS.length} máy chủ (demo)</span><span>Sample IPs · RFC 5737</span></div>
          </article>
          <article className="iw-panel iw-alerts-panel">
            <div className="iw-panel-head">
              <div><div className="iw-section-eyebrow">OPERATIONS FEED</div><h3>Hoạt động gần đây</h3><p>Cảnh báo và sự kiện mô phỏng</p></div>
              <span className="iw-alert-count">{ALERTS.length}</span>
            </div>
            <div className="iw-timeline">
              {ALERTS.map((alert) => (
                <div className="iw-timeline-item" key={`${alert.host}-${alert.title}`}>
                  <span className={`iw-alert-icon iw-alert-icon--${alert.severity.toLowerCase()}`}><Icon name={alert.icon} size={18} /></span>
                  <div className="iw-alert-details"><strong>{alert.title}</strong><span>{alert.host} <b>·</b> {alert.when}</span></div>
                  <span className={`iw-alert-severity iw-alert-severity--${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                </div>
              ))}
            </div>
            <div className="iw-operations-note"><Icon name="spark" size={16} /><p><strong>What's next?</strong> Các màn hình còn lại sẽ được xây theo lộ trình; API thật chưa kết nối.</p></div>
          </article>
        </section>
        <footer className="iw-footer"><span>© 2026 InfraWatch · Infrastructure Monitoring Platform</span><span>Built by <strong>M04 / Phan Tấn Thuận</strong> · UI Concept v1.1</span></footer>
      </div>
    </DashboardLayout>
  );
}
