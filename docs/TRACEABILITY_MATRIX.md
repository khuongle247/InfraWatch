# Ma trận Truy vết Yêu cầu (Requirements Traceability Matrix — RTM)

Tài liệu này ánh xạ toàn bộ yêu cầu chức năng (`FR`) và phi chức năng (`NFR`) từ `docs/REQUIREMENTS.md` sang các chỉ số đánh giá (`docs/KPI_DEFINITIONS.md`) và kịch bản kiểm thử (`docs/TEST_PLAN.md` / `docs/TEST_CASES.md`).

> **Trạng thái tài liệu (`[Draft - Sync Pending SRS]`):** Ma trận được lập dựa trên `docs/REQUIREMENTS.md`, `docs/SCOPE.md` và `docs/api/API_CONTRACT.md` hiện hành. Các ngưỡng định lượng `[Proposed]` và phạm vi dịch vụ mở rộng (`Blackbox Exporter`, `PostgreSQL`) sẽ được đồng bộ ngay sau khi bản SRS hoàn chỉnh của Tuần 4 được ban hành.

---

## 1. Ma trận Truy vết Yêu cầu Chức năng (Functional Requirements)

| Mã Yêu cầu | Nhóm & Mô tả tóm tắt (`docs/REQUIREMENTS.md`) | Chỉ số KPI liên quan (`[Proposed]`) | Mã Test Case dự kiến | Cấp độ Kiểm thử | Ghi chú đối soát SRS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-DC-01** | Thu thập metrics Host Linux (CPU, RAM, Disk, Net) chu kỳ `15s` via Node Exporter | `Scrape Success Rate >= 99.5%`<br>`Data Completeness >= 99.0%` | `TC-INFRA-02`<br>`TC-DATA-01` | Integration | Khớp `scrape_interval: 15s` trong `prometheus.yml` |
| **FR-DC-02** | Thu thập metrics từng Docker container (CPU, RAM, Disk I/O, Net I/O) via cAdvisor | `Scrape Success Rate >= 99.5%`<br>`Data Completeness >= 99.0%` | `TC-INFRA-03`<br>`TC-DATA-02` | Integration | Kiểm tra tương thích nhãn `name` khi cAdvisor nâng bản |
| **FR-DC-03** | Tự động phát hiện container mới khởi chạy hoặc dừng hoạt động | `Data Completeness >= 99.0%`<br>`Dashboard Accuracy = 100%` | `TC-E2E-01` | System E2E | Đã định nghĩa trong `docs/TEST_PLAN.md` (`E2E-01`) |
| **FR-DS-01** | Lưu trữ time-series trên Prometheus TSDB tối thiểu `15 ngày` | `Data Completeness >= 99.0%` | `TC-INFRA-01` | Integration | Khớp `--storage.tsdb.retention.time=15d` |
| **FR-DS-02** | Hỗ trợ Instant Query và Range Query qua ngôn ngữ PromQL | `Dashboard Accuracy = 100%`<br>`API Latency (p95) < 300 ms` | `TC-API-02`..`TC-API-04` | Integration | Kiểm chứng qua FastAPI (`docs/api/API_CONTRACT.md`) |
| **FR-AL-01** | Đánh giá liên tục Alert Rules theo chu kỳ `15 giây` | `MTTD < 60s` | `TC-CHAOS-01`..`03` | Chaos / E2E | Khớp `evaluation_interval: 15s` |
| **FR-AL-02** | Phát hiện sự cố vượt ngưỡng tài nguyên (CPU, RAM, Disk, Service Down) | `Alert Quality` (`Precision >= 95%`, `Recall = 100%`, `FPR <= 5%`) | `TC-CHAOS-01`..`04` | Chaos & Boundary | **[Chờ SRS]** Chốt ngưỡng chuẩn & tham số `for` trên lab |
| **FR-AL-03** | Gửi thông báo tức thời tới Telegram khi `firing` và khi phục hồi `resolved` | `Alert Delivery = 100%`<br>`Notification Time < 15s`<br>`MTTR < 90s` | `TC-E2E-02`<br>`TC-CHAOS-01`..`03` | System E2E | Đo tự động 5 mốc $T_0, T_1, T_2, T_{\text{stop}}, T_3$ |
| **FR-AL-04** | Gom nhóm (`grouping`) và chống gửi cảnh báo lặp lại (`deduplication`) | `Alert Quality` (`FPR <= 5%`) | `TC-CHAOS-05` | Chaos Boundary | Kiểm tra `group_wait` / `group_interval` trên Alertmanager |
| **FR-UI-01** | Web Dashboard hiển thị danh sách hosts và trạng thái `UP/DOWN` | `Dashboard Accuracy = 100%` | `TC-API-03`<br>`TC-DATA-01` | Integration / UI | Đối chiếu PromQL $\leftrightarrow$ `GET /api/v1/hosts` $\leftrightarrow$ React UI |
| **FR-UI-02** | Web Dashboard hiển thị danh sách containers đang chạy và tài nguyên tiêu thụ | `Dashboard Accuracy = 100%` | `TC-API-04`<br>`TC-DATA-02` | Integration / UI | Đối chiếu PromQL $\leftrightarrow$ `GET /api/v1/containers` $\leftrightarrow$ React UI |
| **FR-UI-03** | Web Dashboard hiển thị danh sách cảnh báo đang hoạt động (`firing`) kèm severity | `Dashboard Accuracy = 100%` | `TC-API-05`<br>`TC-DATA-03` | Integration / UI | **[Chờ SRS]** Xác nhận chỉ đọc active alerts hay lưu lịch sử DB |
| **FR-UI-04** | Tích hợp Grafana với các dashboard mẫu đã provisioning sẵn | `Deployment Reproducibility = 100%` | `TC-INFRA-04` | System E2E | Kiểm tra datasource Prometheus & JSON provisioning `:3001` |

