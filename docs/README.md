# Tài liệu Kỹ thuật — Hệ thống Giám sát InfraWatch (N4.7)

Thư mục `docs/` là kho tri thức trung tâm của dự án InfraWatch. Mọi thông tin về kiến trúc hệ thống, phạm vi, yêu cầu chức năng, hướng dẫn triển khai, quy trình vận hành và hợp đồng API đều được lưu trữ và cập nhật tại đây.

---

## Mục lục Tài liệu

### 1. Tổng quan & Phạm vi
- [PROJECT_OVERVIEW.md](file:///d:/h_Nam_4/InfraWatch/docs/PROJECT_OVERVIEW.md): Giới thiệu bối cảnh, mục tiêu kinh doanh/kỹ thuật và đối tượng thụ hưởng.
- [SCOPE.md](file:///d:/h_Nam_4/InfraWatch/docs/SCOPE.md): Giới hạn phạm vi phát triển theo từng giai đoạn (In-Scope & Out-of-Scope).
- [REQUIREMENTS.md](file:///d:/h_Nam_4/InfraWatch/docs/REQUIREMENTS.md): Yêu cầu chức năng (FR) và phi chức năng (NFR).

### 2. Thiết kế Kiến trúc
- [ARCHITECTURE.md](file:///d:/h_Nam_4/InfraWatch/docs/ARCHITECTURE.md): Kiến trúc tổng thể và các quyết định công nghệ quan trọng (ADRs).
- [architecture/system-context.md](file:///d:/h_Nam_4/InfraWatch/docs/architecture/system-context.md): Sơ đồ ngữ cảnh hệ thống (C4 Model Level 1).
- [architecture/container-architecture.md](file:///d:/h_Nam_4/InfraWatch/docs/architecture/container-architecture.md): Sơ đồ phân rã container (C4 Model Level 2).
- [architecture/monitoring-data-flow.md](file:///d:/h_Nam_4/InfraWatch/docs/architecture/monitoring-data-flow.md): Luồng vận chuyển metrics từ Exporter đến Dashboard và Telegram.

### 3. Chuẩn mực & Cấu trúc
- [DIRECTORY_STRUCTURE.md](file:///d:/h_Nam_4/InfraWatch/docs/DIRECTORY_STRUCTURE.md): Giải thích chi tiết trách nhiệm của từng thư mục trong dự án.
- [api/API_CONTRACT.md](file:///d:/h_Nam_4/InfraWatch/docs/api/API_CONTRACT.md): Đặc tả hợp đồng giao tiếp RESTful API giữa Backend và Frontend.

### 4. Triển khai & Vận hành
- [DEPLOYMENT_GUIDE.md](file:///d:/h_Nam_4/InfraWatch/docs/DEPLOYMENT_GUIDE.md): Hướng dẫn cài đặt và khởi chạy trên Linux VM / Docker Lab.
- [CONFIGURATION_GUIDE.md](file:///d:/h_Nam_4/InfraWatch/docs/CONFIGURATION_GUIDE.md): Hướng dẫn tinh chỉnh các file cấu hình Prometheus, Alertmanager và Grafana.
- [RUNBOOK.md](file:///d:/h_Nam_4/InfraWatch/docs/RUNBOOK.md): Sổ tay hướng dẫn xử lý sự cố khẩn cấp và quy trình ứng cứu.

### 5. Đảm bảo Chất lượng & Quản trị Dự án
- [TEST_PLAN.md](file:///d:/h_Nam_4/InfraWatch/docs/TEST_PLAN.md): Kế hoạch và phương pháp kiểm thử (Unit, Integration, Chaos, Load).
- [KPI_DEFINITIONS.md](file:///d:/h_Nam_4/InfraWatch/docs/KPI_DEFINITIONS.md): Định nghĩa các chỉ số đo lường hiệu năng kỹ thuật và độ ổn định hệ thống.
- [RISK_REGISTER.md](file:///d:/h_Nam_4/InfraWatch/docs/RISK_REGISTER.md): Bảng đăng ký và kiểm soát rủi ro dự án.
- [CHANGELOG.md](file:///d:/h_Nam_4/InfraWatch/docs/CHANGELOG.md): Nhật ký lịch sử các bản cập nhật.
