# Hướng dẫn Triển khai (Deployment Guide) — InfraWatch (N4.7)

Tài liệu này cung cấp quy trình từng bước để cài đặt và triển khai hệ thống **InfraWatch** trên môi trường máy chủ Linux hoặc phòng lab ảo hóa (Linux VM/Docker).

---

## 1. Yêu cầu Phần cứng & Phần mềm Tối thiểu

### Yêu cầu phần cứng (cho máy chủ Host / VM):
- **CPU:** Tối thiểu 2 vCPU (khuyến nghị 4 vCPU nếu chạy kiểm thử Chaos).
- **RAM:** Tối thiểu 4 GB (khuyến nghị 8 GB).
- **Ổ cứng (Disk):** Tối thiểu 20 GB dung lượng trống (SSD khuyến nghị).
- **Hệ điều hành:** Ubuntu Server 22.04 LTS / Debian 12 / Rocky Linux 9.

### Yêu cầu phần mềm:
- Docker Engine version 24.0 trở lên.
- Docker Compose version 2.20 trở lên.
- Quyền quản trị `sudo` trên máy chủ.
- Kết nối Internet (để kéo Docker images và gửi tin nhắn qua Telegram API).

---

## 2. Quy trình Triển khai Chuẩn (4 Bước)

### Bước 1: Sao chép mã nguồn về máy chủ
```bash
git clone https://github.com/khuongle247/InfraWatch.git
cd InfraWatch
```

### Bước 2: Chạy script khởi tạo môi trường
Hệ thống cung cấp script tự động để kiểm tra phụ thuộc và tạo file `.env`:
```bash
chmod +x scripts/*.sh scripts/chaos/*.sh
./scripts/setup.sh
```

### Bước 3: Cấu hình biến môi trường và Telegram Bot
1. Mở file `.env` bằng trình soạn thảo (`nano .env` hoặc `vim .env`).
2. Thiết lập cấu hình Telegram:
   ```dotenv
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ
   TELEGRAM_CHAT_ID=-1001234567890
   ```
3. Cập nhật file cấu hình `infrastructure/alertmanager/alertmanager.yml` tương ứng với thông tin Telegram của bạn.

### Bước 4: Khởi chạy toàn bộ hệ thống
```bash
docker compose up -d --build
```

Kiểm tra trạng thái các container:
```bash
docker compose ps
```

---

## 3. Kiểm tra Tính sẵn sàng (Verification)

Chạy script kiểm tra sức khỏe tự động:
```bash
./scripts/health-check.sh
```

Nếu tất cả các dịch vụ trả về `OK`, bạn có thể truy cập các dịch vụ thông qua trình duyệt web:
- **InfraWatch Web Dashboard:** `http://<IP_MAY_CHU>:3000`
- **FastAPI Documentation:** `http://<IP_MAY_CHU>:8000/docs`
- **Grafana Dashboard:** `http://<IP_MAY_CHU>:3001` (Tài khoản: `admin` / `admin`)
- **Prometheus UI:** `http://<IP_MAY_CHU>:9090`
- **Alertmanager UI:** `http://<IP_MAY_CHU>:9093`

---

## 4. Dừng và Bảo trì Hệ thống

- **Dừng hệ thống giữ nguyên dữ liệu:**
  ```bash
  docker compose down
  ```
- **Dừng hệ thống và xóa toàn bộ dữ liệu volumes (CẢNH BÁO: mất metrics lịch sử):**
  ```bash
  docker compose down -v
  ```
- **Xem nhật ký log thời gian thực:**
  ```bash
  docker compose logs -f [service_name]
  ```

