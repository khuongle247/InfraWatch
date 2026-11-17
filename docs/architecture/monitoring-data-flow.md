# Luồng Vận chuyển Dữ liệu Giám sát (Monitoring Data Flow) — InfraWatch (N4.7)

Tài liệu này mô tả chi tiết hai luồng dữ liệu cốt lõi trong hệ thống: **Luồng Thu thập & Trực quan hóa (Metrics Pipeline)** và **Luồng Đánh giá & Phát cảnh báo (Alerting Pipeline)**.

---

## 1. Luồng Thu thập & Trực quan hóa (Metrics Pipeline)

```mermaid
sequenceDiagram
    autonumber
    participant Host as Linux Host / Containers
    participant Exp as Exporters (NodeExp / cAdvisor)
    participant Prom as Prometheus TSDB
    participant Fast as FastAPI Backend
    participant Web as React Web Dashboard
    participant User as Người dùng Vận hành

    Note over Host,Exp: Thu thập trạng thái hệ điều hành & container
    loop Mỗi 15 giây (Pull-based)
        Prom->>Exp: HTTP GET /metrics
        Exp->>Host: Đọc /proc, /sys và Docker socket
        Exp-->>Prom: Trả về Plaintext Prometheus Metrics
        Prom->>Prom: Lưu vào Time-Series Database (TSDB)
    end

    User->>Web: Truy cập Dashboard giám sát
    loop Polling chu kỳ 15 giây
        Web->>Fast: HTTP GET /api/v1/metrics/overview
        Fast->>Prom: HTTP POST /api/v1/query (PromQL queries)
        Prom-->>Fast: JSON Time-Series Vector Data
        Fast->>Fast: Chuyển đổi dữ liệu (Data formatting & Aggregation)
        Fast-->>Web: JSON Clean API Response
        Web->>User: Cập nhật biểu đồ và trạng thái thẻ
    end
```

---

## 2. Luồng Đánh giá & Phát cảnh báo (Alerting Pipeline)

```mermaid
sequenceDiagram
    autonumber
    participant Chaos as Sự cố / Chaos Script
    participant Host as Máy chủ Linux
    participant Prom as Prometheus Server
    participant AM as Alertmanager
    participant TG as Telegram Bot API
    participant OnCall as Kỹ sư On-call

    Chaos->>Host: Gây tải CPU > 90% (ví dụ: high-cpu.sh)
    Note over Prom: Đánh giá Alert Rules mỗi 15 giây
    Prom->>Prom: Phát hiện điều kiện vi phạm: cpu_usage > 85%
    Note over Prom: Trạng thái Alert chuyển từ Inactive -> Pending

    loop Đợi ngưỡng thời gian (ví dụ: for: 2m)
        Prom->>Prom: Điều kiện vi phạm tiếp tục duy trì
    end

    Note over Prom: Trạng thái Alert chuyển thành FIRING
    Prom->>AM: POST /api/v2/alerts (Payload: alertname, instance, severity)
    AM->>AM: Deduplication & Grouping (group_wait: 30s)
    AM->>TG: HTTPS POST /sendMessage (Formatted HTML Alert)
    TG->>OnCall: Tin nhắn Telegram: "🔥 [ALARM - SỰ CỐ HẠ TẦNG] CPU > 85%"

    Note over Chaos,Host: Sự cố kết thúc, tải CPU giảm về bình thường (< 20%)
    Prom->>Prom: Điều kiện bình thường trở lại
    Prom->>AM: POST /api/v2/alerts (Status: RESOLVED)
    AM->>TG: HTTPS POST /sendMessage (Formatted HTML Resolved)
    TG->>OnCall: Tin nhắn Telegram: "✅ [RESOLVED - ĐÃ PHỤC HỒI]"
```
