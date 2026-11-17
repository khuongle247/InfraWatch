# Metrics Exporters — InfraWatch

Thư mục này tài liệu hóa và quản lý các agent thu thập dữ liệu (exporters) được sử dụng trong hệ thống InfraWatch.

## Danh sách Exporters chính thức trong phạm vi:

### 1. Node Exporter (`prom/node-exporter`)
- **Mục đích:** Thu thập các chỉ số phần cứng và hệ điều hành của máy chủ Linux (Host OS / VM).
- **Cổng mặc định:** `9100`
- **Các nhóm chỉ số quan trọng:**
  - `node_cpu_seconds_total`: Mức độ sử dụng CPU theo các chế độ (idle, user, system, iowait).
  - `node_memory_MemAvailable_bytes`, `node_memory_MemTotal_bytes`: Dung lượng bộ nhớ RAM khả dụng và tổng thể.
  - `node_filesystem_free_bytes`, `node_filesystem_size_bytes`: Không gian lưu trữ ổ cứng.
  - `node_network_receive_bytes_total`, `node_network_transmit_bytes_total`: Lưu lượng băng thông mạng.
  - `node_load1`, `node_load5`, `node_load15`: Tải trung bình hệ thống (System Load Average).

### 2. cAdvisor (`gcr.io/cadvisor/cadvisor`)
- **Mục đích:** Thu thập phân tích tài nguyên và số liệu hiệu năng theo từng Docker container đang chạy trên host.
- **Cổng mặc định:** `8080`
- **Các nhóm chỉ số quan trọng:**
  - `container_cpu_usage_seconds_total`: Thời gian CPU tiêu thụ bởi từng container.
  - `container_memory_usage_bytes`, `container_memory_working_set_bytes`: Dung lượng RAM từng container sử dụng.
  - `container_network_receive_bytes_total`, `container_network_transmit_bytes_total`: Băng thông mạng container.
  - `container_fs_reads_bytes_total`, `container_fs_writes_bytes_total`: Tốc độ đọc/ghi I/O đĩa cứng của container.

---

> **Lưu ý kiến trúc:** Hiện tại hệ thống chưa tích hợp các exporter mở rộng (như Blackbox Exporter, JMX Exporter, Database Exporter) để giữ đúng phạm vi thiết kế Phase 0.

