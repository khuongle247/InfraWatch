# Chaos Engineering & Fault Injection Framework — InfraWatch

Thư mục này chứa các kịch bản mô phỏng sự cố thực nghiệm (Chaos Tests) nhằm kiểm chứng khả năng phát hiện bất thường và kích hoạt cảnh báo của hệ thống giám sát **InfraWatch**.

## ⚠️ NGUYÊN TẮC AN TOÀN BẮT BUỘC (SAFETY PROTOCOLS)

1. **CHỈ CHẠY TRÊN MÔI TRƯỜNG LAB / TEST:** Tuyệt đối không chạy trên môi trường có dữ liệu sản xuất hoặc máy chủ dùng chung không được cô lập.
2. **CÓ THỜI GIAN TIMEOUT TỰ ĐỘNG:** Mọi kịch bản gây tải phải có giới hạn thời gian (duration limit) và tự động dọn dẹp tiến trình khi hết giờ.
3. **CƠ CHẾ DỪNG KHẨN CẤP (Kill Switch):** Luôn có thể bấm `Ctrl + C` để lập tức kích hoạt bẫy `trap` dừng kịch bản và thu hồi tài nguyên.
4. **KHÔNG CHẠY TỰ ĐỘNG Ở PHASE 0:** Trong giai đoạn khởi tạo, các script này chỉ đóng vai trò khung kiểm thử nền tảng.

## Danh mục kịch bản Chaos:

| Script | Mục tiêu mô phỏng | Chỉ số Prometheus chịu ảnh hưởng |
| :--- | :--- | :--- |
| `high-cpu.sh` | Tạo tải CPU cao đột biến (stress test) | `node_cpu_seconds_total`, `node_load1` |
| `disk-usage.sh` | Tạo file rác tạm thời để đẩy mức chiếm dụng ổ cứng lên ngưỡng cảnh báo (>85%) | `node_filesystem_free_bytes` |
| `service-down.sh` | Dừng đột ngột một container dịch vụ (ví dụ: backend hoặc cadvisor) | `up`, `container_last_seen` |

