import React, { useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import DemoBanner from '../components/common/DemoBanner.jsx';
import Icon from '../components/common/Icon.jsx';
import PageHeading from '../components/common/PageHeading.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import SummaryStat from '../components/common/SummaryStat.jsx';
import { ALERTS, SERVICES } from '../data/monitoringDemo.js';

const SERVICE_FILTERS = ['All', 'Healthy', 'Warning', 'Offline'];

function ServiceDetail({ service }) {
  if (!service) {
    return (
      <div className="iw-panel iw-monitor-detail iw-monitor-empty" role="status">
        <Icon name="activity" size={26} />
        <strong>Không tìm thấy service</strong>
        <span>Chọn một service trong danh sách để xem thông tin mẫu.</span>
      </div>
    );
  }

  return (
    <article className="iw-panel iw-monitor-detail" aria-labelledby="service-detail-title">
      <div className="iw-panel-head">
        <div><div className="iw-section-eyebrow">SERVICE PROFILE / DEMO</div><h3 id="service-detail-title">Chi tiết service</h3><p>{service.description}</p></div>
        <StatusBadge state={service.state} />
      </div>
      <div className="iw-monitor-entity">
        <span className="iw-monitor-entity-icon iw-monitor-entity-icon--service"><Icon name={service.icon} size={22} /></span>
        <div><strong>{service.name}</strong><span>{service.category} · {service.host}</span></div>
      </div>
      <dl className="iw-monitor-meta">
        <div><dt>Endpoint</dt><dd>{service.endpoint}</dd></div>
        <div><dt>Protocol</dt><dd>{service.protocol}</dd></div>
        <div><dt>Uptime window</dt><dd>{service.uptime}</dd></div>
        <div><dt>Dependencies</dt><dd>{service.dependencies.join(', ') || 'Không có'}</dd></div>
        <div><dt>Last check</dt><dd>DEMO · 24/11/2026</dd></div>
      </dl>
      <div className="iw-service-kpi-grid">
        <div><span>Latency</span><strong>{service.latency}</strong></div>
        <div><span>Requests / min</span><strong>{service.requests}</strong></div>
      </div>
      <div className="iw-monitor-note"><Icon name="shield" size={15} /> Health check và các số liệu được mô phỏng; không gọi endpoint thật.</div>
    </article>
  );
}

export default function Services() {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(SERVICES[0]?.id ?? '');
  const filteredServices = useMemo(() => SERVICES.filter((service) => {
    const matchesText = `${service.name} ${service.category} ${service.host} ${service.endpoint}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesText && (stateFilter === 'All' || service.state === stateFilter);
  }), [query, stateFilter]);
  const selectedService = SERVICES.find((service) => service.id === selectedId);
  const healthyCount = SERVICES.filter((service) => service.state === 'Healthy').length;
  const warningCount = SERVICES.filter((service) => service.state === 'Warning').length;
  const offlineCount = SERVICES.filter((service) => service.state === 'Offline').length;

  return (
    <DashboardLayout activePage="services" title="Dịch vụ" alerts={ALERTS}>
      <div className="iw-page iw-monitor-page">
        <DemoBanner><b>DEMO / MOCK DATA</b> — Service Monitoring prototype; chưa chạy health check hoặc gọi API service.</DemoBanner>
        <PageHeading
          eyebrow="INFRAWATCH / OPERATIONS / SERVICES"
          title="Giám sát"
          highlight="dịch vụ"
          description="Một góc nhìn mẫu về trạng thái, health check và các chỉ số vận hành của dịch vụ."
          action={<span className="iw-monitor-snapshot"><Icon name="clock" size={15} /> DEMO SNAPSHOT · 24/11/2026</span>}
        />
        <section className="iw-summary-grid" aria-label="Thống kê services (demo)">
          <SummaryStat label="Tổng dịch vụ" value={SERVICES.length} detail="Thành phần trong dữ liệu mẫu" icon="activity" />
          <SummaryStat label="Hoạt động ổn định" value={healthyCount} detail="Trạng thái Healthy" icon="check" tone="mint" />
          <SummaryStat label="Cần chú ý" value={warningCount} detail="Có cảnh báo minh họa" icon="bell" tone="amber" />
          <SummaryStat label="Không khả dụng" value={offlineCount} detail="Trạng thái Offline" icon="close" tone="rose" />
        </section>

        <section className="iw-monitor-grid">
          <div className="iw-panel iw-monitor-list-panel">
            <div className="iw-panel-head iw-panel-head--wrap">
              <div><div className="iw-section-eyebrow">SERVICE CATALOG / DEMO</div><h3>Danh sách dịch vụ</h3><p>Trạng thái mẫu và host cung cấp dịch vụ.</p></div>
              <div className="iw-monitor-tools">
                <label className="iw-search">
                  <Icon name="search" size={16} />
                  <input aria-label="Tìm dịch vụ" placeholder="Tên, nhóm hoặc host..." value={query} onChange={(event) => setQuery(event.target.value)} />
                </label>
                <label className="iw-filter-select">
                  <span className="visually-hidden">Lọc trạng thái service</span>
                  <select aria-label="Lọc trạng thái service" value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
                    {SERVICE_FILTERS.map((filter) => <option value={filter} key={filter}>{filter === 'All' ? 'Tất cả trạng thái' : filter}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="iw-entity-list">
              {filteredServices.map((service) => (
                <button
                  type="button"
                  className={`iw-entity-row ${selectedId === service.id ? 'is-selected' : ''}`}
                  key={service.id}
                  onClick={() => setSelectedId(service.id)}
                  aria-pressed={selectedId === service.id}
                >
                  <span className="iw-entity-row-icon iw-entity-row-icon--service"><Icon name={service.icon} size={18} /></span>
                  <span className="iw-entity-row-main"><strong>{service.name}</strong><small>{service.category} · {service.host}</small></span>
                  <span className="iw-service-row-kpis"><span>{service.latency}</span><small>latency</small></span>
                  <StatusBadge state={service.state} />
                  <span className="iw-entity-row-chevron"><Icon name="chevron" size={16} /></span>
                </button>
              ))}
              {filteredServices.length === 0 && <div className="iw-monitor-empty iw-monitor-empty--inline" role="status"><Icon name="search" /><strong>Không có kết quả phù hợp</strong><span>Thử đổi từ khóa hoặc trạng thái lọc.</span></div>}
            </div>
            <div className="iw-table-footer"><span>Hiển thị {filteredServices.length}/{SERVICES.length} dịch vụ</span><span>MOCK DATA</span></div>
          </div>
          <ServiceDetail service={selectedService} />
        </section>
        <p className="iw-monitor-footer-note">DEMO ONLY · Trạng thái service không được xác minh bằng health check thật.</p>
      </div>
    </DashboardLayout>
  );
}
