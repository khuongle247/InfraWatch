# Operational & Automation Scripts — InfraWatch

Thư mục này tập hợp các tiện ích dòng lệnh (Shell Scripts) phục vụ tự động hóa việc khởi tạo, kiểm tra sức khỏe hệ thống, sao lưu/phục hồi dữ liệu và kiểm thử khả năng chịu lỗi (Chaos Testing).

## Danh mục Scripts:

| Tên Script | Mục đích | Cách sử dụng |
| :--- | :--- | :--- |
| `setup.sh` | Kiểm tra môi trường tiên quyết (Docker, Compose) và chuẩn bị cấu hình `.env` | `bash scripts/setup.sh` |
| `health-check.sh` | Kiểm tra kết nối và trạng thái của tất cả container & endpoint API | `bash scripts/health-check.sh` |
| `backup.sh` | Sao lưu cấu hình và dữ liệu Prometheus TSDB, Grafana | `bash scripts/backup.sh` |
| `restore.sh` | Phục hồi dữ liệu từ bản sao lưu | `bash scripts/restore.sh <backup_file>` |

## Thư mục con:
- `chaos/`: Chứa các kịch bản mô phỏng sự cố có kiểm soát (Chaos Engineering) để đánh giá khả năng kích hoạt cảnh báo của Prometheus & Alertmanager.

> **CẢNH BÁO AN TOÀN:** Không tự ý chạy các script trong thư mục `chaos/` trên môi trường Production!
