# InfraWatch Backend Service

Dịch vụ Backend xây dựng trên nền tảng **FastAPI (Python 3.11+)**, đóng vai trò là cầu nối xử lý nghiệp vụ, tích hợp với Prometheus API, Alertmanager và cung cấp REST API cho Web Dashboard.

## 1. Cấu trúc thư mục

```text
backend/
├── app/
│   ├── main.py              # Điểm khởi chạy ứng dụng FastAPI (Entry point)
│   ├── core/                # Cấu hình hệ thống (Settings) và Logging
│   │   ├── config.py
│   │   └── logging.py
│   ├── api/                 # Định tuyến API
│   │   └── v1/
│   │       ├── router.py    # Router tổng hợp của v1 API
│   │       └── endpoints/   # Các controller theo từng resource (metrics, hosts, alerts)
│   ├── services/            # Tầng xử lý nghiệp vụ (Business Logic)
│   ├── integrations/        # Tầng giao tiếp hệ thống bên ngoài (Prometheus, Grafana)
│   │   ├── prometheus/      # Client truy vấn PromQL
│   │   └── grafana/         # Tích hợp Grafana iframe/embed API
│   ├── schemas/             # Pydantic models (Data validation & serialization)
│   └── utils/               # Helper functions
├── tests/                   # Unit test và API test (pytest)
├── requirements.txt         # Quản lý thư viện Python
├── Dockerfile               # Đóng gói container backend
└── .env.example             # Biến môi trường mẫu cho backend
```

## 2. Hướng dẫn chạy cục bộ (Local Development)

```bash
# Tạo và kích hoạt môi trường ảo Python
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt

# Khởi chạy server development với live-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/health`

