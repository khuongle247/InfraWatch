import React, { useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import DemoBanner from '../components/common/DemoBanner.jsx';
import Icon from '../components/common/Icon.jsx';
import PageHeading from '../components/common/PageHeading.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import SummaryStat from '../components/common/SummaryStat.jsx';
import { ALERTS, CONTAINERS } from '../data/monitoringDemo.js';

const STATE_FILTERS = ['All', 'Running', 'Warning', 'Stopped'];

function ContainerDetail({ container }) {
  if (!container) {
    return (
      <div className="iw-panel iw-monitor-detail iw-monitor-empty" role="status">
        <Icon name="box" size={26} />
        <strong>Không tìm thấy container</strong>
        <span>Chọn một mục trong danh sách để xem thông tin mẫu.</span>
      </div>
    );
  }

  const isStopped = container.state === 'Stopped';
  return (
    <article className="iw-panel iw-monitor-detail" aria-labelledby="container-detail-title">
      <div className="iw-panel-head">
        <div>
          <div className="iw-section-eyebrow">CONTAINER PROFILE / DEMO</div>
          <h3 id="container-detail-title">Chi tiết container</h3>
          <p>Thông tin cấu hình và mức sử dụng minh họa.</p>
        </div>
        <StatusBadge state={container.state} />
      </div>
      <div className="iw-monitor-entity">
        <span className="iw-monitor-entity-icon"><Icon name="box" size={23} /></span>
        <div><strong>{container.name}</strong><span>{container.image}</span></div>
      </div>
      <dl className="iw-monitor-meta">
        <div><dt>Container ID</dt><dd>{container.id}</dd></div>
        <div><dt>Host</dt><dd>{container.host}</dd></div>
        <div><dt>Ports</dt><dd>{container.ports}</dd></div>
        <div><dt>Uptime</dt><dd>{container.uptime}</dd></div>
        <div><dt>Restart count</dt><dd>{container.restarts}</dd></div>
      </dl>
      <div className="iw-detail-meter-group">
        <div className="iw-detail-meter-head"><span>CPU utilization</span><strong>{isStopped ? '—' : `${container.cpu}%`}</strong></div>
        <div className="iw-detail-meter"><i className="iw-detail-meter-fill iw-detail-meter-fill--blue" style={{ width: `${isStopped ? 0 : container.cpu}%` }} /></div>
        <div className="iw-detail-meter-head"><span>Memory working set</span><strong>{isStopped ? '—' : `${container.memory}%`}</strong></div>
        <div className="iw-detail-meter"><i className="iw-detail-meter-fill iw-detail-meter-fill--mint" style={{ width: `${isStopped ? 0 : container.memory}%` }} /></div>
      </div>
      <div className="iw-monitor-note"><Icon name="shield" size={15} /> Giá trị chỉ dùng cho prototype; không phản ánh Docker/cAdvisor thực.</div>
    </article>
  );
}

export default function Containers() {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(CONTAINERS[0]?.id ?? '');
  const filteredContainers = useMemo(() => CONTAINERS.filter((container) => {
    const matchesText = `${container.name} ${container.image} ${container.host} ${container.id}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesText && (stateFilter === 'All' || container.state === stateFilter);
  }), [query, stateFilter]);
  const selectedContainer = CONTAINERS.find((container) => container.id === selectedId);
  const runningCount = CONTAINERS.filter((container) => container.state === 'Running').length;
  const warningCount = CONTAINERS.filter((container) => container.state === 'Warning').length;
  const stoppedCount = CONTAINERS.filter((container) => container.state === 'Stopped').length;

  return (
    <DashboardLayout activePage="containers" title="Containers" alerts={ALERTS}>
      <div className="iw-page iw-monitor-page">
        <DemoBanner><b>DEMO / MOCK DATA</b> — Container Monitoring prototype; chưa kết nối Docker/cAdvisor.</DemoBanner>
        <PageHeading
          eyebrow="INFRAWATCH / INFRASTRUCTURE / CONTAINERS"
          title="Giám sát"
          highlight="containers"
          description="Theo dõi vòng đời, mức sử dụng và trạng thái các container trong môi trường mẫu."
          action={<span className="iw-monitor-snapshot"><Icon name="clock" size={15} /> DEMO SNAPSHOT · 24/11/2026</span>}
        />
        <section className="iw-summary-grid" aria-label="Thống kê containers (demo)">
          <SummaryStat label="Tổng containers" value={CONTAINERS.length} detail="Đối tượng trong dữ liệu mẫu" icon="box" />
          <SummaryStat label="Đang chạy" value={runningCount} detail="Trạng thái Running" icon="check" tone="mint" />
          <SummaryStat label="Cần theo dõi" value={warningCount} detail="Có cảnh báo minh họa" icon="activity" tone="amber" />
          <SummaryStat label="Đã dừng" value={stoppedCount} detail="Không có metrics hiện tại" icon="close" tone="rose" />
        </section>

        <section className="iw-monitor-grid">
          <div className="iw-panel iw-monitor-list-panel">
            <div className="iw-panel-head iw-panel-head--wrap">
              <div><div className="iw-section-eyebrow">CONTAINER INVENTORY / DEMO</div><h3>Danh sách containers</h3><p>Chọn một container để xem chi tiết bên cạnh.</p></div>
              <div className="iw-monitor-tools">
                <label className="iw-search">
                  <Icon name="search" size={16} />
                  <input aria-label="Tìm container" placeholder="Tên, image hoặc host..." value={query} onChange={(event) => setQuery(event.target.value)} />
                </label>
                <label className="iw-filter-select">
                  <span className="visually-hidden">Lọc trạng thái container</span>
                  <select aria-label="Lọc trạng thái container" value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
                    {STATE_FILTERS.map((filter) => <option value={filter} key={filter}>{filter === 'All' ? 'Tất cả trạng thái' : filter}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="iw-entity-list">
              {filteredContainers.map((container) => (
                <button
                  type="button"
                  className={`iw-entity-row ${selectedId === container.id ? 'is-selected' : ''}`}
                  key={container.id}
                  onClick={() => setSelectedId(container.id)}
                  aria-pressed={selectedId === container.id}
                >
                  <span className="iw-entity-row-icon"><Icon name="box" size={18} /></span>
                  <span className="iw-entity-row-main"><strong>{container.name}</strong><small>{container.image}</small></span>
                  <span className="iw-entity-row-metrics"><span>CPU <b>{container.state === 'Stopped' ? '—' : `${container.cpu}%`}</b></span><span>MEM <b>{container.state === 'Stopped' ? '—' : `${container.memory}%`}</b></span></span>
                  <StatusBadge state={container.state} />
                  <span className="iw-entity-row-chevron"><Icon name="chevron" size={16} /></span>
                </button>
              ))}
              {filteredContainers.length === 0 && <div className="iw-monitor-empty iw-monitor-empty--inline" role="status"><Icon name="search" /><strong>Không có kết quả phù hợp</strong><span>Thử đổi từ khóa hoặc trạng thái lọc.</span></div>}
            </div>
            <div className="iw-table-footer"><span>Hiển thị {filteredContainers.length}/{CONTAINERS.length} containers</span><span>MOCK DATA</span></div>
          </div>
          <ContainerDetail container={selectedContainer} />
        </section>
        <p className="iw-monitor-footer-note">DEMO ONLY · Không dùng các giá trị trên để đánh giá môi trường Docker thật.</p>
      </div>
    </DashboardLayout>
  );
}
