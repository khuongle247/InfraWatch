# Tổng quan Dự án — InfraWatch (N4.7)

## 1. Tên dự án & Định danh
- **Mã số đề tài:** N4.7
- **Tên dự án:** InfraWatch
- **Tên đầy đủ tiếng Việt:** Hệ thống giám sát máy chủ, Cloud và trung tâm dữ liệu
- **Tên tiếng Anh:** InfraWatch — Centralized Infrastructure, Cloud & Data Center Monitoring System

---

## 2. Bối cảnh & Vấn đề thực tiễn (Problem Statement)
Trong các môi trường trung tâm dữ liệu, điện toán đám mây và phòng lab công nghệ, việc duy trì tính sẵn sàng (high availability) và hiệu năng ổn định của hệ thống máy chủ vật lý, máy ảo (Linux VMs) và các container là yếu tố sống còn. 
Một số khó khăn điển hình mà quản trị viên hệ thống thường gặp phải:
1. **Thiếu khả năng hiển thị tập trung (Visibility Gap):** Khó theo dõi tổng quan cùng lúc sức khỏe phần cứng, hệ điều hành và trạng thái của hàng chục container độc lập.
2. **Cảnh báo trễ và phân tán (Alert Fatigue & Lag):** Quản trị viên chỉ biết sự cố khi người dùng phàn nàn, hoặc nhận quá nhiều email cảnh báo rác không được phân loại mức độ nghiêm trọng.
3. **Thiếu công cụ trực quan thân thiện:** Các công cụ chuyên sâu như Grafana thường phức tạp đối với người dùng vận hành thông thường, trong khi các phần mềm giám sát thương mại lại đắt đỏ và nặng nề.

---

## 3. Mục tiêu của Hệ thống InfraWatch
InfraWatch được xây dựng với mục tiêu cung cấp giải pháp giám sát tập trung mã nguồn mở, tối ưu cho môi trường Linux VM và Docker:
- **Giám sát thời gian thực:** Thu thập các chỉ số phần cứng (CPU, Memory, Disk, Network) và container với chu kỳ 15 giây.
- **Lưu trữ tối ưu:** Sử dụng Prometheus Time-Series Database để lưu trữ dữ liệu chỉ số hiệu quả cao.
- **Trực quan hóa đa lớp:** Cung cấp Web Dashboard trực quan (React + FastAPI) cho quản trị hàng ngày, kết hợp Grafana cho phân tích chuyên sâu.
- **Phát hiện sự cố & Cảnh báo tức thời:** Thiết lập ngưỡng cảnh báo tự động và gửi thông báo sự cố/phục hồi tới Telegram của đội ngũ vận hành.
- **Đánh giá độ tin cậy:** Tích hợp bộ công cụ Chaos Engineering để kiểm chứng độ nhạy của hệ thống cảnh báo trước khi triển khai thực tế.

---

## 4. Đối tượng sử dụng (Stakeholders)
- **DevOps / SysAdmin / SRE:** Theo dõi tình trạng hạ tầng, tiếp nhận cảnh báo Telegram và điều tra nguyên nhân gốc rễ (RCA).
- **Phát triển ứng dụng (Developers):** Xem xét mức độ tiêu hao tài nguyên của container để tối ưu mã nguồn.
- **Ban quản lý kỹ thuật (Team Lead / IT Manager):** Đánh giá báo cáo tải, SLA và tính sẵn sàng của hệ thống.
