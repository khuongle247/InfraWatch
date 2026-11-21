# InfraWatch (N4.7)
**Hệ thống giám sát máy chủ, Cloud và trung tâm dữ liệu**

[![Architecture: Microservices](https://img.shields.io/badge/Architecture-Microservices-blue.svg)](#kien-truc-tong-quan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Phase: 0](https://img.shields.io/badge/Phase-0%20Initialization-green.svg)](#lo-trinh-phat-trien)

---

## 1. Giới thiệu dự án

**InfraWatch** là giải pháp giám sát hạ tầng tập trung được thiết kế cho môi trường Linux VM và Docker Lab. Hệ thống cung cấp khả năng thu thập chỉ số thời gian thực (real-time metrics) của hệ điều hành và các container, trực quan hóa trạng thái hệ thống thông qua Web Dashboard và Grafana, tự động đánh giá cảnh báo theo ngưỡng định sẵn và thông báo tức thời qua Telegram Bot API.

### Mục tiêu cốt lõi
- **Thu thập dữ liệu toàn diện:** Theo dõi CPU, RAM, Disk I/O, Network I/O trên máy chủ vật lý/VM (qua Node Exporter) và tài nguyên từng container (qua cAdvisor).
- **Lưu trữ hiệu năng cao:** Quản lý Time-Series Data tập trung bằng Prometheus với chu kỳ scrape tối ưu.
- **Trực quan hóa đa tầng:** 
  - **Custom Web Dashboard (React + FastAPI):** Giao diện tập trung, thân thiện, điều hành tổng quan hệ thống.
  - **Grafana Dashboard:** Phục vụ phân tích chuyên sâu các metrics hạ tầng.
- **Cảnh báo chủ động (Active Alerting):** Phát hiện sự cố tự động bằng Alertmanager và đẩy thông báo đa kênh tới quản trị viên qua Telegram.
- **Kiểm thử khả năng chịu lỗi (Resilience & Chaos Testing):** Tích hợp kịch bản mô phỏng sự cố thực tế (quá tải CPU, đầy ổ cứng, crash service).

---

## 2. Ngăn xếp công nghệ (Technology Stack)

| Thành phần | Công nghệ | Phiên bản khuyến nghị | Vai trò |
| :--- | :--- | :--- | :--- |
| **Container Engine** | Docker Engine & Compose | Docker 24+, Compose v2 | Đóng gói và điều phối dịch vụ |
| **Metrics Collector** | Node Exporter | v1.8.x | Thu thập metrics hệ điều hành Linux |
| **Container Metrics** | cAdvisor | v0.49.x | Thu thập metrics Docker containers |
| **Blackbox Prober** | Blackbox Exporter | v0.25.x | Kiểm tra sẵn sàng endpoint HTTP và cổng TCP |
| **Time-Series DB** | Prometheus | v2.52.x | Lưu trữ và xử lý truy vấn PromQL |
| **Alert Router** | Alertmanager | v0.27.x | Quản lý, gom nhóm và định tuyến cảnh báo |
| **Notification** | Telegram Bot API | Long Polling / Webhook | Kênh thông báo tức thời tới kỹ sư vận hành |
| **Deep Viz** | Grafana | v10.4.x | Bảng điều khiển phân tích số liệu chuyên sâu |
| **Backend API** | FastAPI (Python 3.11+) | 0.111.x | Cung cấp REST API, cầu nối Prometheus |
| **Frontend Web** | React 18 + Vite | React 18, Vite 5 | Dashboard điều hành chính cho người dùng |

---

## 3. Cấu trúc thư mục tổng quan

```text
InfraWatch/
├── docs/                 # Tài liệu kỹ thuật, kiến trúc, API và vận hành
├── infrastructure/       # Cấu hình Docker, Prometheus, Grafana, Alertmanager
├── backend/              # Mã nguồn FastAPI service (Python)
├── frontend/             # Mã nguồn React Web Dashboard (Vite)
├── scripts/              # Shell scripts cài đặt, kiểm tra sức khỏe và chaos testing
├── tests/                # Bộ kịch bản kiểm thử (Integration, Chaos, Performance)
├── datasets/             # Dữ liệu mẫu benchmark (NAB, Loghub, Google Cluster)
├── evidence/             # Kết quả kiểm thử, hình ảnh, báo cáo nghiệm thu
├── docker-compose.yml    # Khởi chạy toàn bộ hạ tầng cục bộ
├── .env.example          # Mẫu cấu hình biến môi trường
└── CONTRIBUTING.md       # Quy chuẩn đóng góp mã nguồn cho nhóm
```

Chi tiết xem tại [DIRECTORY_STRUCTURE.md](file:///d:/h_Nam_4/InfraWatch/docs/DIRECTORY_STRUCTURE.md).

---

## 4. Hướng dẫn khởi động nhanh (Dự kiến cho các Phase sau)

### Yêu cầu tiên quyết
- Linux OS (Ubuntu 22.04 LTS / Debian 12 khuyến nghị) hoặc Docker Desktop trên Windows/macOS.
- Docker Engine >= 24.0 và Docker Compose >= 2.20.
- Python 3.11+ (cho phát triển backend cục bộ).
- Node.js >= 18.x và npm/pnpm (cho phát triển frontend cục bộ).

### Các bước khởi động
1. **Sao chép mã nguồn:**
   ```bash
   git clone https://github.com/khuongle247/InfraWatch.git
   cd InfraWatch
   ```

2. **Thiết lập biến môi trường:**
   ```bash
   cp .env.example .env
   # Chỉnh sửa cấu hình Telegram Bot Token và Chat ID trong file .env
   ```

3. **Khởi chạy hệ thống bằng Docker Compose:**
   ```bash
   docker compose up -d
   ```

4. **Kiểm tra trạng thái các dịch vụ:**
   ```bash
   ./scripts/health-check.sh
   ```

### Cổng dịch vụ mặc định
- **Web Dashboard:** `http://localhost:3000`
- **FastAPI Backend:** `http://localhost:8000` (Docs: `http://localhost:8000/docs`)
- **Prometheus:** `http://localhost:9090`
- **Grafana:** `http://localhost:3001` (admin/admin mặc định)
- **Alertmanager:** `http://localhost:9093`
- **Node Exporter:** `http://localhost:9100`
- **cAdvisor:** `http://localhost:8080`
- **Blackbox Exporter:** `http://localhost:9115`

---

## 5. Quy tắc nhóm và phân chia công việc

Dự án áp dụng chặt chẽ quy trình phát triển chuyên nghiệp:
- Tuân thủ [CONTRIBUTING.md](file:///d:/h_Nam_4/InfraWatch/CONTRIBUTING.md) về phân nhánh Git và quy tắc Conventional Commits.
- Không push trực tiếp lên nhánh `main`. Mọi thay đổi phải thông qua Pull Request có tối thiểu 1 reviewer duyệt.
- Tuyệt đối không commit secrets, token hoặc credential vào git repository.

---

## 6. Giấy phép
Dự án được phân phối dưới giấy phép [MIT License](file:///d:/h_Nam_4/InfraWatch/LICENSE).

