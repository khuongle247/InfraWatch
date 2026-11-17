# Test Strategy & Test Suites — InfraWatch

Thư mục này quản lý toàn bộ các kịch bản và mã nguồn kiểm thử chất lượng hệ thống cho **InfraWatch**.

## Phân loại các tầng kiểm thử:

### 1. `integration/` (Kiểm thử tích hợp)
- Kiểm tra tính tương thích và giao tiếp giữa các thành phần phần mềm.
- Ví dụ:
  - Backend API kết nối và parse dữ liệu từ Prometheus HTTP API.
  - Alertmanager nhận webhook payload và format tin nhắn cho Telegram.
  - Frontend gọi các REST endpoint của Backend thành công.

### 2. `system/` (Kiểm thử toàn hệ thống End-to-End)
- Kiểm thử luồng nghiệp vụ hoàn chỉnh từ đầu đến cuối:
  - Khi một node Linux tăng CPU -> Node Exporter export số liệu -> Prometheus cào dữ liệu -> Alert rule firing -> Alertmanager nhận cảnh báo -> Gửi tin nhắn Telegram tới điện thoại -> Người dùng mở Dashboard xem đồ thị.

### 3. `chaos/` (Kiểm thử khả năng chịu lỗi & phục hồi)
- Đánh giá khả năng tự phục hồi, tính chính xác của cảnh báo và độ trễ phát hiện sự cố (Mean Time to Detect - MTTD).
- Sử dụng các kịch bản trong thư mục `scripts/chaos/`.

### 4. `performance/` (Kiểm thử hiệu năng)
- Đánh giá tải của Prometheus khi số lượng container tăng cao.
- Đo thời gian phản hồi (Latency) của FastAPI Backend khi nhiều người dùng cùng truy cập Web Dashboard.

