import React, { useEffect, useMemo, useState } from 'react';

// DAY 01 - FRONTEND DEMO ONLY. No real Prometheus / FastAPI data is used here.
const HOSTS = [
  { id: 'lab-core-01', ip: '192.0.2.11', role: 'Core infrastructure', cpu: 38, memory: 62, state: 'Healthy', zone: 'Lab / Zone A' },
  { id: 'lab-app-02', ip: '192.0.2.24', role: 'Application server', cpu: 76, memory: 71, state: 'Warning', zone: 'Lab / Zone A' },
  { id: 'lab-db-01', ip: '198.51.100.12', role: 'Database server', cpu: 44, memory: 58, state: 'Healthy', zone: 'Lab / Zone B' },
  { id: 'lab-node-03', ip: '203.0.113.18', role: 'Container node', cpu: 31, memory: 49, state: 'Healthy', zone: 'Lab / Zone B' },
  { id: 'lab-edge-01', ip: '203.0.113.25', role: 'Edge gateway', cpu: 0, memory: 0, state: 'Offline', zone: 'Lab / Zone C' },
];

const ALERTS = [
  { title: 'CPU vượt ngưỡng cảnh báo', host: 'lab-app-02', severity: 'High', when: '2 phút trước', icon: 'cpu' },
  { title: 'Mất kết nối đến máy chủ', host: 'lab-edge-01', severity: 'Critical', when: '12 phút trước', icon: 'activity' },
  { title: 'Memory usage đã phục hồi', host: 'lab-core-01', severity: 'Resolved', when: '34 phút trước', icon: 'check' },
];

const METRICS = [
  { title: 'CPU Usage', value: 42.8, unit: '%', delta: '+2.4%', subtitle: 'Mức sử dụng trung bình', color: 'blue', icon: 'cpu', progress: 42.8, series: [23,28,25,36,30,35,31,44,40,43,37,47,42,50] },
  { title: 'Memory Usage', value: 67.4, unit: '%', delta: '+1.8%', subtitle: 'Bộ nhớ đang sử dụng', color: 'violet', icon: 'memory', progress: 67.4, series: [49,50,47,55,54,56,53,60,58,62,61,66,64,68] },
  { title: 'Disk Usage', value: 58.2, unit: '%', delta: '−0.6%', subtitle: 'Dung lượng đã sử dụng', color: 'mint', icon: 'database', progress: 58.2, series: [59,57,59,58,61,59,58,60,59,58,58,57,59,58] },
  { title: 'Network I/O', value: 1.84, unit: 'Gb/s', delta: '+8.2%', subtitle: 'Lưu lượng tổng hợp', color: 'amber', icon: 'network', progress: 61, series: [22,38,24,48,35,56,41,53,46,69,45,65,53,78] },
];

const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/></>,
  server: <><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/></>,
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></>,
  activity: <path d="M3 12h4l3-7 4 14 3-7h4"/>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  settings: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.7 5.7l2.2 2.2m8.2 8.2 2.2 2.2M18.3 5.7l-2.2 2.2m-8.2 8.2-2.2 2.2"/><circle cx="12" cy="12" r="4"/></>,
  cpu: <><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/></>,
  memory: <><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 7V4M12 7V4M17 7V4M7 17v3M12 17v3M17 17v3M8 11v2M12 11v2M16 11v2"/></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.6 4 3 9 3s9-1.4 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></>,
  network: <><rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v5M5 16v-3h14v3"/></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  down: <path d="m6 9 6 6 6-6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  filter: <><path d="M4 7h16M7 12h10M10 17h4"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="M12 2 20 6v6c0 5-4 8.5-8 10-4-1.5-8-5-8-10V6l8-4Z"/><path d="m9 12 2 2 4-4"/></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.4 9A7.5 7.5 0 0 1 18.5 6L20 7M4 17l1.5 1A7.5 7.5 0 0 0 18.6 15"/></>,
  external: <><path d="M12 5h7v7M19 5l-9 9"/><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"/></>,
  bars: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <path d="M5 5l14 14M19 5 5 19"/>,
  spark: <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z"/>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 17v4h16v-4"/></>,
};

