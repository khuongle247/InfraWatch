# Bảng Đăng ký & Kiểm soát Rủi ro (Risk Register) — InfraWatch (N4.7)

Tài liệu này theo dõi các rủi ro kỹ thuật, vận hành và quản lý dự án có khả năng ảnh hưởng đến tiến độ hoặc chất lượng của **InfraWatch**, kèm theo các biện pháp giảm thiểu tương ứng.

---

## Ma trận Đánh giá Rủi ro

| ID | Mô tả Rủi ro | Xác suất (P) | Tác động (I) | Mức rủi ro | Biện pháp Giảm thiểu (Mitigation Strategy) | Người chịu trách nhiệm |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **RSK-01** | Lộ lọt Telegram Bot Token hoặc API Secrets vào Git | Trung bình | Rất cao | **CAO** | Cấu hình `.gitignore` nghiêm ngặt, sử dụng `.env.example` với placeholder, kích hoạt quét secret trước khi commit. | DevOps Lead |
| **RSK-02** | Prometheus bị tràn ổ đĩa do lưu lượng metrics quá lớn | Thấp | Cao | **TRUNG BÌNH** | Thiết lập cờ `--storage.tsdb.retention.time=15d` và chu kỳ scrape 15 giây; theo dõi dung lượng volume `prometheus_data`. | DevOps Lead |
| **RSK-03** | Alert fatigue (ngập cảnh báo Telegram gây bỏ sót sự cố thực) | Cao | Trung bình | **TRUNG BÌNH** | Cấu hình gom nhóm (`group_wait: 30s`, `group_interval: 5m`, `repeat_interval: 4h`) và thiết lập ngưỡng thời gian `for: 2m` trong Prometheus rules. | SRE Engineer |
| **RSK-04** | cAdvisor không thể truy cập cgroup/Docker socket trên máy ảo mới | Trung bình | Cao | **TRUNG BÌNH** | Chạy container với cờ `privileged: true` và mount đầy đủ các đường dẫn `/sys`, `/var/run`, `/var/lib/docker`. | DevOps Lead |
| **RSK-05** | Backend API bị nghẽn khi truy vấn PromQL phức tạp | Thấp | Trung bình | **THẤP** | Tối ưu hóa truy vấn PromQL, tận dụng Instant Query thay vì Range Query cho các màn hình tổng quan, đặt timeout cho client HTTP. | Backend Lead |
| **RSK-06** | Xung đột cổng kết nối (Port Conflict) với các dịch vụ đã có trên máy Host | Cao | Thấp | **THẤP** | Cho phép tùy biến toàn bộ port thông qua biến môi trường trong file `.env` (ví dụ `GRAFANA_PORT=3001`, `FRONTEND_PORT=3000`). | Full Team |
