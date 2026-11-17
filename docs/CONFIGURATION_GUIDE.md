# Hướng dẫn Cấu hình Hệ thống (Configuration Guide) — InfraWatch (N4.7)

Tài liệu này hướng dẫn chi tiết cách tùy biến và tinh chỉnh các tệp cấu hình cốt lõi của **InfraWatch**.

---

## 1. Cấu hình Prometheus (`infrastructure/prometheus/prometheus.yml`)

### 1.1. Tinh chỉnh chu kỳ thu thập (Scrape Intervals)
Mặc định hệ thống thiết lập chu kỳ 15 giây:
```yaml
global:
  scrape_interval: 15s      # Khoảng thời gian cào dữ liệu từ exporters
  evaluation_interval: 15s  # Khoảng thời gian đánh giá quy tắc cảnh báo
```
- Nếu muốn giảm tải CPU của Prometheus trong phòng lab nhỏ: tăng lên `30s`.
- Nếu muốn độ chi tiết cao hơn trong diễn tập sự cố: giảm xuống `10s`.

### 1.2. Thêm một máy chủ Linux mới vào danh sách giám sát
Để giám sát thêm một máy chủ Linux khác ngoài host hiện tại:
1. Cài đặt Node Exporter trên máy chủ đích (ví dụ IP: `192.168.1.50`).
2. Mở file `infrastructure/prometheus/prometheus.yml`, thêm target vào job `node-exporter`:
```yaml
  - job_name: 'node-exporter'
    static_configs:
      - targets: 
          - 'node-exporter:9100'        # Máy chủ cục bộ
          - '192.168.1.50:9100'         # Máy chủ từ xa
```
3. Nạp lại cấu hình Prometheus mà không cần dừng container:
```bash
curl -X POST http://localhost:9090/-/reload
```

---

## 2. Cấu hình Alertmanager & Telegram (`infrastructure/alertmanager/alertmanager.yml`)

### 2.1. Lấy thông tin Telegram Bot Token và Chat ID
1. **Tạo Bot:** Mở ứng dụng Telegram, tìm bot `@BotFather`, gửi lệnh `/newbot` và làm theo hướng dẫn để nhận API Token.
2. **Lấy Chat ID:** 
   - Thêm bot vừa tạo vào nhóm Telegram của bạn.
   - Gửi một tin nhắn bất kỳ vào nhóm (ví dụ: `Hello Bot`).
   - Mở trình duyệt truy cập: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Tìm giá trị `"chat":{"id": -100xxxxxxxxxx}`.

### 2.2. Tùy biến định dạng tin nhắn Telegram
Trong tệp cấu hình `alertmanager.yml`, bạn có thể tùy biến mẫu thông báo qua trường `message`:
```yaml
receivers:
  - name: 'telegram-notifications'
    telegram_configs:
      - bot_token: '<YOUR_BOT_TOKEN>'
        chat_id: <YOUR_CHAT_ID>
        parse_mode: 'HTML'
        send_resolved: true
        message: >-
          {{ if eq .Status "firing" }}🔥 <b>[SỰ CỐ HẠ TẦNG PHÁT HIỆN]</b>{{ else }}✅ <b>[SỰ CỐ ĐÃ ĐƯỢC GIẢI QUYẾT]</b>{{ end }}
          <b>Tên cảnh báo:</b> {{ .CommonLabels.alertname }}
          <b>Mức độ:</b> {{ .CommonLabels.severity }}
          <b>Chi tiết:</b> {{ .CommonAnnotations.description }}
```

---

## 3. Cấu hình Grafana Provisioning

### 3.1. Datasource (`infrastructure/grafana/provisioning/datasources/prometheus.yml`)
Grafana tự động kết nối với Prometheus qua mạng nội bộ Docker:
```yaml
url: http://prometheus:9090
```
Không nên đổi URL này thành `localhost:9090` vì container Grafana cần giao tiếp qua tên service trong mạng Docker.

### 3.2. Dashboard Provider (`infrastructure/grafana/provisioning/dashboards/dashboards.yml`)
Mọi tệp JSON dashboard đặt trong thư mục `infrastructure/grafana/dashboards/` sẽ tự động được import vào thư mục "InfraWatch" trên giao diện Grafana mỗi khi container khởi động hoặc sau mỗi 30 giây.