function Icon({ name, size = 20, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name] || ICONS.activity}</svg>;
}

function Mark({ small = false }) {
  return <span className={`iw-mark ${small ? 'iw-mark--small' : ''}`} aria-hidden="true"><svg viewBox="0 0 46 46" fill="none"><path d="m6 30 8-13 9 14 8-19 9 13" stroke="white" strokeWidth="4.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="39" cy="13" r="3.1" fill="#61E8D4"/></svg></span>;
}

function Sparkline({ values, color }) {
  const width=132, height=51, pad=4, mx=Math.max(...values), mn=Math.min(...values), delta=Math.max(1,mx-mn);
  const points=values.map((v,i)=>`${pad+i*(width-2*pad)/(values.length-1)},${height-pad-(v-mn)/delta*(height-2*pad)}`).join(' ');
  return <svg className="iw-sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Xu hướng sử dụng mô phỏng"><polyline points={points} fill="none" stroke={color} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx={width-pad} cy={height-pad-(values.at(-1)-mn)/delta*(height-2*pad)} r="3.5" fill={color} stroke="#121d32" strokeWidth="2"/></svg>;
}

function linePath(values, width=730, height=235, inset=18, max=100) {
  return values.map((v,i)=>`${i?'L':'M'} ${inset+(width-inset*2)*i/(values.length-1)} ${height-inset-(height-inset*2)*v/max}`).join(' ');
}
function areaPath(values, width=730, height=235, inset=18) {
  return `${linePath(values,width,height,inset)} L ${width-inset} ${height-inset} L ${inset} ${height-inset} Z`;
}

function TrendChart({ range, pulse }) {
  const count=range==='1H'?16:range==='6H'?26:32;
  const { cpu, ram }=useMemo(()=>{
    const cpu=Array.from({length:count},(_,i)=>Math.max(18,Math.min(89,44+Math.sin(i*.64)*12+Math.sin(i*1.91)*7+Math.sin((i+pulse)*.21)*4+i*.22)));
    const ram=Array.from({length:count},(_,i)=>Math.max(20,Math.min(87,60+Math.sin(i*.34+.8)*7+Math.cos(i*.98)*4+Math.sin((i+pulse)*.2)*2)));
    return {cpu,ram};
  },[count,pulse]);
  const ticks=range==='1H'?['12:00','12:15','12:30','12:45','13:00']:range==='6H'?['08:00','09:30','11:00','12:30','14:00']:['00:00','06:00','12:00','18:00','23:59'];
  return <div className="iw-trend-wrap">
    <div className="iw-chart-axis" aria-hidden="true"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
    <div className="iw-chart-main"><svg className="iw-trend" viewBox="0 0 730 235" preserveAspectRatio="none" role="img" aria-label="Biểu đồ đường mô phỏng CPU và Memory theo thời gian">
      <defs><linearGradient id="iw-cpu-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6385ff" stopOpacity=".30"/><stop offset="100%" stopColor="#6385ff" stopOpacity="0"/></linearGradient><linearGradient id="iw-ram-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#61e8d4" stopOpacity=".14"/><stop offset="100%" stopColor="#61e8d4" stopOpacity="0"/></linearGradient></defs>
      {[18,68,118,168,218].map(y=><line key={y} x1="18" x2="712" y1={y} y2={y} stroke="#334260" strokeDasharray="4 7" strokeOpacity=".75"/>) }
      <path d={areaPath(ram)} fill="url(#iw-ram-area)"/><path d={areaPath(cpu)} fill="url(#iw-cpu-area)"/>
      <path d={linePath(ram)} fill="none" stroke="#5ae4d0" strokeWidth="3.0" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
      <path d={linePath(cpu)} fill="none" stroke="#7e95ff" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
      <circle cx="712" cy={217-cpu.at(-1)*1.99} r="5.5" fill="#8c9fff" stroke="#121c31" strokeWidth="3"/>
    </svg><div className="iw-chart-ticks">{ticks.map(t=><span key={t}>{t}</span>)}</div></div>
  </div>;
}

