# Project Verification Evidence & Artifacts — InfraWatch

Thư mục này lưu trữ các minh chứng thực tế phục vụ báo cáo tiến độ, bảo vệ đồ án và kiểm thử chất lượng sản phẩm qua từng giai đoạn phát triển.

## Cấu trúc lưu trữ:

- `screenshots/`: Ảnh chụp màn hình giao diện Web Dashboard, biểu đồ Grafana, tin nhắn cảnh báo Telegram, bảng điều khiển Prometheus targets.
- `test-results/`: Báo cáo kết quả kiểm thử đơn vị (Unit Test), kiểm thử tích hợp (Integration Test), file log kết quả chạy tự động (JUnit XML, coverage report).
- `chaos-results/`: Bằng chứng kết quả các đợt diễn tập sự cố (Chaos testing log, đồ thị biến động metrics, thời gian nhận cảnh báo thực tế).
- `demo/`: Video demo hoặc file GIF minh họa các kịch bản sử dụng chính của hệ thống.

> **Quy tắc an toàn:** Tuyệt đối không lưu ảnh hoặc tài liệu có chứa IP public nhạy cảm, Token Telegram thật hoặc mật khẩu vào thư mục evidence.
