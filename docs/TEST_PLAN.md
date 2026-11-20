# Kế hoạch Kiểm thử Toàn diện (Test Plan) — InfraWatch (N4.7)

Tài liệu này xác định mục tiêu, phạm vi, phương pháp và tiêu chí nghiệm thu cho các hoạt động kiểm thử chất lượng hệ thống **InfraWatch** theo chiến lược kiểm thử sớm (**Shift-Left Testing**).

---

## 1. Mục tiêu Kiểm thử
- Đảm bảo hệ thống thu thập metrics chính xác và liên tục từ cả Host OS và Docker Containers.
- Đảm bảo cơ chế đánh giá quy tắc cảnh báo (Rule Evaluation) và thông báo qua Telegram hoạt động đúng ngưỡng và đúng độ trễ quy định.
- Đảm bảo Web Dashboard và Backend API hoạt động ổn định, không rò rỉ bộ nhớ hoặc nghẽn cổ chai khi truy vấn dữ liệu chuỗi thời gian.
- Kiểm chứng khả năng chịu lỗi, khả năng phục hồi (`Resolved`) và tính bền vững của hệ thống thông qua các kịch bản diễn tập sự cố (Chaos Testing).

---

## 2. Các Cấp độ & Kịch bản Kiểm thử

### Cấp độ 1: Kiểm thử Đơn vị & Tích hợp (Unit & Integration Testing — `tests/integration/`)
- **Backend API (`docs/api/API_CONTRACT.md`):** Kiểm thử các endpoint `/health`, `/api/v1/metrics/overview`, `/api/v1/hosts`, `/api/v1/containers`, `/api/v1/alerts/active` (kiểm tra status code `200`, schema JSON, xử lý lỗi `400/404`, và xử lý ngoại lệ `500 PROMETHEUS_UNAVAILABLE` khi Prometheus không phản hồi).
- **Đối chiếu 3 nguồn dữ liệu (Data Truth Triangulation):** So sánh giá trị metrics tại cùng thời điểm giữa **PromQL gốc $\leftrightarrow$ FastAPI Response $\leftrightarrow$ React Dashboard / Grafana** (sai số làm tròn cho phép $\Delta \le 0.1\%$, độ lệch chu kỳ polling $\Delta t \le 15\text{s}$).
- **Scrape Pipeline:** Kiểm tra Prometheus cào dữ liệu thành công từ `node-exporter:9100` và `cadvisor:8080` (trạng thái target `UP`).

### Cấp độ 2: Kiểm thử Toàn hệ thống (End-to-End System Testing — `tests/system/`)
- **E2E-01 (Auto Discovery & Sync):** Khởi chạy một container ứng dụng mới $\rightarrow$ cAdvisor phát hiện $\rightarrow$ Prometheus hiển thị metrics $\rightarrow$ Web Dashboard cập nhật container trong danh sách.
- **E2E-02 (Alert Lifecycle & Recovery):** Phát sinh sự cố ($T_0$) $\rightarrow$ Prometheus chuyển alert từ `Pending` sang `Firing` ($T_1$) $\rightarrow$ Alertmanager gửi tin Telegram ($T_2$) $\rightarrow$ dừng sự cố ($T_{\text{stop}}$) $\rightarrow$ hệ thống tự động phục hồi và gửi thông báo `RESOLVED` ($T_3$).

### Cấp độ 3: Kiểm thử Chịu lỗi & Tình huống Biên (Chaos & Boundary Testing — `scripts/chaos/` & `tests/chaos/`)
- **Chaos-01 (High CPU — Positive):** Chạy `scripts/chaos/high-cpu.sh` vượt ngưỡng cảnh báo duy trì qua thời gian `for` $\rightarrow$ kiểm tra alert `HostHighCpuUsage` chuyển `Firing` và tự động `Resolved` sau khi dừng script.
- **Chaos-02 (Disk Pressure — Positive):** Chạy `scripts/chaos/disk-usage.sh` trên phân vùng/volume thử nghiệm được cấp phép vượt ngưỡng `85%` $\rightarrow$ kiểm tra alert `HostDiskSpaceFilling` kích hoạt và tự động xóa file tạm (`cleanup`) để xác nhận `Resolved`.
- **Chaos-03 (Service Down — Positive):** Chạy `scripts/chaos/service-down.sh` dừng một container mục tiêu $\rightarrow$ kiểm tra alert `TargetDown` / `ContainerDown` kích hoạt và tự động khởi động lại container.
- **Chaos-04 (Short CPU Spike — Negative / Boundary):** Tạo tải CPU tăng vọt trong thời gian ngắn (`5–10 giây`, thấp hơn thời gian `for` của Alert Rule) $\rightarrow$ xác nhận hệ thống **không** phát sinh cảnh báo giả (`True Negative` để tính `False Positive Rate`).
- **Chaos-05 (Alert Flapping — Boundary):** Bật/tắt liên tục dịch vụ trong khoảng thời gian ngắn $\rightarrow$ kiểm tra cơ chế gom nhóm (`group_wait` / `group_interval`) của Alertmanager để tránh gửi tin nhắn trùng lặp hàng loạt.

