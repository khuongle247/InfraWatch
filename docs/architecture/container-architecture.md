# Kiến trúc Phân rã Container (Container Architecture - C4 Model Level 2) — InfraWatch (N4.7)

Tài liệu này chi tiết hóa cách hệ thống **InfraWatch** được phân rã thành các container độc lập giao tiếp với nhau qua mạng ảo `monitoring-network`.

---

## 1. Sơ đồ Kiến trúc Container

```mermaid
graph TD
    ClientBrowser[Trình duyệt Người dùng\nWeb Browser]
    TelegramApp[Ứng dụng Telegram]

    subgraph Host_Environment [Môi trường Máy chủ Linux / Docker Engine]
        subgraph Docker_Bridge_Network [Docker Network: monitoring-network]
            FE[Container: infrawatch-frontend\nReact 18 + Vite / Nginx :80 -> :3000]
            BE[Container: infrawatch-backend\nFastAPI Python 3.11 :8000]
            PROM[Container: infrawatch-prometheus\nPrometheus TSDB :9090]
            AM[Container: infrawatch-alertmanager\nAlertmanager Router :9093]
            GRAF[Container: infrawatch-grafana\nGrafana Viz :3000 -> :3001]
            NE[Container: infrawatch-node-exporter\nHost OS Metrics :9100]
            CADV[Container: infrawatch-cadvisor\nContainer Metrics :8080]
        end

        HostProc[/proc, /sys, /rootfs]
        DockerSock[/var/run/docker.sock]
    end

    %% Giao tiếp bên ngoài
    ClientBrowser -->|HTTP :3000| FE
    ClientBrowser -->|HTTP :8000| BE
    ClientBrowser -->|HTTP :3001| GRAF
    AM -->|HTTPS Outbound| TelegramApp

    %% Giao tiếp nội bộ
    FE -->|REST API Calls| BE
    BE -->|PromQL HTTP API| PROM
    BE -->|Alerts Status API| AM
    GRAF -->|Direct Datasource| PROM
    PROM -->|Scrape metrics 15s| NE
    PROM -->|Scrape metrics 15s| CADV
    PROM -->|Evaluate & Send Alerts| AM

    %% Mount hệ thống
    NE -.->|Read Host Info| HostProc
    CADV -.->|Inspect Containers| DockerSock
```

---

## 2. Bảng Phân công Trách nhiệm Container

| Container Name | Image Base | Cổng Nội bộ | Cổng Host | Vai trò chính |
| :--- | :--- | :---: | :---: | :--- |
| `infrawatch-frontend` | `node:18` -> `nginx:alpine` | 80 | 3000 | Phục vụ Web Dashboard cho người dùng cuối |
| `infrawatch-backend` | `python:3.11-slim` | 8000 | 8000 | Cung cấp REST API, chuyển đổi và tổng hợp dữ liệu PromQL |
| `infrawatch-prometheus` | `prom/prometheus:v2.52.0` | 9090 | 9090 | Lưu trữ time-series metrics, xử lý truy vấn PromQL |
| `infrawatch-alertmanager` | `prom/alertmanager:v0.27.0` | 9093 | 9093 | Gom nhóm cảnh báo, định tuyến thông báo Telegram |
| `infrawatch-grafana` | `grafana/grafana:10.4.2` | 3000 | 3001 | Bảng điều khiển phân tích số liệu hạ tầng chuyên sâu |
| `infrawatch-node-exporter` | `prom/node-exporter:v1.8.1` | 9100 | 9100 | Xuất metrics phần cứng và HĐH Linux của máy chủ |
| `infrawatch-cadvisor` | `gcr.io/cadvisor/cadvisor:v0.49.1` | 8080 | 8080 | Xuất metrics CPU, RAM, Disk, Net của Docker containers |
