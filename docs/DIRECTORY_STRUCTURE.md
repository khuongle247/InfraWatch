# Cấu trúc Thư mục Dự án (Directory Structure) — InfraWatch (N4.7)

Tài liệu này giải thích chi tiết mục đích, trách nhiệm và vai trò của từng thư mục trong cấu trúc mã nguồn của **InfraWatch**.

---

## Cây Thư mục Tổng thể

```text
InfraWatch/
│
├── README.md                      # Giới thiệu tổng quan dự án, hướng dẫn chạy nhanh
├── docker-compose.yml             # Khai báo cấu hình toàn bộ các container dịch vụ
├── .env.example                   # Tệp mẫu chứa danh sách biến môi trường và placeholder
├── .gitignore                     # Cấu hình bỏ qua các tệp không commit (secrets, dependencies)
├── LICENSE                        # Giấy phép bản quyền mã nguồn mở (MIT)
├── CONTRIBUTING.md                # Quy chuẩn đóng góp mã nguồn, branching và commit
│
├── docs/                          # Kho tài liệu kỹ thuật, kiến trúc và vận hành
│   ├── README.md                  # Mục lục điều hướng tài liệu
│   ├── PROJECT_OVERVIEW.md        # Tổng quan bối cảnh, vấn đề và mục tiêu dự án
│   ├── SCOPE.md                   # Giới hạn phạm vi phát triển (In-Scope vs Out-of-Scope)
│   ├── REQUIREMENTS.md            # Đặc tả yêu cầu chức năng (FR) và phi chức năng (NFR)
│   ├── ARCHITECTURE.md            # Thiết kế kiến trúc tổng thể và các quyết định ADR
│   ├── DIRECTORY_STRUCTURE.md     # Bản giải thích trách nhiệm từng thư mục này
│   ├── DEPLOYMENT_GUIDE.md        # Hướng dẫn chi tiết triển khai lên môi trường Lab
│   ├── CONFIGURATION_GUIDE.md     # Hướng dẫn tinh chỉnh các file cấu hình giám sát
│   ├── TEST_PLAN.md               # Kế hoạch và phương pháp kiểm thử hệ thống
│   ├── KPI_DEFINITIONS.md         # Định nghĩa các chỉ số đo lường hiệu năng kỹ thuật
│   ├── RISK_REGISTER.md           # Bảng quản lý và kiểm soát rủi ro dự án
│   ├── RUNBOOK.md                 # Sổ tay quy trình ứng cứu sự cố khẩn cấp
│   ├── CHANGELOG.md               # Nhật ký ghi nhận các thay đổi qua từng phiên bản
│   │
│   ├── architecture/              # Tài liệu kiến trúc phân rã theo mô hình C4
│   │   ├── system-context.md      # Sơ đồ ngữ cảnh hệ thống (C4 Level 1)
│   │   ├── container-architecture.md # Sơ đồ phân rã container dịch vụ (C4 Level 2)
│   │   └── monitoring-data-flow.md# Sơ đồ luồng luân chuyển dữ liệu metrics & alerts
│   │
│   ├── api/                       # Đặc tả giao diện lập trình ứng dụng
│   │   └── API_CONTRACT.md        # Hợp đồng REST API giữa Backend và Frontend
│   │
│   └── reports/                   # Thư mục lưu trữ các báo cáo tiến độ định kỳ
│       └── .gitkeep
│
├── infrastructure/                # Cấu hình hạ tầng điều phối và giám sát
│   ├── docker/                    # Dockerfile bổ trợ cho hệ thống
│   │   ├── README.md              # Hướng dẫn build các dockerfile mở rộng
│   │   └── Dockerfile.dashboard   # Multi-stage Dockerfile cho Web Dashboard (Nginx)
│   │
│   ├── prometheus/                # Cấu hình cho Prometheus Server
│   │   ├── prometheus.yml         # Cấu hình scrape targets, global settings, alertmanagers
│   │   └── rules/                 # Thư mục lưu các file định nghĩa Alert Rules (*.yml)
│   │       └── .gitkeep
│   │
│   ├── alertmanager/              # Cấu hình cho Alertmanager
│   │   └── alertmanager.yml.example # File mẫu cấu hình định tuyến Telegram Bot
│   │
│   ├── grafana/                   # Cấu hình tự động khởi tạo Grafana (Provisioning)
│   │   ├── provisioning/
│   │   │   ├── datasources/       # Tự động nạp Prometheus Datasource
│   │   │   │   └── prometheus.yml
│   │   │   └── dashboards/        # Tự động nạp các tệp Dashboard JSON
│   │   │       └── dashboards.yml
│   │   │
│   │   └── dashboards/            # Thư mục chứa các tệp Dashboard JSON chuẩn
│   │       └── .gitkeep
│   │
│   └── exporters/                 # Tài liệu hóa và cấu hình các metrics exporters
│       └── README.md
│
├── backend/                       # Dịch vụ Backend API xây dựng bằng FastAPI
│   ├── README.md                  # Hướng dẫn cài đặt và chạy Backend độc lập
│   ├── requirements.txt           # Quản lý danh sách thư viện phụ thuộc Python
│   ├── .env.example               # Mẫu biến môi trường cho Backend
│   ├── Dockerfile                 # Đóng gói container ứng dụng Backend
│   │
│   ├── app/                       # Mã nguồn ứng dụng Python
│   │   ├── main.py                # Điểm khởi động ứng dụng FastAPI (app instance, CORS)
│   │   ├── core/                  # Thiết lập cấu hình hệ thống (Settings) và Logging
│   │   │   ├── config.py
│   │   │   └── logging.py
│   │   │
│   │   ├── api/                   # Tầng định tuyến API
│   │   │   └── v1/
│   │   │       ├── router.py      # Bộ định tuyến tổng của v1
│   │   │       └── endpoints/     # Các controller xử lý endpoint (metrics, alerts, hosts)
│   │   │           └── .gitkeep
│   │   │
│   │   ├── services/              # Tầng xử lý logic nghiệp vụ
│   │   │   └── .gitkeep
│   │   │
│   │   ├── integrations/          # Tầng tích hợp hệ thống bên ngoài
│   │   │   ├── prometheus/        # Client kết nối và truy vấn Prometheus HTTP API
│   │   │   │   └── .gitkeep
│   │   │   └── grafana/           # Tích hợp nhúng bảng điều khiển Grafana
│   │   │       └── .gitkeep
│   │   │
│   │   ├── schemas/               # Pydantic schemas (Request/Response models)
│   │   │   └── .gitkeep
│   │   │
│   │   └── utils/                 # Các hàm tiện ích dùng chung
│   │       └── .gitkeep
│   │
│   └── tests/                     # Kiểm thử tự động cho backend (pytest)
│       └── .gitkeep
│
├── frontend/                      # Ứng dụng Web Dashboard xây dựng bằng React 18 + Vite
│   ├── README.md                  # Hướng dẫn cài đặt và chạy Frontend
│   ├── package.json               # Danh sách dependencies npm và build scripts
│   ├── index.html                 # Trang HTML đơn trang gốc
│   ├── vite.config.js             # Cấu hình Vite bundler và proxy dev server
│   ├── .env.example               # Mẫu biến môi trường cho Frontend
│   │
│   ├── public/                    # Thư mục lưu assets công khai (favicon, logo)
│   │   └── .gitkeep
│   │
│   └── src/                       # Mã nguồn giao diện React
│       ├── main.jsx               # Điểm khởi tạo ReactDOM
│       ├── App.jsx                # Root Component của ứng dụng
│       │
│       ├── assets/                # Hình ảnh, icon nội bộ
│       │   └── .gitkeep
│       │
│       ├── components/            # UI components tái sử dụng (MetricCard, AlertBadge)
│       │   └── .gitkeep
│       │
│       ├── layouts/               # Khung bố cục giao diện (Sidebar, TopNav)
│       │   └── .gitkeep
│       │
│       ├── pages/                 # Các màn hình chính (Dashboard, Hosts, Alerts)
│       │   └── .gitkeep
│       │
│       ├── services/              # Tầng gọi API Backend (HTTP client)
│       │   └── .gitkeep
│       │
│       ├── hooks/                 # Custom React Hooks
│       │   └── .gitkeep
│       │
│       ├── utils/                 # Hàm tiện ích (format số liệu, ngày tháng)
│       │   └── .gitkeep
│       │
│       └── styles/                # CSS stylesheet toàn cục
│           └── .gitkeep
│
├── scripts/                       # Các shell scripts hỗ trợ vận hành và tự động hóa
│   ├── README.md                  # Hướng dẫn chi tiết cách chạy từng script
│   ├── setup.sh                   # Script kiểm tra điều kiện tiên quyết và khởi tạo file .env
│   ├── health-check.sh            # Script quét và kiểm tra sức khỏe toàn bộ các dịch vụ
│   ├── backup.sh                  # Script sao lưu cấu hình và dữ liệu
│   ├── restore.sh                 # Script phục hồi cấu hình từ bản sao lưu
│   │
│   └── chaos/                     # Thư mục kịch bản kiểm thử lỗi có kiểm soát
│       ├── README.md              # Quy tắc an toàn và danh mục kịch bản chaos
│       ├── high-cpu.sh            # Kịch bản mô phỏng quá tải CPU
│       ├── disk-usage.sh          # Kịch bản mô phỏng áp lực dung lượng ổ cứng
│       └── service-down.sh        # Kịch bản mô phỏng sự cố dừng container
│
├── tests/                         # Thư mục chứa các bộ kịch bản kiểm thử cấp hệ thống
│   ├── README.md                  # Chiến lược kiểm thử chất lượng toàn diện
│   ├── integration/               # Test tích hợp giữa các thành phần phần mềm
│   │   └── .gitkeep
│   ├── system/                    # Test End-to-End toàn bộ hệ sinh thái
│   │   └── .gitkeep
│   ├── chaos/                     # Test tự động hóa kịch bản chaos và ghi log phản ứng
│   │   └── .gitkeep
│   └── performance/               # Test tải (Load test) cho Backend và Prometheus
│       └── .gitkeep
│
├── datasets/                      # Dữ liệu chuẩn (Benchmark Datasets) phục vụ nghiên cứu
│   ├── README.md                  # Hướng dẫn và mô tả các bộ dữ liệu
│   ├── nab/                       # Numenta Anomaly Benchmark
│   │   └── .gitkeep
│   ├── loghub/                    # LogHub System Logs
│   │   └── .gitkeep
│   └── google-cluster/            # Google Cluster Workload Traces
│       └── .gitkeep
│
└── evidence/                      # Bằng chứng kiểm thử và nghiệm thu sản phẩm
    ├── README.md                  # Quy định lưu trữ artifact và báo cáo
    ├── screenshots/               # Ảnh chụp giao diện, đồ thị và tin nhắn Telegram
    │   └── .gitkeep
    ├── test-results/              # Kết quả chạy test suites, coverage reports
    │   └── .gitkeep
    ├── chaos-results/             # Dữ liệu log và đồ thị thời gian phản hồi sự cố chaos
    │   └── .gitkeep
    └── demo/                      # Video hoặc GIF mô phỏng hoạt động hệ thống
        └── .gitkeep
```