> **Lưu ý đồng bộ cấu hình kỹ thuật:** Trước khi chạy Chaos Testing thực nghiệm, M06 sẽ phối hợp với M03 đồng bộ thời lượng chạy mặc định của `scripts/chaos/*.sh` (hiện tại `high-cpu.sh` là 60s, `service-down.sh` là 45s) với cửa sổ truy vấn `rate` và tham số `for` trong `infrastructure/prometheus/rules/*.yml`.

### Cấp độ 4: Kiểm thử Hiệu năng & Tải (Performance Testing — `tests/performance/`)
- Đo lường mức độ sử dụng tài nguyên (CPU/RAM footprint) của chính ngăn xếp InfraWatch ở trạng thái nhàn rỗi và khi có tải.
- Kiểm tra khả năng xử lý và độ trễ `p95` của FastAPI Backend khi có 50 yêu cầu đồng thời truy vấn dữ liệu metrics.

---

## 3. Quy chuẩn Đo lường & Đóng gói Minh chứng (`evidence/`)
- **Độ tin cậy thống kê:** Mỗi kịch bản đo độ trễ ($T_0 \rightarrow T_3, T_{\text{stop}}$) được thực thi lặp lại **5–10 lần** thông qua script tự động (trích xuất trực tiếp trường `activeAt` từ Prometheus API thay vì bấm giờ thủ công).
- **Quy chuẩn bộ 4 minh chứng cho mỗi kịch bản E2E/Chaos:**
  1. Log terminal kèm timestamp UTC tại thời điểm kích hoạt và dừng sự cố (`evidence/chaos-results/`).
  2. Ảnh chụp trạng thái `Firing` / đồ thị metric trên Prometheus (`evidence/screenshots/`).
  3. Ảnh chụp tin nhắn Telegram hiển thị rõ thời gian nhận cảnh báo và `RESOLVED` (`evidence/screenshots/`).
  4. Ảnh chụp dữ liệu hiển thị tương ứng trên React Dashboard / Grafana (`evidence/screenshots/`).

---

## 4. Tiêu chí Nghiệm thu Dự kiến (`[Proposed]`)

> **Ghi chú:** Các ngưỡng định lượng dưới đây là chỉ tiêu tham chiếu ban đầu (`[Proposed]`). Ngưỡng nghiệm thu chính thức sẽ được chốt sau khi chạy đo baseline thực tế trên môi trường lab và thống nhất với PM/mentor.

| Tiêu chí | Điều kiện ĐẠT dự kiến (`[Proposed]`) |
| :--- | :--- |
| **Tính sẵn sàng của dịch vụ** | 100% container trong `docker compose ps` ở trạng thái `running` hoặc `healthy`. |
| **Độ trễ phát hiện cảnh báo (MTTD)** | Trạng thái `Firing` trên Prometheus được ghi nhận trong vòng **<= 60 giây** ($T_1 - T_0$). |
| **Độ trễ cảnh báo đầu-cuối (E2E)** | Tin nhắn Telegram được nhận trong vòng **<= 75 giây** kể từ khi sự cố bắt đầu ($T_2 - T_0$). |
| **Độ trễ xác nhận phục hồi (MTTR)** | Nhận được tin nhắn `[RESOLVED]` trong vòng **<= 90 giây** sau khi dừng sự cố ($T_3 - T_{\text{stop}}$). |
| **Chất lượng cảnh báo (Alert Quality)** | `Recall = 100%` (không bỏ sót 3 sự cố cốt lõi), `False Positive Rate <= 5%`. |
| **Mức chiếm dụng tài nguyên** | Ngăn xếp InfraWatch tiêu thụ **<= 1.5 GB RAM** và **<= 10% CPU** ở trạng thái nhàn rỗi. |
| **An toàn & Bảo mật (Security)** | Kiểm tra tự động 100% không phát hiện `.env`, token hoặc mật khẩu lộ lọt trong git history. |
