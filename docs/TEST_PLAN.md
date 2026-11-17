# Kế hoạch Kiểm thử Toàn diện (Test Plan) — InfraWatch (N4.7)

Tài liệu này xác định mục tiêu, phạm vi, phương pháp và tiêu chí nghiệm thu cho các hoạt động kiểm thử chất lượng hệ thống **InfraWatch**.

---

## 1. Mục tiêu Kiểm thử
- Đảm bảo hệ thống thu thập metrics chính xác và liên tục từ cả Host OS và Docker Containers.
- Đảm bảo cơ chế đánh giá quy tắc cảnh báo (Rule Evaluation) và thông báo qua Telegram hoạt động đúng ngưỡng và đúng độ trễ quy định.
- Đảm bảo Web Dashboard và Backend API hoạt động ổn định, không rò rỉ bộ nhớ hoặc nghẽn cổ chai khi truy vấn dữ liệu chuỗi thời gian.
- Kiểm chứng khả năng chịu lỗi và tính bền vững của hệ thống thông qua các kịch bản diễn tập sự cố (Chaos Testing).

---

## 2. Các Cấp độ Kiểm thử

### Cấp độ 1: Kiểm thử Đơn vị & Tích hợp (Unit & Integration Testing)
- **Backend API:** Kiểm thử các router FastAPI, serialization schema với Pydantic, xử lý timeout khi Prometheus không phản hồi.
- **Frontend Dashboard:** Kiểm thử render các component UI, cơ chế polling cập nhật số liệu mỗi 15 giây.
- **Scrape Pipeline:** Kiểm tra Prometheus cào dữ liệu thành công từ `node-exporter:9100` và `cadvisor:8080` (trạng thái target `UP`).

### Cấp độ 2: Kiểm thử Toàn hệ thống (End-to-End System Testing)
- **Kịch bản E2E-01:** Khởi chạy một container ứng dụng mới -> cAdvisor phát hiện -> Prometheus hiển thị metrics -> Web Dashboard cập nhật container trong danh sách.
- **Kịch bản E2E-02:** Phát sinh sự cố -> Prometheus chuyển alert từ `Pending` sang `Firing` -> Alertmanager gửi tin Telegram -> Người dùng nhận được tin nhắn đúng định dạng trong vòng dưới 60 giây.

### Cấp độ 3: Kiểm thử Chịu lỗi (Chaos Testing)
- **Chaos-01 (High CPU):** Chạy `scripts/chaos/high-cpu.sh` -> Kiểm tra alert `HostHighCpuUsage` kích hoạt.
- **Chaos-02 (Disk Pressure):** Chạy `scripts/chaos/disk-usage.sh` -> Kiểm tra alert `HostDiskSpaceFilling` kích hoạt.
- **Chaos-03 (Service Down):** Chạy `scripts/chaos/service-down.sh` -> Kiểm tra alert `TargetDown` hoặc `ContainerDown` kích hoạt.

### Cấp độ 4: Kiểm thử Hiệu năng & Tải (Performance Testing)
- Đo lường mức độ sử dụng tài nguyên (CPU/RAM footprint) của chính ngăn xếp InfraWatch.
- Kiểm tra khả năng xử lý của Backend khi có 50 yêu cầu đồng thời truy vấn dữ liệu metrics.

---

## 3. Tiêu chí Nghiệm thu (Pass / Fail Criteria)

| Tiêu chí | Điều kiện ĐẠT (Pass) |
| :--- | :--- |
| **Tính sẵn sàng của dịch vụ** | 100% container trong `docker compose ps` ở trạng thái `running` hoặc `healthy`. |
| **Độ trễ cảnh báo (MTTD)** | Tin nhắn Telegram được nhận trong vòng **<= 60 giây** kể từ khi sự cố bắt đầu. |
| **Độ chính xác phục hồi** | Nhận được tin nhắn `[RESOLVED]` khi điều kiện bất thường chấm dứt. |
| **Mức chiếm dụng tài nguyên** | Ngăn xếp InfraWatch tiêu thụ **<= 1.5 GB RAM** và **<= 10% CPU** ở trạng thái nhàn rỗi. |
| **Không chứa Secrets** | Kiểm tra tự động 100% không phát hiện token hoặc mật khẩu lộ lọt trong git history. |

