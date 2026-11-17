# Nhật ký Thay đổi (Changelog) — InfraWatch (N4.7)

Tất cả những thay đổi đáng chú ý của dự án **InfraWatch** sẽ được ghi nhận tại tệp này theo chuẩn [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/) và tuân thủ [Semantic Versioning](https://semver.org/).

---

## [0.1.0] - 2026-11-17
### Phase 0: Project Initialization & Directory Structure

#### Added
- Khởi tạo cấu trúc cây thư mục chuẩn cho toàn bộ dự án InfraWatch.
- Bộ tài liệu kỹ thuật nền tảng trong `docs/`:
  - Tổng quan dự án (`PROJECT_OVERVIEW.md`), phạm vi (`SCOPE.md`), yêu cầu (`REQUIREMENTS.md`), kiến trúc (`ARCHITECTURE.md`).
  - Hướng dẫn triển khai (`DEPLOYMENT_GUIDE.md`), cấu hình (`CONFIGURATION_GUIDE.md`), runbook (`RUNBOOK.md`).
  - Kế hoạch kiểm thử (`TEST_PLAN.md`), KPI kỹ thuật (`KPI_DEFINITIONS.md`), rủi ro (`RISK_REGISTER.md`).
  - Mô hình kiến trúc C4 (`system-context.md`, `container-architecture.md`, `monitoring-data-flow.md`).
  - Hợp đồng giao tiếp API (`API_CONTRACT.md`).
- Cấu hình hạ tầng trong `infrastructure/`:
  - `docker-compose.yml` điều phối 7 dịch vụ chính (Prometheus, Node Exporter, cAdvisor, Alertmanager, Grafana, Backend, Frontend).
  - Cấu hình Prometheus scrape 15s cho Node Exporter và cAdvisor (`prometheus.yml`).
  - Cấu hình mẫu Alertmanager tích hợp Telegram receiver (`alertmanager.yml.example`).
  - Cấu hình Grafana Provisioning cho Prometheus datasource và dashboard provider.
  - Multi-stage Dockerfile cho Web Dashboard (`Dockerfile.dashboard`).
- Skeleton Backend FastAPI trong `backend/`:
  - Cấu hình Pydantic settings, logging chuẩn, router v1 và endpoint health check `/health`.
  - Quản lý thư viện `requirements.txt` và `Dockerfile` đóng gói dịch vụ.
- Skeleton Frontend React trong `frontend/`:
  - Ứng dụng React 18 + Vite với giao diện Dashboard placeholder trang nhã, không chứa dữ liệu giả.
  - Cấu trúc thư mục module hóa (components, layouts, pages, services, hooks, utils, styles).
- Bộ công cụ tự động hóa và Chaos Testing trong `scripts/`:
  - Scripts vận hành: `setup.sh`, `health-check.sh`, `backup.sh`, `restore.sh`.
  - Scripts kiểm thử lỗi có kiểm soát: `high-cpu.sh`, `disk-usage.sh`, `service-down.sh`.
- Thiết lập quy chuẩn mã nguồn:
  - File `.gitignore` toàn diện chống commit secrets và file rác.
  - File `.env.example` với các biến môi trường mẫu.
  - File quy tắc đóng góp `CONTRIBUTING.md` và giấy phép `LICENSE` (MIT).
