# Phạm vi Dự án (Project Scope) — InfraWatch (N4.7)

Tài liệu này xác định ranh giới phát triển của dự án nhằm đảm bảo sự tập trung về mặt kiến trúc, tránh tình trạng "phình phạm vi" (scope creep) và đáp ứng đúng yêu cầu đã thống nhất của đồ án.

---

## 1. Trong phạm vi thực hiện (In-Scope)

### 1.1. Thu thập & Lưu trữ Metrics
- **Node Exporter:** Giám sát máy chủ Linux vật lý và Linux VM (CPU, RAM, Disk I/O, Network I/O, System Load).
- **cAdvisor:** Giám sát tài nguyên vòng đời Docker containers (CPU usage, Memory working set, I/O, Network packet drop).
- **Prometheus TSDB:** Lưu trữ time-series metrics tập trung với retention time 15 ngày, chu kỳ scrape mặc định 15 giây.

### 1.2. Cảnh báo & Định tuyến sự cố
- **Alertmanager:** Gom nhóm cảnh báo (alert grouping), lọc trùng lặp (deduplication) và ức chế cảnh báo (alert inhibition).
- **Telegram Bot API:** Gửi tin nhắn định dạng HTML báo cáo tình trạng Firing (sự cố) và Resolved (đã phục hồi).

### 1.3. Trực quan hóa & Giao diện người dùng
- **Custom Web Dashboard (React 18 + Vite):** Giao diện sản phẩm chính, hiển thị trạng thái tổng quan các node và container, danh sách cảnh báo đang diễn ra.
- **FastAPI Backend (Python 3.11+):** Đóng vai trò REST API Gateway, truy vấn dữ liệu từ Prometheus API và cung cấp JSON response chuẩn cho Frontend.
- **Grafana Dashboard:** Tích hợp bộ dashboard chuyên sâu cho kỹ sư SRE.

### 1.4. Đóng gói & Triển khai
- Triển khai toàn bộ hạ tầng bằng **Docker Engine** và **Docker Compose**.
- Cung cấp bộ script tự động: cài đặt (`setup.sh`), kiểm tra sức khỏe (`health-check.sh`), sao lưu/phục hồi (`backup.sh`, `restore.sh`).
- Bộ kịch bản **Chaos Testing** (stress CPU, disk full, container crash).

---

## 2. Ngoài phạm vi thực hiện (Out-of-Scope)

Các thành phần dưới đây **chưa được triển khai** trong giai đoạn hiện tại trừ khi có văn bản phê duyệt bổ sung từ Team Leader / Giảng viên hướng dẫn:

- ❌ **Kubernetes / OpenShift:** Chưa triển khai điều phối cụm K8s; phạm vi lab tập trung vào Docker Engine độc lập.
- ❌ **Elasticsearch / Fluentd / Logstash (EFK/ELK):** Không thu thập log tập trung; hệ thống chỉ tập trung vào Metrics và Alarms.
- ❌ **Kafka / RabbitMQ:** Không sử dụng message queue phân tán cho luồng metrics (Prometheus hoạt động theo mô hình Pull-based).
- ❌ **PostgreSQL để lưu Time-Series:** Prometheus TSDB là nguồn lưu trữ time-series duy nhất; không sao chép time-series vào SQL database.
- ❌ **Blackbox Exporter, JMX, SNMP:** Giữ danh sách exporters gọn gàng (chỉ Node Exporter và cAdvisor).
- ❌ **Trí tuệ nhân tạo (AI/ML) dự đoán sự cố:** Chưa tích hợp các mô hình Machine Learning/Deep Learning vào luồng nghiệp vụ khi chưa hoàn thành hệ thống nền tảng.