function Sidebar({ mobileOpen, onClose, notify }) {
  const menu=[['dashboard','Tổng quan',true],['server','Máy chủ'],['box','Containers'],['activity','Dịch vụ'],['bell','Cảnh báo']];
  return <>
    {mobileOpen&&<button className="iw-menu-backdrop" aria-label="Đóng thanh điều hướng" onClick={onClose}/>}
    <aside className={`iw-sidebar ${mobileOpen?'iw-sidebar--open':''}`}>
      <div className="iw-brand"><Mark/><div><strong>InfraWatch<span className="iw-brand-dot">.</span></strong><small>OBSERVABILITY PLATFORM</small></div><button className="iw-close-menu" onClick={onClose} aria-label="Đóng menu"><Icon name="close"/></button></div>
      <div className="iw-sidebar-separator"/>
      <div className="iw-nav-label">WORKSPACE</div>
      <nav className="iw-nav" aria-label="Điều hướng chính">{menu.map(([icon,label,active])=><button type="button" key={label} onClick={()=>active?onClose():notify(`${label} sẽ được xây dựng ở các ngày tiếp theo.`)} className={`iw-nav-btn ${active?'iw-nav-btn--active':''}`} aria-current={active?'page':undefined}><Icon name={icon}/><span>{label}</span>{!active&&<span className="iw-soon">Sắp có</span>}{active&&<span className="iw-nav-marker"/>}</button>)}</nav>
      <div className="iw-nav-label iw-nav-label--tools">TOOLS</div>
      <button className="iw-nav-btn iw-nav-btn--aux" onClick={()=>notify('Chức năng cài đặt sẽ được phát triển sau Core UI.')}><Icon name="settings"/><span>Cài đặt</span></button>
      <div className="iw-side-bottom"><div className="iw-workspace-card"><span className="iw-micro-label"><Icon name="spark" size={13}/> PROJECT SPACE</span><strong>Infrastructure Lab</strong><small>UTH × VNPT NET · N4.7</small><div className="iw-progress"><i/></div><div className="iw-workspace-foot"><span>Core MVP</span><span>Day 01 / Overview</span></div></div><div className="iw-side-user"><span className="iw-avatar">PT</span><div><strong>Phan Tấn Thuận</strong><small>M04 · Frontend Engineer</small></div><span className="iw-user-ellipsis">•••</span></div></div>
    </aside>
  </>;
}

function MetricCard({ item, pulse }) {
  const colors={blue:'#7796ff',violet:'#b28aff',mint:'#65e5cd',amber:'#ffc178'};
  const adjusted=item.value+(pulse?Math.sin(pulse*.73+item.value)*.75:0);
  const display=item.unit==='Gb/s'?adjusted.toFixed(2):adjusted.toFixed(1);
  return <article className={`iw-metric iw-metric--${item.color}`}><div className="iw-metric-top"><span className="iw-metric-icon"><Icon name={item.icon} size={21}/></span><span className="iw-metric-signal"><span className="iw-live-dot"/> Simulated</span></div><div className="iw-metric-label">{item.title}</div><div className="iw-metric-value">{display}<span>{item.unit}</span></div><div className="iw-metric-trend"><span className={item.delta.startsWith('−')?'is-positive':'is-neutral'}>{item.delta}</span><span>vs. previous period</span></div><div className="iw-metric-spark"><Sparkline values={item.series.map((v,i)=>v+Math.sin(pulse*.8+i*.7)*Math.min(pulse,5))} color={colors[item.color]}/></div><div className="iw-metric-bottom"><span>{item.subtitle}</span><span>{item.unit==='Gb/s'?'Traffic':'Average'}</span></div></article>;
}

