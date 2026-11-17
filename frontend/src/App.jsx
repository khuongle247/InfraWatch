import React from 'react';

function App() {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: '2rem'
    }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, color: '#38bdf8' }}>
              InfraWatch
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '1rem' }}>
              Hệ thống giám sát máy chủ, Cloud và trung tâm dữ liệu (N4.7)
            </p>
          </div>
          <div>
            <span style={{
              backgroundColor: '#0369a1',
              color: '#e0f2fe',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              Phase 0: Initialized
            </span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, color: '#f1f5f9' }}>Trạng thái nền tảng</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
            Bộ khung dự án đã được khởi tạo thành công. Toàn bộ kiến trúc thu thập metrics, Alertmanager, Grafana và Backend API đã sẵn sàng cho giai đoạn tích hợp nghiệp vụ.
          </p>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, color: '#f1f5f9' }}>Thành phần giám sát</h2>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li><strong>Prometheus:</strong> Engine time-series & PromQL</li>
            <li><strong>Node Exporter:</strong> Chỉ số hệ điều hành Linux</li>
            <li><strong>cAdvisor:</strong> Chỉ số tài nguyên Docker containers</li>
            <li><strong>Alertmanager:</strong> Định tuyến cảnh báo Telegram</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, color: '#f1f5f9' }}>Kế hoạch tiếp theo (Phase 1)</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
            Kết nối API Prometheus với FastAPI backend, xây dựng các biểu đồ thời gian thực trên Web Dashboard và cấu hình các bộ luật cảnh báo tự động.
          </p>
        </div>
      </main>

      <footer style={{ marginTop: '2rem', borderTop: '1px solid #334155', paddingTop: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        InfraWatch Team (N4.7) &copy; 2026. Tất cả các quyền được bảo lưu.
      </footer>
    </div>
  );
}

export default App;

