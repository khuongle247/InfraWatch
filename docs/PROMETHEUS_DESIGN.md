# Thiết Kế Prometheus — Scrape Targets, Metrics, PromQL & Alert Flow

**Dự án:** InfraWatch (N4.7)  
**Nhánh:** `infra/prometheus-blackbox-alert-flow`  
**Ngày cập nhật:** 2026-11-21

---

## 1. Scrape Targets

Dưới đây là danh sách các scrape job được định nghĩa trong `infrastructure/prometheus/prometheus.yml`:

| Job | Mục tiêu | Port | Mô tả |
|-----|----------|------|-------|
| `prometheus` | `localhost:9090` | 9090 | Giám sát chính máy chủ Prometheus (self-monitoring) |
| `node-exporter` | `node-exporter:9100` | 9100 | Metrics hệ điều hành Linux (CPU, RAM, Disk, Network) |
| `cadvisor` | `cadvisor:8080` | 8080 | Metrics tài nguyên Docker containers |
| `blackbox-http` | Các endpoint HTTP qua Blackbox | 9115 | Kiểm tra sẵn sàng HTTP (2xx) cho backend, frontend, prometheus, grafana |
| `blackbox-tcp` | Các cổng TCP qua Blackbox | 9115 | Kiểm tra kết nối TCP cho node-exporter, cadvisor, alertmanager |

**Chu kỳ scrape mặc định:** 15 giây (theo `global.scrape_interval`).

---

## 2. Catalog Metrics & PromQL

### 2.1. Metrics Máy chủ (Host / Node Exporter)

| KPI | Metric | PromQL |
|-----|--------|--------|
| CPU Utilization % | `node_cpu_seconds_total` | `100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
| Memory Utilization % | `node_memory_MemAvailable_bytes`, `node_memory_MemTotal_bytes` | `(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100` |
| Disk Utilization % | `node_filesystem_free_bytes`, `node_filesystem_size_bytes` | `(1 - (node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100` |
| Network Receive Bytes/s | `node_network_receive_bytes_total` | `rate(node_network_receive_bytes_total[5m])` |
| Network Transmit Bytes/s | `node_network_transmit_bytes_total` | `rate(node_network_transmit_bytes_total[5m])` |
| Load Average 1m | `node_load1` | `node_load1` |
| Target Up | `up` | `up{job="node-exporter"}` |

### 2.2. Metrics Container (cAdvisor)

| KPI | Metric | PromQL |
|-----|--------|--------|
| CPU Cores | `container_cpu_usage_seconds_total` | `sum by (name) (rate(container_cpu_usage_seconds_total{name!=""}[5m]))` |
| Memory Working Set | `container_memory_working_set_bytes` | `sum by (name) (container_memory_working_set_bytes{name!=""})` |
| Network RX Bytes/s | `container_network_receive_bytes_total` | `sum by (name) (rate(container_network_receive_bytes_total{name!=""}[5m]))` |
| Network TX Bytes/s | `container_network_transmit_bytes_total` | `sum by (name) (rate(container_network_transmit_bytes_total{name!=""}[5m]))` |
| Container Up | `up` | `up{job="cadvisor"}` |

### 2.3. Metrics Blackbox Exporter

| KPI | Metric | PromQL |
|-----|--------|--------|
| Probe Success | `probe_success` | `probe_success{job="blackbox-http"}` hoặc `probe_success{job="blackbox-tcp"}` |
| Probe Duration | `probe_duration_seconds` | `probe_duration_seconds{job="blackbox-http"}` |

## 3. Alert Rules (Danh sách quy tắc cảnh báo)

### 3.1. Host Alerts (`infrastructure/prometheus/rules/host_alerts.yml`)

| Alert | Expression | Ngưỡng | For | Severity |
|-------|------------|--------|-----|----------|
| `HostHighCpuUsage` | `100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85` | > 85% | 2m | warning |
| `HostHighMemoryUsage` | `(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90` | > 90% | 2m | critical |
| `HostDiskSpaceFilling` | `(1 - (node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100 > 85` | > 85% | 2m | warning |
| `HostDiskSpaceCritical` | `(1 - (node_filesystem_free_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100 > 95` | > 95% | 1m | critical |
| `NodeExporterDown` | `up{job="node-exporter"} == 0` | = 0 | 1m | critical |

### 3.2. Container Alerts (`infrastructure/prometheus/rules/container_alerts.yml`)

| Alert | Expression | Ngưỡng | For | Severity |
|-------|------------|--------|-----|----------|
| `ContainerHighCpuUsage` | `sum by (name) (rate(container_cpu_usage_seconds_total{name!=""}[5m])) > 1` | > 1 core | 2m | warning |
| `ContainerHighMemoryUsage` | `sum by (name) (container_memory_working_set_bytes{name!=""}) > threshold` | configurable | 2m | warning |
| `ContainerDown` | `absent(container_cpu_usage_seconds_total{name="<container_name>"})` | absent | 1m | critical |

### 3.3. Blackbox Alerts (`infrastructure/prometheus/rules/blackbox_alerts.yml`)

| Alert | Expression | Ngưỡng | For | Severity |
|-------|------------|--------|-----|----------|
| `BlackboxEndpointDown` | `probe_success{job="blackbox-http"} == 0` | = 0 | 1m | critical |
| `BlackboxEndpointDownTCP` | `probe_success{job="blackbox-tcp"} == 0` | = 0 | 1m | critical |
| `BlackboxHighLatency` | `probe_duration_seconds{job="blackbox-http"} > 2` | > 2s | 1m | warning |

## 4. Alert Flow (Luồng Cảnh Báo)

```
Sự cố trên Host/Container
        ↓ (metric vượt ngưỡng trong 'for' duration)
Prometheus đánh giá Alert Rules (mỗi 15s)
        ↓ (trạng thái chuyển thành FIRING)
Prometheus gửi POST /api/v2/alerts → Alertmanager (:9093)
        ↓ (grouping, deduplication, inhibition)
Alertmanager gửi Telegram Bot API (HTML)
        ↓ (send_resolved: true)
Kỹ sư nhận tin nhắn FIRING và RESOLVED
```

**Throttling:**
- `group_wait: 30s`
- `group_interval: 5m`
- `repeat_interval: 4h`

## 5. Tệp Cấu Hình Liên Quan

| Tệp | Mục đích |
|-----|----------|
| `docker-compose.yml` | Định nghĩa service `blackbox-exporter` (port 9115) |
| `infrastructure/prometheus/blackbox.yml` | Cấu hình module `http_2xx` và `tcp_connect` |
| `infrastructure/prometheus/prometheus.yml` | Scrape configs cho 5 job (bao gồm blackbox) |
| `infrastructure/prometheus/rules/host_alerts.yml` | Alert rules cho máy chủ |
| `infrastructure/prometheus/rules/container_alerts.yml` | Alert rules cho container |
| `infrastructure/prometheus/rules/blackbox_alerts.yml` | Alert rules cho blackbox probing |
| `infrastructure/alertmanager/alertmanager.yml` | Cấu hình Telegram receiver và routing |

## 6. Lệnh Kiểm Tra

```bash
# Kiểm tra tất cả targets UP
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[].labels.job'

# Kiểm tra alert rules đã load
curl -s http://localhost:9090/api/v1/rules | jq '.data.groups[].name'

# Reload Prometheus sau khi thay đổi rules
curl -X POST http://localhost:9090/-/reload

# Reload Alertmanager sau khi thay đổi config
curl -X POST http://localhost:9093/-/reload
```

---

*Tài liệu này đi kèm với commit `infra(prometheus): add blackbox exporter, scrape targets, and update README`.*
