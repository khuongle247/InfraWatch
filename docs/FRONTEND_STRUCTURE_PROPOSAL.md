# Đề xuất cấu trúc React — InfraWatch (W03, bản sơ bộ)

**Phạm vi:** phác thảo cấu trúc cho Overview và Host Monitoring, kế thừa Vite/React hiện tại. Đây là đề xuất tổ chức, không phải tái cấu trúc đã thực hiện.

## Hiện trạng sau phần triển khai W03

- React 18 + Vite; `frontend/src/App.jsx` chọn Overview/Hosts theo hash route (`#/overview`, `#/hosts`), không thêm router dependency.
- `pages/Overview.jsx` là composition của Overview; dữ liệu mẫu tách tại `data/monitoringDemo.js`.
- `layouts/DashboardLayout.jsx` dùng chung Sidebar, Header, trạng thái menu/notification và toast; UI dùng chung gồm `components/common/Icon.jsx`, `MetricCard.jsx`, `StatusBadge.jsx`.
- `pages/Hosts.jsx` cung cấp Host Monitoring sơ bộ sử dụng cùng shell và mock data; bảng Overview cũng điều hướng đến Hosts.
- `styles/overview.css` vẫn giữ CSS hiện hữu của Overview và layout chung; `styles/hosts.css` bổ sung giao diện trang Hosts.
- Services và hooks/API thật chưa được triển khai. Dữ liệu hiện tại vẫn là mock/demo và có nhãn rõ; chưa kết nối Prometheus/FastAPI.

## Cấu trúc đề xuất

```text
frontend/src/
├── App.jsx                         # Root; gắn layout + route/page sau khi thống nhất router
├── main.jsx                        # React root, giữ bootstrap hiện có
├── assets/                         # Logo và static assets dùng chung
├── layouts/
│   ├── DashboardLayout.jsx         # Sidebar, topbar, content frame
│   └── dashboard-layout.css        # Chỉ style layout dùng chung
├── pages/
│   ├── Overview.jsx                # Composition trang tổng quan
│   ├── Hosts.jsx                   # Danh sách host (khi tới scope)
│   └── HostDetail.jsx              # Màn hình chi tiết theo host
├── components/
│   ├── common/
│   │   ├── StatusBadge.jsx
│   │   ├── MetricCard.jsx
│   │   ├── TimeRangeSelect.jsx
│   │   └── LoadingState.jsx        # Khi triển khai API/state
│   ├── overview/
│   │   ├── ResourceTrendPanel.jsx
│   │   ├── HostStatusSummary.jsx
│   │   └── HostInventoryTable.jsx
│   └── hosts/
│       ├── HostResourceChart.jsx
│       └── HostMetadataPanel.jsx
├── services/
│   ├── apiClient.js                # HTTP client/fetch wrapper khi có API contract
│   ├── metricsService.js           # M05 API endpoints; chưa implement ở W03
│   └── hostsService.js
├── hooks/
│   ├── useOverviewMetrics.js       # Data/loading/error lifecycle, khi tích hợp
│   └── useHostMetrics.js
├── styles/
│   ├── tokens.css                  # Màu, spacing, typography tokens
│   ├── global.css
│   └── overview.css                # Hiện trạng; di chuyển/chia nhỏ chỉ trong task riêng
└── utils/
    ├── formatMetric.js             # Đơn vị, precision, null handling
    └── formatTime.js               # Timestamp/timezone
```

### Quy tắc ranh giới

1. **Page** điều phối composition và route parameters; không chứa fetch chi tiết hay khai báo hàng loạt icon/data.
2. **Layout** sở hữu navigation/header và phần khung nhất quán giữa màn hình.
3. **Component** nhận dữ liệu qua props, có trách nhiệm hiển thị và accessibility; feature-specific component nằm theo nhóm để tránh một thư mục phẳng khó tìm.
4. **Services** là lớp gọi API theo contract được M05 thống nhất; không truy vấn Prometheus trực tiếp từ trình duyệt khi kiến trúc quy định React gọi Backend API.
5. **Hooks** điều phối loading/empty/error/refetch và vòng đời dữ liệu, không ẩn lỗi bằng fallback “success”.
6. **Utils** chỉ chứa formatter thuần dùng chung; không đặt nghiệp vụ/nguồn dữ liệu ở đây.
7. **Mock data** cần được cô lập khỏi services production, mang nhãn DEMO rõ ràng và không được diễn giải là dữ liệu live.

### Cách chuyển dần, không phá prototype

- W03 chỉ tạo wireframe/tài liệu, chưa di chuyển hoặc đổi tên `Overview.jsx`, `overview.css`, `App.jsx`, chưa thêm thư viện.
- Khi có task triển khai riêng, tách từng component có ranh giới ổn định trước; sau mỗi bước chạy `npm --prefix frontend run build` và kiểm tra so sánh với prototype.
- Chỉ chọn React Router hoặc cơ chế navigation sau khi flow W02/W04 được thống nhất; cấu trúc trên không yêu cầu cài package ngay.
- Tên `HostDetail.jsx` là phương án trình bày wireframe chi tiết; cần chốt với M01/M05 khi API Contract và danh mục màn hình hoàn tất.

## Wireframe W03

- [Overview Dashboard — wireframe HTML](./wireframes/overview-wireframe.html)
- [Host Monitoring — wireframe HTML](./wireframes/hosts-wireframe.html)

Hai wireframe là tài liệu prototype tĩnh, responsive, có thể mở trực tiếp bằng trình duyệt. Mọi dữ liệu trong đó là minh họa; không tham gia build hoặc render trong ứng dụng React hiện tại.

## Mốc thực hiện W03

**Đã làm trong phần việc hiện tại (~50% W03):**

- Tạo wireframe responsive cho Overview và Host Monitoring, cùng tài liệu cấu trúc React và ranh giới trách nhiệm.
- Tách phần khung dùng chung (Sidebar, Header, DashboardLayout) và UI dùng chung (Icon, MetricCard, StatusBadge) khỏi composition Overview.
- Thêm điều hướng hash Overview/Hosts và trang Host Monitoring sơ bộ với mock data, lọc trạng thái/tìm kiếm, chọn host, chart và nhãn DEMO.
- Giữ Overview, các tương tác tìm kiếm, đổi khoảng thời gian, refresh mô phỏng, notification, CSV và các mục điều hướng placeholder; không thêm dependency hoặc thay đổi backend.

**Còn lại cho W03 (chưa thực hiện):**

- Thu nhận review của Leader/nhóm và điều chỉnh wireframe theo phản hồi.
- Chốt user flow, component map và phạm vi thông tin/API phụ thuộc với M01/M05; các giá trị/ngưỡng minh họa chưa phải acceptance criteria.
- Kiểm tra trực quan đầy đủ trên các viewport/trình duyệt đại diện và kiểm tra accessibility chi tiết.
- Chốt component/API specification với nhóm trước khi nối API thật; backend/API không thuộc phần W03 đã làm.

