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

## 3. Hệ quy chiếu Mốc thời gian & Chỉ số Vận hành (Observability System KPIs)

> **Lưu ý trạng thái tài liệu (`[Proposed]`):** Các giá trị trong cột *Ngưỡng mục tiêu dự kiến* dưới đây là chỉ tiêu tham chiếu ban đầu. Theo quy tắc dự án, ngưỡng nghiệm thu chính thức sẽ được chốt sau khi chạy đo baseline thực tế trên môi trường lab và thống nhất với PM/mentor.

### 3.1. Định nghĩa 5 mốc thời gian chuẩn (Timestamps)
Mọi kịch bản kiểm thử sự cố và phục hồi đều ghi nhận theo mốc thời gian chuẩn UTC:
- **$T_0$ (Fault Injection):** Thời điểm kích hoạt sự cố giả lập (`high-cpu.sh`, `disk-usage.sh`, `service-down.sh`).
- **$T_1$ (Detection / Firing):** Thời điểm Prometheus chuyển trạng thái cảnh báo sang `firing` (trích xuất từ trường `activeAt` qua `/api/v1/alerts`).
- **$T_2$ (Notification Delivered):** Thời điểm Alertmanager định tuyến thành công và Telegram Bot nhận được tin nhắn cảnh báo.
- **$T_{\text{stop}}$ (Fault Cleared):** Thời điểm kết thúc tác vụ gây lỗi / khôi phục container dịch vụ.
- **$T_3$ (System Resolved):** Thời điểm Prometheus xác nhận hết vi phạm ngưỡng và Telegram nhận được thông báo `RESOLVED`.

### 3.2. Bảng chỉ số độ trễ và hiệu năng hệ thống (Phần 1)
| Chỉ số | Tên viết tắt | Công thức / Định nghĩa | Ngưỡng mục tiêu dự kiến (`[Proposed]`) |
| :--- | :--- | :--- | :--- |
| **Độ trễ phát hiện sự cố** | MTTD (Detection Time) | $T_1 - T_0$ *(bị chi phối bởi `scrape_interval=15s`, `evaluation_interval=15s` và thời gian `for`)* | `< 60 giây` |
| **Độ trễ gửi thông báo** | Notification Time | $T_2 - T_1$ *(thời gian xử lý của Alertmanager & Telegram Bot API)* | `< 15 giây` |
| **Độ trễ cảnh báo đầu-cuối** | End-to-End Alert Time | $T_2 - T_0$ *(tổng thời gian từ lúc phát sinh lỗi đến khi nhận tin nhắn)* | `< 75 giây` |
| **Thời gian tồn tại sự cố** | Incident Duration | $T_3 - T_0$ *(bao gồm thời gian duy trì kịch bản kiểm thử)* | Phụ thuộc kịch bản |
| **Độ trễ xác nhận phục hồi** | Recovery Notification Time (MTTR) | $T_3 - T_{\text{stop}}$ *(từ khi dừng lỗi đến khi nhận thông báo `RESOLVED`)* | `< 90 giây` |
| **Tỷ lệ Scrape thành công** | Scrape Success Rate | $\frac{\text{Số lần scrape thành công (`up == 1`)}}{\text{Tổng số lần scrape}} \times 100\%$ | `>= 99.5%` |
| **Thời gian phản hồi API** | API Latency (p95) | Thời gian phản hồi 95% yêu cầu HTTP của FastAPI (`/api/v1/*`) | `< 300 ms` |


