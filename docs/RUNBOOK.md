# Sổ tay Vận hành & Xử lý Sự cố (Runbook) — InfraWatch (N4.7)

Tài liệu này hướng dẫn kỹ sư trực ban (On-call Engineer) quy trình điều tra và xử lý các sự cố vận hành thường gặp trên hệ thống **InfraWatch**.

---

## 1. Sự cố 1: Không nhận được cảnh báo trên Telegram

### Dấu hiệu nhận biết:
- Prometheus hiển thị alert ở trạng thái `Firing`, nhưng không có tin nhắn nào được gửi tới nhóm Telegram.

### Các bước điều tra & khắc phục:
1. **Kiểm tra logs của container Alertmanager:**
   ```bash
   docker logs infrawatch-alertmanager --tail 100
   ```
2. **Kiểm tra kết nối mạng từ Alertmanager tới Telegram API:**
   ```bash
   docker exec -it infrawatch-alertmanager wget -qO- https://api.telegram.org > /dev/null && echo "Kết nối thành công" || echo "Mất kết nối Internet"
   ```
3. **Kiểm tra Bot Token và Chat ID trong file `infrastructure/alertmanager/alertmanager.yml`:**
   - Đảm bảo Chat ID có dấu âm (`-`) nếu là nhóm/kênh (ví dụ: `-1001234567890`).
   - Kiểm tra xem Bot đã được mời vào nhóm và được cấp quyền gửi tin nhắn chưa.
4. **Nạp lại cấu hình Alertmanager:**
   ```bash
   curl -X POST http://localhost:9093/-/reload
   ```

---

## 2. Sự cố 2: Target Prometheus bị `DOWN` (State = DOWN)

### Dấu hiệu nhận biết:
- Trên Prometheus UI (`http://localhost:9090/targets`), mục `node-exporter` hoặc `cadvisor` chuyển sang màu đỏ và hiển thị `DOWN`.

### Các bước điều tra & khắc phục:
1. **Kiểm tra container exporter có đang chạy không:**
   ```bash
   docker ps -a | grep -E "node-exporter|cadvisor"
   ```
2. **Nếu container bị thoát (Exited), kiểm tra log lý do crash:**
   ```bash
   docker logs infrawatch-node-exporter --tail 50
   docker logs infrawatch-cadvisor --tail 50
   ```
3. **Khởi động lại container bị lỗi:**
   ```bash
   docker compose restart node-exporter
   # hoặc
   docker compose restart cadvisor
   ```

---

## 3. Sự cố 3: Ổ đĩa máy chủ đầy do dữ liệu Prometheus TSDB

### Dấu hiệu nhận biết:
- Máy chủ báo hết dung lượng đĩa cứng (`df -h` báo `/` đạt 100%), container Prometheus tự động tắt.

### Các bước xử lý khẩn cấp:
1. **Dọn dẹp các image/container rác của Docker:**
   ```bash
   docker system prune -af --volumes
   ```
2. **Giảm thời gian lưu trữ dữ liệu (Retention time) của Prometheus:**
   - Mở `docker-compose.yml`, sửa tham số:
     `--storage.tsdb.retention.time=7d` (giảm từ 15 ngày xuống 7 ngày).
3. **Khởi động lại dịch vụ:**
   ```bash
   docker compose up -d prometheus
   ```
