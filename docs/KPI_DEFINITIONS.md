# Định nghĩa Chỉ số Hiệu năng (KPI Definitions) — InfraWatch (N4.7)

Tài liệu này chuẩn hóa các định nghĩa và công thức đo lường các chỉ số hiệu năng kỹ thuật (KPIs / SLIs) của hạ tầng được giám sát và chính hệ thống **InfraWatch**.

---

## 1. Các Chỉ số Hạ tầng Máy chủ (Host Infrastructure KPIs)

### 1.1. Tỷ lệ sử dụng CPU (CPU Utilization %)
- **Định nghĩa:** Phần trăm tổng năng lực tính toán của các nhân CPU đang xử lý tác vụ non-idle.
- **Công thức PromQL:**
  ```promql
  100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
  ```
- **Ngưỡng cảnh báo:** Warning khi `> 80%` liên tục trong 5 phút; Critical khi `> 90%` trong 2 phút.

### 1.2. Tỷ lệ sử dụng Bộ nhớ RAM (Memory Utilization %)
- **Định nghĩa:** Tỷ lệ phần trăm bộ nhớ RAM vật lý thực tế đang bị chiếm dụng.
- **Công thức PromQL:**
  ```promql
  (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
  ```
- **Ngưỡng cảnh báo:** Warning khi `> 85%`; Critical khi `> 95%`.

### 1.3. Tỷ lệ sử dụng Ổ cứng (Disk Space Utilization %)
- **Định nghĩa:** Tỷ lệ phần trăm không gian lưu trữ của phân vùng gốc (`/`) đã bị ghi dữ liệu.
- **Công thức PromQL:**
  ```promql
  (1 - (node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100
  ```
- **Ngưỡng cảnh báo:** Warning khi `> 85%`; Critical khi `> 95%`.

---

## 2. Các Chỉ số Khối Container (Container Metrics KPIs)

### 2.1. CPU Container Tiêu thụ (Container CPU Core Usage)
- **Định nghĩa:** Số lượng nhân CPU tương đương mà một container đang sử dụng.
- **Công thức PromQL:**
  ```promql
  sum by (name) (rate(container_cpu_usage_seconds_total{name!=""}[5m]))
  ```

### 2.2. RAM Container Tiêu thụ (Container Memory Working Set)
- **Định nghĩa:** Dung lượng bộ nhớ RAM thực tế container không thể hoán đổi (swap) sang đĩa.
- **Công thức PromQL:**
  ```promql
  sum by (name) (container_memory_working_set_bytes{name!=""})
  ```

---

## 3. Các Chỉ số Vận hành Hệ thống Giám sát (Observability System KPIs)

| Chỉ số | Tên viết tắt | Định nghĩa | Mục tiêu cam kết (SLO) |
| :--- | :--- | :--- | :--- |
| **Độ trễ phát hiện sự cố** | MTTD | Khoảng thời gian từ lúc metric vượt ngưỡng đến khi Alertmanager bắn cảnh báo | `< 60 giây` |
| **Độ trễ phục hồi sự cố** | MTTR | Thời gian từ khi sự cố được khắc phục đến khi nhận thông báo `RESOLVED` | `< 90 giây` |
| **Tỷ lệ Scrape thành công** | Scrape Success Rate | Tỷ lệ phần trăm các chu kỳ cào dữ liệu thành công từ exporters | `>= 99.5%` |
| **Thời gian phản hồi API** | API Latency (p95) | Thời gian phản hồi 95% các yêu cầu HTTP của Backend API | `< 300 ms` |

