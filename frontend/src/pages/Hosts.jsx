import React, { useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Icon from '../components/common/Icon.jsx';
import MetricCard from '../components/common/MetricCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { ALERTS, HOSTS } from '../data/monitoringDemo.js';
import '../styles/hosts.css';

const TIME_RANGES = ['1H', '6H', '24H'];

function HostHistory({ host, range }) {
  const series = useMemo(() => {
    if (host.state === 'Offline') return null;

    const pointCount = range === '1H' ? 16 : range === '6H' ? 26 : 32;
    const makeSeries = (base, amplitude, phase) => Array.from({ length: pointCount }, (_, index) => (
      Math.max(4, Math.min(96, base + Math.sin(index * 0.58 + phase) * amplitude + Math.cos(index * 0.21) * 3))
    ));

    return {
      cpu: makeSeries(host.cpu, 10, 0.3),
      memory: makeSeries(host.memory, 5, 1.1),
      disk: makeSeries(host.disk, 2, 2.2),
    };
  }, [host, range]);

  if (!series) {
    return (
      <div className="iw-host-chart-empty" role="status">
        <Icon name="activity" size={22} />
        <strong>Không có metrics trong dữ liệu demo</strong>
        <span>Host đang ở trạng thái Offline.</span>
      </div>
    );
  }

  const pathFor = (values) => values.map((value, index) => {
    const x = 48 + (index * 630) / (values.length - 1);
    const y = 216 - (value / 100) * 184;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg className="iw-host-chart" viewBox="0 0 700 252" role="img" aria-labelledby="host-chart-title host-chart-desc">
      <title id="host-chart-title">CPU, Memory và Disk của {host.id} · dữ liệu mô phỏng</title>
      <desc id="host-chart-desc">Biểu đồ lịch sử minh họa trong khoảng {range}, không phải metrics trực tiếp.</desc>
      <g className="iw-host-chart-grid">
        {[32, 78, 124, 170, 216].map((y) => <line key={y} x1="48" x2="678" y1={y} y2={y} />)}
      </g>
      <g className="iw-host-chart-labels">
        <text x="5" y="36">100%</text><text x="13" y="82">75%</text><text x="13" y="128">50%</text><text x="13" y="174">25%</text><text x="22" y="220">0%</text>
        <text x="48" y="242">Bắt đầu</text><text x="340" y="242">Giữa kỳ</text><text x="632" y="242">Hiện tại</text>
      </g>
      <path d={pathFor(series.disk)} className="iw-host-line iw-host-line--disk" />
      <path d={pathFor(series.memory)} className="iw-host-line iw-host-line--memory" />
      <path d={pathFor(series.cpu)} className="iw-host-line iw-host-line--cpu" />
    </svg>
  );
}

function HostInventory({ hosts, selectedHostId, onSelect, search, onSearch, status, onStatus }) {
  return (
    <section className="iw-panel iw-host-inventory" aria-labelledby="host-inventory-title">
      <div className="iw-panel-head iw-panel-head--wrap">
        <div>
          <div className="iw-section-eyebrow">HOST INVENTORY / DEMO</div>
          <h3 id="host-inventory-title">Danh sách máy chủ</h3>
          <p>Chọn một host để xem metrics minh họa.</p>
        </div>
        <div className="iw-host-table-tools">
          <label className="iw-search">
            <Icon name="search" size={16} />
            <input aria-label="Tìm máy chủ" placeholder="Tên, IP hoặc zone..." value={search} onChange={(event) => onSearch(event.target.value)} />
          </label>
          <label className="iw-host-filter">
            <span className="visually-hidden">Lọc theo trạng thái</span>
            <select aria-label="Lọc theo trạng thái" value={status} onChange={(event) => onStatus(event.target.value)}>
              <option value="All">Tất cả trạng thái</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Offline">Offline</option>
            </select>
          </label>
        </div>
      </div>
      <div className="iw-host-table-scroll">
        <table className="iw-host-table">
          <thead>
            <tr><th scope="col">MÁY CHỦ</th><th scope="col">CPU</th><th scope="col">MEMORY</th><th scope="col">DISK</th><th scope="col">TRẠNG THÁI</th><th scope="col">ZONE</th></tr>
          </thead>
          <tbody>
            {hosts.map((host) => (
              <tr key={host.id} className={selectedHostId === host.id ? 'is-selected' : ''} aria-selected={selectedHostId === host.id}>
                <td>
                  <button className="iw-host-select" type="button" onClick={() => onSelect(host.id)} aria-pressed={selectedHostId === host.id}>
                    <strong>{host.id}</strong><small>{host.ip} · {host.role}</small>
                  </button>
                </td>
                <td>{host.cpu === null ? '—' : `${host.cpu}%`}</td>
                <td>{host.memory === null ? '—' : `${host.memory}%`}</td>
                <td>{host.disk === null ? '—' : `${host.disk}%`}</td>
                <td><StatusBadge state={host.state} /></td>
                <td>{host.zone}</td>
              </tr>
            ))}
            {hosts.length === 0 && <tr><td className="iw-host-empty" colSpan="6">Không tìm thấy máy chủ phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="iw-table-footer"><span>Hiển thị {hosts.length}/{HOSTS.length} máy chủ (demo)</span><span>Sample IPs · RFC 5737</span></div>
    </section>
  );
}

export default function Hosts() {
  const [selectedHostId, setSelectedHostId] = useState('lab-app-02');
  const [range, setRange] = useState('6H');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const selectedHost = HOSTS.find((host) => host.id === selectedHostId) || HOSTS[0];
  const filteredHosts = HOSTS.filter((host) => {
    const query = search.trim().toLowerCase();
    const matchesQuery = !query || `${host.id} ${host.ip} ${host.role} ${host.zone}`.toLowerCase().includes(query);
    const matchesStatus = status === 'All' || host.state === status;
    return matchesQuery && matchesStatus;
  });
  const metrics = [
    { title: 'CPU Usage', value: selectedHost.cpu, unit: selectedHost.cpu === null ? '' : '%', subtitle: 'Utilization · DEMO', color: 'blue', icon: 'cpu' },
    { title: 'Memory Usage', value: selectedHost.memory, unit: selectedHost.memory === null ? '' : '%', subtitle: 'Utilization · DEMO', color: 'violet', icon: 'memory' },
    { title: 'Disk Usage', value: selectedHost.disk, unit: selectedHost.disk === null ? '' : '%', subtitle: 'Root filesystem · DEMO', color: 'mint', icon: 'database' },
    { title: 'Network I/O', value: selectedHost.network, unit: selectedHost.network === null ? '' : 'Mb/s', subtitle: 'Aggregate traffic · DEMO', color: 'amber', icon: 'network' },
  ];

  return (
    <DashboardLayout activePage="hosts" title="Máy chủ" alerts={ALERTS}>
      <div className="iw-page iw-host-page">
        <div className="iw-banner">
          <Icon name="shield" size={17} />
          <span><b>DEMO / MOCK DATA</b> — Host Monitoring prototype; chưa kết nối Prometheus/FastAPI.</span>
          <span className="iw-banner-right">INFRAWATCH / M04</span>
        </div>
        <div className="iw-heading iw-host-heading">
          <div>
            <div className="iw-eyebrow"><span /> INFRAWATCH / INFRASTRUCTURE / HOSTS</div>
            <h1>Giám sát <span>máy chủ</span></h1>
            <p>Đi từ inventory tới xu hướng tài nguyên và thông tin vận hành của từng host.</p>
          </div>
          <label className="iw-host-picker">
            <span>Host đang xem</span>
            <select value={selectedHostId} onChange={(event) => setSelectedHostId(event.target.value)} aria-label="Chọn host đang xem">
              {HOSTS.map((host) => <option key={host.id} value={host.id}>{host.id}</option>)}
            </select>
          </label>
        </div>

        <div className="iw-host-summary" aria-label="Trạng thái host đang chọn">
          <StatusBadge state={selectedHost.state} />
          <strong>{selectedHost.id}</strong>
          <span>{selectedHost.role}</span>
          <span>{selectedHost.ip}</span>
          <span className="iw-host-updated">Demo snapshot · 24/11/2026</span>
        </div>

        <section className="iw-metrics-grid iw-host-metrics" aria-label="Tài nguyên host (demo)">
          {metrics.map((item) => <MetricCard key={item.title} item={item} signalLabel="DEMO" />)}
        </section>

        <section className="iw-host-detail-grid">
          <article className="iw-panel iw-host-chart-panel">
            <div className="iw-panel-head">
              <div>
                <div className="iw-section-eyebrow">RESOURCE HISTORY / SIMULATED</div>
                <h3>Xu hướng tài nguyên</h3>
                <p>CPU, Memory và Disk của {selectedHost.id} · dữ liệu mô phỏng</p>
              </div>
              <div className="iw-period" role="group" aria-label="Khoảng thời gian">
                {TIME_RANGES.map((timeRange) => (
                  <button key={timeRange} type="button" className={range === timeRange ? 'is-active' : ''} aria-pressed={range === timeRange} onClick={() => setRange(timeRange)}>
                    {timeRange}
                  </button>
                ))}
              </div>
            </div>
            <div className="iw-host-chart-legend">
              <span><i className="iw-host-legend-cpu" /> CPU</span>
              <span><i className="iw-host-legend-memory" /> Memory</span>
              <span><i className="iw-host-legend-disk" /> Disk</span>
              <span className="iw-host-range-note">{range} · mock</span>
            </div>
            <HostHistory host={selectedHost} range={range} />
          </article>
          <article className="iw-panel iw-host-metadata">
            <div className="iw-panel-head">
              <div><div className="iw-section-eyebrow">HOST PROFILE</div><h3>Thông tin máy chủ</h3><p>Metadata minh họa phục vụ nhận diện host.</p></div>
            </div>
            <dl>
              <div><dt>Hostname</dt><dd>{selectedHost.id}</dd></div>
              <div><dt>Role</dt><dd>{selectedHost.role}</dd></div>
              <div><dt>Operating system</dt><dd>Ubuntu Linux · DEMO</dd></div>
              <div><dt>Uptime</dt><dd>{selectedHost.uptime}</dd></div>
              <div><dt>Exporter</dt><dd>Node Exporter · sample</dd></div>
              <div><dt>Monitoring zone</dt><dd>{selectedHost.zone}</dd></div>
            </dl>
            <div className="iw-host-meta-foot"><Icon name="clock" size={15} /> Timestamp and labels are illustrative.</div>
          </article>
        </section>

        <HostInventory
          hosts={filteredHosts}
          selectedHostId={selectedHostId}
          onSelect={setSelectedHostId}
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
        />
        <p className="iw-host-footer-note">DEMO ONLY · Không dùng các giá trị trên để đánh giá hệ thống thật. Ngưỡng cảnh báo và API contract cần được thống nhất trước khi tích hợp.</p>
      </div>
    </DashboardLayout>
  );
}
