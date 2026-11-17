# Benchmark Datasets — InfraWatch

Thư mục này lưu trữ metadata, tài liệu mô tả và mẫu dữ liệu chuẩn phục vụ cho việc đánh giá, kiểm thử hiệu năng và nghiên cứu mô hình phát hiện bất thường (cho các phase nâng cao tiếp theo).

## Các bộ dữ liệu được định hướng:

### 1. `nab/` (Numenta Anomaly Benchmark)
- Bộ dữ liệu chuẩn mực chuyên dùng để đánh giá các thuật toán phát hiện bất thường trên chuỗi thời gian (streaming time-series data).
- Bao gồm các metrics: Real-world AWS CloudWatch metrics, CPU utilization, traffic data, v.v.

### 2. `loghub/` (LogHub Dataset)
- Bộ sưu tập nhật ký hệ thống (system logs) chuẩn từ các hệ thống phân tán lớn (Hadoop, HDFS, Spark, Linux syslog).
- Dùng để tham chiếu phân tích tương quan sự cố giữa metrics và logs.

### 3. `google-cluster/` (Google Cluster Workload Traces)
- Dữ liệu trace thực tế từ các cụm máy chủ quy mô lớn của Google, thể hiện mức độ biến động CPU, RAM và vòng đời container/job.

> **Ghi chú:** Do dung lượng các bộ dữ liệu đầy đủ rất lớn (nhiều GB), thư mục này chỉ lưu trữ các tệp mẫu (sample slice) hoặc đường dẫn tải về. Tuyệt đối không commit raw datasets dung lượng lớn vào Git repository.