function HealthRing() {
  return <div className="iw-health-visual"><div className="iw-orbit iw-orbit--outer"/><div className="iw-orbit iw-orbit--middle"/><div className="iw-orbit iw-orbit--inner"/><div className="iw-orbit-node iw-orbit-node--one"/><div className="iw-orbit-node iw-orbit-node--two"/><div className="iw-orbit-node iw-orbit-node--three"/><div className="iw-health-core"><span>INFRA HEALTH</span><strong>96.8<small>%</small></strong><em><i/> Stable</em></div><div className="iw-orbit-callout iw-orbit-callout--left"><i/> 5 hosts</div><div className="iw-orbit-callout iw-orbit-callout--right"><Icon name="activity" size={13}/> Analytics</div></div>;
}

function exportDemoCsv() {
  const columns=['Host','IP','Role','CPU (%)','Memory (%)','Status'];
  const escapeCsv=v=>'"'+String(v).replaceAll('"','""')+'"';
  const body=[columns,...HOSTS.map(h=>[h.id,h.ip,h.role,h.cpu,h.memory,h.state])].map(row=>row.map(escapeCsv).join(',')).join('\r\n');
  const blob=new Blob(['\uFEFF'+body],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='infrawatch-demo-hosts.csv';a.click();URL.revokeObjectURL(url);
}

export default function Overview() {
  const [range,setRange]=useState('6H');
  const [pulse,setPulse]=useState(0);
  const [search,setSearch]=useState('');
  const [notice,setNotice]=useState('');
  const [mobileOpen,setMobileOpen]=useState(false);
  const [bellOpen,setBellOpen]=useState(false);
  const [lastRefresh,setLastRefresh]=useState('Chưa làm mới');
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),3600);return()=>clearTimeout(t)},[notice]);
  const filteredHosts=HOSTS.filter(h=>`${h.id} ${h.ip} ${h.role} ${h.zone} ${h.state}`.toLowerCase().includes(search.trim().toLowerCase()));
  const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  const doRefresh=()=>{setPulse(p=>p+1);setLastRefresh(new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}));setNotice('Đã làm mới dữ liệu mô phỏng — chưa kết nối API.')};
  return <div className="iw-app">
    <Sidebar mobileOpen={mobileOpen} onClose={()=>setMobileOpen(false)} notify={setNotice}/>
    <main className="iw-main">
      <header className="iw-topbar"><div className="iw-breadcrumb"><button className="iw-menu-btn" onClick={()=>setMobileOpen(true)} aria-label="Mở menu"><Icon name="bars"/></button><span className="iw-overline">WORKSPACE</span><Icon name="chevron" size={15}/><strong>Tổng quan</strong></div><div className="iw-top-actions"><span className="iw-mock-pill"><i/> MOCK DATA</span><span className="iw-top-divider"/><div className="iw-bell-wrap"><button className="iw-icon-btn iw-notify-btn" aria-label="Xem cảnh báo mô phỏng" aria-expanded={bellOpen} onClick={()=>setBellOpen(!bellOpen)}><Icon name="bell" size={19}/><i/></button>{bellOpen&&<div className="iw-bell-menu"><div className="iw-bell-menu-head"><strong>Cảnh báo mô phỏng</strong><span>3 events</span></div>{ALERTS.map((a,i)=><div className="iw-bell-menu-item" key={i}><span className={`iw-alert-mini iw-alert-mini--${a.severity.toLowerCase()}`}/><div><strong>{a.title}</strong><small>{a.host} · {a.when}</small></div></div>)}</div>}</div><button className="iw-refresh" onClick={doRefresh} type="button"><Icon name="refresh" size={17}/> <span>Làm mới</span></button></div></header>
      <div className="iw-page">
        <div className="iw-banner"><Icon name="shield" size={17}/><span><b>PREVIEW BUILD</b> — Đây là giao diện prototype sử dụng số liệu minh họa; chưa kết nối Prometheus/FastAPI.</span><span className="iw-banner-right">INFRAWATCH / M04</span></div>
        <div className="iw-heading"><div><div className="iw-eyebrow"><span/> INFRAWATCH INTELLIGENCE HUB <b>/</b> OVERVIEW</div><h1>Tổng quan <span>hệ thống</span></h1><p>Góc nhìn toàn diện về hiệu suất, tính sẵn sàng và sức khỏe hạ tầng.</p></div><div className="iw-heading-date"><Icon name="clock" size={16}/><span>19 tháng 11, 2026</span></div></div>
        <section className="iw-hero"><div className="iw-hero-copy"><span className="iw-hero-tag"><i/> INFRASTRUCTURE INTELLIGENCE <Icon name="spark" size={15}/></span><h2>Control every layer.<br/><span>See every signal.</span></h2><p>Một không gian điều hành thống nhất, giúp theo dõi tài nguyên, độ sẵn sàng và những tín hiệu bất thường trong hệ thống.</p><div className="iw-hero-buttons"><button className="iw-primary-btn" onClick={()=>scrollTo('metrics')} type="button">Khám phá tài nguyên <Icon name="arrow" size={17}/></button><button className="iw-secondary-btn" onClick={()=>scrollTo('hosts')} type="button">Tình trạng máy chủ</button></div><span className="iw-hero-foot"><i/> DEMO ENVIRONMENT / SIMULATION DATA</span></div><HealthRing/></section>
        <div className="iw-quick-status"><span><i className="mint"/> 3 máy chủ hoạt động ổn định</span><span><i className="blue"/> 1 máy chủ cần theo dõi</span><span><i className="rose"/> 1 máy chủ mất kết nối</span><span className="iw-status-right">SIMULATION DATA · {lastRefresh}</span></div>
        <section id="metrics" className="iw-metrics-grid" aria-label="Tổng quan tài nguyên">{METRICS.map(item=><MetricCard key={item.title} item={item} pulse={pulse}/>)}</section>
        <section className="iw-analytics-grid"><article className="iw-panel iw-trend-panel"><div className="iw-panel-head"><div><div className="iw-section-eyebrow">RESOURCE ANALYTICS</div><h3>Hiệu suất theo thời gian</h3><p>Biến động CPU và Memory của môi trường mô phỏng</p></div><div className="iw-period" role="group" aria-label="Khoảng thời gian">{['1H','6H','24H'].map(v=><button key={v} type="button" className={range===v?'is-active':''} aria-pressed={range===v} onClick={()=>setRange(v)}>{v}</button>)}</div></div><div className="iw-legend"><span><i className="iw-legend-cpu"/> CPU <b>42.8%</b></span><span><i className="iw-legend-ram"/> Memory <b>67.4%</b></span><span className="iw-chart-description"><Icon name="activity" size={15}/> {range} view</span></div><TrendChart range={range} pulse={pulse}/></article>
          <article className="iw-panel iw-distribution-panel"><div className="iw-panel-head"><div><div className="iw-section-eyebrow">INFRASTRUCTURE STATUS</div><h3>Tình trạng hạ tầng</h3><p>Phân bố máy chủ đang giám sát</p></div><span className="iw-panel-kebab" aria-label="Trạng thái mẫu"><Icon name="shield" size={18}/></span></div><div className="iw-donut-layout"><div className="iw-donut" role="img" aria-label="3 healthy, 1 warning, 1 offline"><div className="iw-donut-center"><strong>5</strong><span>TOTAL HOSTS</span></div></div><div className="iw-donut-labels"><div><span><i className="mint"/>Healthy</span><b>3 <small>60%</small></b></div><div><span><i className="amber"/>Warning</span><b>1 <small>20%</small></b></div><div><span><i className="rose"/>Offline</span><b>1 <small>20%</small></b></div></div></div><div className="iw-distribution-foot"><Icon name="shield" size={17}/><span>Đang theo dõi trong môi trường Lab</span></div></article></section>
        <section className="iw-bottom-grid" id="hosts"><article className="iw-panel iw-hosts-panel"><div className="iw-panel-head iw-panel-head--wrap"><div><div className="iw-section-eyebrow">LIVE INVENTORY / DEMO</div><h3>Máy chủ đang giám sát</h3><p>Chỉ số và trạng thái tổng quan của các host mẫu</p></div><div className="iw-table-tools"><label className="iw-search"><Icon name="search" size={16}/><input aria-label="Tìm máy chủ" placeholder="Tìm kiếm máy chủ..." value={search} onChange={e=>setSearch(e.target.value)}/></label><button className="iw-outline-btn" onClick={exportDemoCsv} title="Xuất danh sách host mô phỏng"><Icon name="download" size={16}/><span>CSV</span></button></div></div><div className="iw-table-scroll"><table><thead><tr><th>MÁY CHỦ</th><th>CPU</th><th>MEMORY</th><th>TRẠNG THÁI</th></tr></thead><tbody>{filteredHosts.map(h=><tr key={h.id}><td><span className="iw-host-name"><span className="iw-host-symbol"><Icon name="server" size={18}/></span><span><strong>{h.id}</strong><small>{h.ip} · {h.role}</small></span></span></td><td><span className="iw-cell-meter"><span>{h.cpu}%</span><span className="iw-mini-bar"><i style={{width:`${h.cpu}%`}}/></span></span></td><td><span className="iw-cell-meter"><span>{h.memory}%</span><span className="iw-mini-bar"><i style={{width:`${h.memory}%`}}/></span></span></td><td><span className={`iw-state iw-state--${h.state.toLowerCase()}`}><i/>{h.state}</span></td></tr>)}{filteredHosts.length===0&&<tr><td colSpan="4" className="iw-empty">Không tìm thấy máy chủ phù hợp trong dữ liệu mẫu.</td></tr>}</tbody></table></div><div className="iw-table-footer"><span>Hiển thị {filteredHosts.length}/{HOSTS.length} máy chủ (demo)</span><span>Sample IPs · RFC 5737</span></div></article>
          <article className="iw-panel iw-alerts-panel"><div className="iw-panel-head"><div><div className="iw-section-eyebrow">OPERATIONS FEED</div><h3>Hoạt động gần đây</h3><p>Cảnh báo và sự kiện mô phỏng</p></div><span className="iw-alert-count">3</span></div><div className="iw-timeline">{ALERTS.map((a,i)=><div className="iw-timeline-item" key={i}><span className={`iw-alert-icon iw-alert-icon--${a.severity.toLowerCase()}`}><Icon name={a.icon} size={18}/></span><div className="iw-alert-details"><strong>{a.title}</strong><span>{a.host} <b>·</b> {a.when}</span></div><span className={`iw-alert-severity iw-alert-severity--${a.severity.toLowerCase()}`}>{a.severity}</span></div>)}</div><div className="iw-operations-note"><Icon name="spark" size={16}/><p><strong>What's next?</strong> Màn hình Cảnh báo chi tiết và API thật sẽ được xây dựng theo lộ trình tiếp theo.</p></div></article></section>
        <footer className="iw-footer"><span>© 2026 InfraWatch · Infrastructure Monitoring Platform</span><span>Built with care by <strong>M04 / Phan Tấn Thuận</strong> · UI Concept v1.0</span></footer>
      </div>
    </main>
    {notice&&<div className="iw-toast" role="status"><Icon name="check" size={17}/>{notice}<button aria-label="Đóng thông báo" onClick={()=>setNotice('')}><Icon name="close" size={16}/></button></div>}
  </div>;
}
