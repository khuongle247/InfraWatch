# Hợp đồng Giao diện Lập trình Ứng dụng (API Contract) — InfraWatch (N4.7)

Tài liệu này định nghĩa các giao thức, định dạng dữ liệu và quy ước chuẩn cho REST API của dịch vụ **InfraWatch Backend**, đảm bảo tính nhất quán giữa Backend (FastAPI) và Frontend (React).

---

## 1. Quy ước Chung (General Conventions)

- **Base URL:** `http://<backend_host>:8000/api/v1`
- **Định dạng dữ liệu:** Mọi payload yêu cầu và phản hồi đều sử dụng chuẩn `application/json` (UTF-8).
- **Mã phản hồi HTTP chuẩn:**
  - `200 OK`: Yêu cầu xử lý thành công.
  - `400 Bad Request`: Dữ liệu đầu vào không hợp lệ.
  - `404 Not Found`: Không tìm thấy tài nguyên (Host/Container không tồn tại).
  - `500 Internal Server Error`: Lỗi máy chủ nội bộ hoặc lỗi kết nối Prometheus.
- **Cấu trúc phản hồi lỗi chuẩn:**
  ```json
  {
    "detail": {
      "code": "PROMETHEUS_UNAVAILABLE",
      "message": "Không thể kết nối tới Prometheus máy chủ tại http://prometheus:9090."
    }
  }
  ```

---

## 2. Danh mục Endpoints

### 2.1. Kiểm tra Sức khỏe (Health Check)
- **URL:** `/health`
- **Method:** `GET`
- **Mô tả:** Kiểm tra nhanh tình trạng hoạt động của backend service.
- **Phản hồi mẫu (`200 OK`):**
  ```json
  {
    "status": "healthy",
    "service": "InfraWatch Backend API",
    "version": "0.1.0",
    "environment": "development"
  }
  ```

---

### 2.2. Trạng thái Tổng quan Hệ thống (System Overview) — *Định hướng Phase 1*
- **URL:** `/api/v1/metrics/overview`
- **Method:** `GET`
- **Mô tả:** Lấy tóm tắt tổng số máy chủ, tổng số container và số lượng cảnh báo đang diễn ra.
- **Phản hồi mẫu (`200 OK`):**
  ```json
  {
    "timestamp": 1715000000,
    "hosts": {
      "total": 1,
      "up": 1,
      "down": 0
    },
    "containers": {
      "total": 7,
      "running": 7,
      "stopped": 0
    },
    "alerts": {
      "critical": 0,
      "warning": 0,
      "info": 0
    }
  }
  ```

---

### 2.3. Danh sách Máy chủ & Chỉ số (Host Metrics) — *Định hướng Phase 1*
- **URL:** `/api/v1/hosts`
- **Method:** `GET`
- **Mô tả:** Trả về danh sách các node được giám sát bởi Node Exporter kèm mức sử dụng CPU, RAM, Disk.
- **Phản hồi mẫu (`200 OK`):**
  ```json
  [
    {
      "instance": "node-exporter:9100",
      "hostname": "infrawatch-lab-vm",
      "status": "UP",
      "cpu_usage_percent": 18.5,
      "memory_used_bytes": 3435973836,
      "memory_total_bytes": 8589934592,
      "disk_used_percent": 42.1,
      "uptime_seconds": 86400
    }
  ]
  ```

---

### 2.4. Danh sách Containers & Chỉ số (Container Metrics) — *Định hướng Phase 1*
- **URL:** `/api/v1/containers`
- **Method:** `GET`
- **Mô tả:** Trả về danh sách các container thu thập bởi cAdvisor.
- **Phản hồi mẫu (`200 OK`):**
  ```json
  [
    {
      "container_id": "c1a2b3c4d5e6",
      "name": "infrawatch-prometheus",
      "image": "prom/prometheus:v2.52.0",
      "cpu_cores": 0.05,
      "memory_working_set_bytes": 157286400,
      "network_rx_bytes": 1048576,
      "network_tx_bytes": 2097152,
      "status": "running"
    }
  ]
  ```

---

### 2.5. Cảnh báo Đang diễn ra (Active Alerts) — *Định hướng Phase 1*
- **URL:** `/api/v1/alerts/active`
- **Method:** `GET`
- **Mô tả:** Truy vấn danh sách các cảnh báo hiện tại từ Alertmanager API.
- **Phản hồi mẫu (`200 OK`):**
  ```json
  [
    {
      "fingerprint": "a1b2c3d4",
      "alertname": "HostHighCpuUsage",
      "severity": "warning",
      "instance": "node-exporter:9100",
      "summary": "Mức sử dụng CPU trên node-exporter:9100 vượt quá 85%",
      "starts_at": "2026-11-17T15:30:00Z",
      "state": "firing"
    }
  ]
  ```