---

## 2. Ma trận Truy vết Yêu cầu Phi chức năng (Non-Functional Requirements)

| Mã Yêu cầu | Mô tả tóm tắt (`docs/REQUIREMENTS.md`) | Chỉ số KPI & Ngưỡng `[Proposed]` | Mã Test Case dự kiến | Ghi chú đối soát SRS |
| :--- | :--- | :--- | :--- | :--- |
| **NFR-PERF-01** | Thời gian phản hồi Backend API cho truy vấn tổng quan | `API Latency (p95) < 300 ms` (`[Proposed]`) | `TC-PERF-01` | `REQUIREMENTS.md` ghi `< 500ms`; cần đồng bộ với SRS |
| **NFR-PERF-02** | Độ trễ từ lúc sự cố phát sinh đến khi Telegram nhận cảnh báo | `MTTD < 60s`, `End-to-End < 75s` (`[Proposed]`) | `TC-CHAOS-01`..`03` | Yêu cầu cấu hình `for: 30s` trên lab để khả thi |
| **NFR-PERF-03** | Mức tiêu hao tài nguyên của hệ thống giám sát trên máy chủ lab | `Resource Footprint`: Toàn stack `<= 1.5 GB RAM`, `<= 10% CPU` (`[Proposed]`) | `TC-PERF-02` | `REQUIREMENTS.md` mới giới hạn riêng 2 exporters (`<= 3% CPU, 150MB RAM`) |
| **NFR-REL-01** | Các container dịch vụ cấu hình tự khởi động lại (`restart: unless-stopped`) | `Deployment Reproducibility = 100%` | `TC-INFRA-01` | Kiểm chứng qua `docker inspect` & khôi phục sau sự cố |
| **NFR-REL-02** | Duy trì khả năng hoạt động liên tục (`uptime`) `>= 99%` trong lab | `Scrape Success Rate >= 99.5%` (`[Proposed]`) | `TC-PERF-03` | Đo liên tục chuỗi `up == 1` trong phiên chạy ổn định |
| **NFR-SEC-01** | Không lưu trữ secrets, Telegram Bot Token, mật khẩu trong Git | `Security = 0 vi phạm` | `TC-SEC-01` | Quét toàn bộ repo, `git log` & kiểm tra `.gitignore` (`*.img`, `*.iso`) |
| **NFR-SEC-02** | Nạp thông tin nhạy cảm qua biến môi trường (`.env`) | `Security = 0 vi phạm` | `TC-SEC-01` | Đối chiếu `docker-compose.yml` với `.env.example` |
| **NFR-SEC-03** | Khóa Grafana bằng xác thực admin, tắt tự đăng ký (`GF_USERS_ALLOW_SIGN_UP=false`) | `Security = 0 vi phạm` | `TC-SEC-02` | Kiểm tra truy cập ẩn danh tới port `:3001` |
