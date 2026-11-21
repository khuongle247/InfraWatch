# Hướng dẫn Kiểm Tra & Validate — Prometheus Alert Flow

**Dự án:** InfraWatch (N4.7)  
**Nhánh:** `infra/prometheus-blackbox-alert-flow`  
**Yêu cầu:** Docker Desktop đang chạy, Telegram Bot Token + Chat ID đã được cấu hình

---

## 1. Trước khi kiểm tra

### 1.1. Cấu hình Telegram Bot Token
1. Tạo Bot qua `@BotFather` trên Telegram, nhận `BOT_TOKEN`.
2. Lấy `CHAT_ID` (gửi tin nhắn cho bot, rồi truy cập `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`).
3. Sao chép `infrastructure/alertmanager/alertmanager.yml.example` thành `infrastructure/alertmanager/alertmanager.yml`.
4. Điền giá trị thực vào `bot_token` và `chat_id` trong file `alertmanager.yml`.
   > ⚠️ File `alertmanager.yml` nằm trong `.gitignore`, **không commit** vào Git.

### 1.2. Khởi động hệ thống
```bash
docker compose up -d --build
```

---

## 2. Kiểm tra Scrape Targets

Truy cập `http://localhost:9090/targets`, xác nhận tất cả jobs có trạng thái `UP`:

| Job | Mục tiêu |
|-----|----------|
| prometheus | `localhost:9090` |
| node-exporter | `node-exporter:9100` |
| cadvisor | `cadvisor:8080` |
| blackbox-http | backend:8000, frontend:3000, prometheus:9090, grafana:3001 |
| blackbox-tcp | node-exporter:9100, cadvisor:8080, alertmanager:9093 |

**Lệnh kiểm tra nhanh:**
```bash
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[].labels.job'
```

---

## 3. Kiểm tra Alert Rules đã load

Truy cập `http://localhost:9090/alerts`, xác nhận các rule sau đang được evaluasi:

**Host alerts:**
- `HostHighCpuUsage`
- `HostHighMemoryUsage`
- `HostDiskSpaceFilling`
- `HostDiskSpaceCritical`
- `NodeExporterDown`

**Container alerts:**
- `ContainerHighCpuUsage`
- `ContainerHighMemoryUsage`
- `ContainerDown`

**Blackbox alerts:**
- `BlackboxEndpointDown`
- `BlackboxEndpointDownTCP`
- `BlackboxHighLatency`

**Lệnh kiểm tra nhanh:**
```bash
curl -s http://localhost:9090/api/v1/rules | jq '.data.groups[].name'
```

---

## 4. Kiểm tra Alert Flow (End-to-End)

### 4.1. Gửi alert test thủ công tới Alertmanager
```bash
curl -X POST http://localhost:9093/api/v2/alerts -d '[{
  "status": "firing",
  "labels": {
    "alertname": "TestAlert",
    "severity": "warning",
    "instance": "test-instance"
  },
  "annotations": {
    "summary": "This is a test alert",
    "description": "Verifying Telegram notification flow"
  }
}]'
```

Kiểm tra nhóm Telegram đã nhận được tin nhắn định dạng HTML.

### 4.2. Chạy Chaos Testing

| Kịch bản | Script | Alert mong đợi |
|----------|--------|----------------|
| Tải CPU cao | `bash scripts/chaos/high-cpu.sh 60 2` | `HostHighCpuUsage` (firing → resolved) |
| Ổ cứng đầy | `bash scripts/chaos/disk-usage.sh 1024` | `HostDiskSpaceFilling` (firing → resolved) |
| Dừng container | `bash scripts/chaos/service-down.sh infrawatch-backend 45` | `BlackboxEndpointDown` hoặc `TargetDown` (firing → resolved) |

**Tiêu chí thành công:**
- Nhận được tin nhắn **FIRING** trên Telegram trong vòng ≤ 60 giây.
- Nhận được tin nhắn **RESOLVED** sau khi sự cố khắc phục.

---

## 5. Reload cấu hình (không cần restart container)

```bash
# Reload Prometheus sau khi thay đổi alert rules
curl -X POST http://localhost:9090/-/reload

# Reload Alertmanager sau khi thay đổi alertmanager.yml
curl -X POST http://localhost:9093/-/reload
```

---

## 6. Lưu bằng chứng kiểm tra

Lưu ảnh chụp màn hình hoặc log vào các thư mục sau:
- `evidence/chaos-results/` — Log kết quả chaos testing
- `evidence/test-results/` — Kết quả kiểm tra targets và alerts
- `evidence/screenshots/` — Ảnh chụp Prometheus UI, Alertmanager UI, tin nhắn Telegram

---

## 7. Lệnh dọn dẹp

```bash
# Dừng hệ thống giữ nguyên dữ liệu
docker compose down

# Dừng hệ thống và xóa toàn bộ dữ liệu volumes (CẢNH BÁO: mất metrics lịch sử)
docker compose down -v
```

---

*Tài liệu này đi kèm với nhánh `infra/prometheus-blackbox-alert-flow`.*