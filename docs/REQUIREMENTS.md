# Yêu cầu Hệ thống (System Requirements) — InfraWatch (N4.7)

Tài liệu này chi tiết hóa các yêu cầu chức năng (Functional Requirements - FR) và phi chức năng (Non-Functional Requirements - NFR) của hệ thống InfraWatch.

---

## 1. Yêu cầu Chức năng (Functional Requirements)

### Nhóm 1: Thu thập Dữ liệu (Data Collection - FR-DC)
- **FR-DC-01:** Hệ thống phải thu thập được các chỉ số tài nguyên máy chủ Linux (CPU load, % sử dụng CPU, dung lượng RAM trống/đã dùng, dung lượng ổ đĩa, lưu lượng mạng in/out) theo chu kỳ định cấu hình (mặc định 15 giây).
- **FR-DC-02:** Hệ thống phải thu thập được mức độ sử dụng tài nguyên của từng Docker container (CPU, RAM, Disk I/O, Network I/O) đang hoạt động trên máy chủ.
- **FR-DC-03:** Hệ thống phải tự động phát hiện khi có container mới khởi chạy hoặc dừng hoạt động thông qua cAdvisor.

### Nhóm 2: Lưu trữ & Xử lý (Data Storage - FR-DS)
- **FR-DS-01:** Hệ thống phải lưu trữ các metrics theo định dạng Time-Series trên Prometheus TSDB trong thời gian tối thiểu 15 ngày.
- **FR-DS-02:** Hệ thống phải hỗ trợ truy vấn dữ liệu tức thời (Instant Query) và dữ liệu theo khoảng thời gian (Range Query) thông qua ngôn ngữ PromQL.

### Nhóm 3: Cảnh báo & Thông báo (Alerting & Notification - FR-AL)
- **FR-AL-01:** Hệ thống phải đánh giá liên tục các quy tắc cảnh báo (Alert Rules) theo chu kỳ 15 giây.
- **FR-AL-02:** Hệ thống phải phát hiện sự cố máy chủ/container vượt ngưỡng tài nguyên (CPU > 85%, RAM > 90%, Ổ đĩa > 85%, Service Down).
- **FR-AL-03:** Hệ thống phải gửi thông báo tức thời tới kênh Telegram khi sự cố xảy ra (`firing`) và khi sự cố được khắc phục (`resolved`).
- **FR-AL-04:** Hệ thống phải gom nhóm và chống gửi cảnh báo lặp lại (deduplication) để tránh gây ngập tin nhắn quản trị viên.

### Nhóm 4: Giao diện Người dùng & Trực quan hóa (Dashboard - FR-UI)
- **FR-UI-01:** Web Dashboard phải hiển thị danh sách các máy chủ (hosts) và trạng thái kết nối (UP/DOWN).
- **FR-UI-02:** Web Dashboard phải hiển thị danh sách container đang chạy và mức tiêu hao tài nguyên.
- **FR-UI-03:** Web Dashboard phải hiển thị danh sách các cảnh báo đang hoạt động kèm mức độ nghiêm trọng (Critical, Warning, Info).
- **FR-UI-04:** Hệ thống phải tích hợp Grafana với các dashboard mẫu đã được provisioning sẵn.

---

## 2. Yêu cầu Phi chức năng (Non-Functional Requirements)

### Hiệu năng & Khả năng đáp ứng (Performance - NFR-PERF)
- **NFR-PERF-01:** Thời gian phản hồi của Backend API cho các truy vấn trạng thái tổng quan phải dưới 500ms trong điều kiện mạng nội bộ.
- **NFR-PERF-02:** Độ trễ từ lúc sự cố xuất hiện trên máy chủ đến khi tin nhắn cảnh báo gửi về Telegram không vượt quá 60 giây.
- **NFR-PERF-03:** Mức tiêu hao tài nguyên của các agent giám sát (Node Exporter, cAdvisor) trên máy chủ không vượt quá 3% CPU và 150MB RAM.

### Tính sẵn sàng & Chịu lỗi (Availability & Reliability - NFR-REL)
- **NFR-REL-01:** Các container dịch vụ giám sát phải được cấu hình chính sách tự khởi động lại (`restart: unless-stopped`).
- **NFR-REL-02:** Hệ thống phải duy trì khả năng hoạt động liên tục (uptime) đạt tối thiểu 99% trong môi trường lab.

### Bảo mật (Security - NFR-SEC)
- **NFR-SEC-01:** Tuyệt đối không lưu trữ khóa bí mật, Telegram Bot Token hoặc mật khẩu quản trị trong mã nguồn hoặc git repository.
- **NFR-SEC-02:** Toàn bộ thông tin nhạy cảm phải được nạp thông qua biến môi trường (.env) được bảo vệ quyền truy cập trên máy chủ.
- **NFR-SEC-03:** Bảng điều khiển Grafana phải được khóa bằng xác thực tài khoản quản trị (tắt tính năng cho phép người dùng tự đăng ký).

