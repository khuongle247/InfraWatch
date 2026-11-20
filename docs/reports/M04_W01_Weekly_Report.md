# InfraWatch — Weekly Report W01 (M04)

| Tuần | Nhóm | Leader |
|---|---|---|
| W01 theo nhãn trong kế hoạch 18 tuần; ngày bao phủ lịch chưa được cung cấp/xác nhận. Báo cáo lập ngày 20/11/2026. | N4.7 — InfraWatch | M01 — Team Leader; tên cụ thể chưa có trong tài liệu được cung cấp |

**Người báo cáo:** Phan Tấn Thuận — M04, Frontend Dashboard Engineer  
**Trạng thái phần việc M04/W01:** Hoàn thành deliverable khảo sát và đánh giá; chờ Leader xem xét.  
**Tiến độ phần việc W01 của M04:** 100% deliverable trong phạm vi cá nhân đã tạo và kiểm tra; không đại diện cho tiến độ chung của dự án/tuần.

## 1. Mục tiêu tuần

Theo sheet `Tien_do_18_tuan`, W01/M04: **Khảo sát dashboard monitoring và UI tham khảo.** Nhiệm vụ của báo cáo này là đọc kế hoạch, khảo sát các mô hình UI chuyên nghiệp dựa trên tài liệu công khai, kiểm tra prototype Overview thật trong repo và ghi kết quả theo evidence. Không làm trước W02 hoặc các màn hình kế tiếp.

## 2. Công việc hoàn thành

1. Đọc bộ M04 AI-context được cung cấp: hướng dẫn bắt đầu, Project Plan v2, phân công/mẫu báo cáo, bản xuất kế hoạch 18 tuần từ Excel, prompt VS Code và sơ đồ kiến trúc; đối chiếu thêm tài liệu requirements, overview, KPI, luồng monitoring và Git contribution trong repository.
2. Xác nhận kế hoạch yêu cầu W01/M04 là khảo sát UI monitoring; W02 mới xác định người dùng, màn hình và luồng. Ghi rõ Dashboard Web là giao diện chính, Grafana là công cụ phân tích kỹ thuật theo Project Plan.
3. Tham khảo tài liệu chính thức Grafana, Datadog, Elastic Observability và WCAG 2.2; rút ra nguyên tắc có giới hạn theo Core MVP.
4. Kiểm tra source hiện tại và prototype Overview; ghi nhận điểm mạnh, rủi ro về health score, tính nhất quán chart/mock, ngày hiển thị, thứ bậc cảnh báo và accessibility.
5. Chạy production build frontend thành công; mở ứng dụng local và xác nhận tìm kiếm host, time range, refresh message, empty state và menu mobile bằng browser.
6. Tạo báo cáo nghiên cứu UI/UX và Weekly Report này. Không chỉnh sửa frontend, backend, infrastructure hoặc code của thành viên khác.

## 3. Tiến độ dự án và minh chứng

| Hạng mục | Kết quả / trạng thái | Minh chứng |
|---|---|---|
| Nhánh và prototype hiện có | Đúng nhánh cá nhân `feat/phan-tan-thuan-frontend`; HEAD và remote branch cùng ở `aa634fe` (`feat(frontend): demo overview dashboard`). `main` không được thay đổi. | `git branch --show-current`, `git log`; commit `aa634fe86fe2c6c0c4de720419b3e1b275d76a7c`. |
| Build frontend | Thành công: Vite 5.4.21, 32 modules transformed; tạo `dist/index.html`, CSS và JS bundle. | `npm --prefix frontend run build` — exit code 0. |
| Browser check | Trang title “InfraWatch \| Infrastructure Overview” hiển thị. Search `lab-edge` lọc 1/5 host; 24H được chọn; refresh hiển thị “đã làm mới dữ liệu mô phỏng — chưa kết nối API”; không khớp hiển thị empty state; menu mobile mở/đóng. | Browser snapshot trực tiếp ngày 20/11/2026; thao tác tương tác đã chạy trong browser. |
| Tính trung thực dữ liệu | Các nhãn mock/demo xuất hiện rõ; không có bằng chứng frontend đã kết nối FastAPI hoặc Prometheus. | Banner `PREVIEW BUILD`, `MOCK DATA`, `SIMULATION DATA`; `frontend/src/pages/Overview.jsx`. |
| Deliverable tuần | Đã tạo báo cáo nghiên cứu và đánh giá chi tiết; kèm nguồn công khai, giới hạn khảo sát, phát hiện và hành động tiếp theo. | [M04_W01_UI_UX_Research.md](./M04_W01_UI_UX_Research.md). |
| Báo cáo tuần | Báo cáo theo đủ 7 mục của mẫu nhóm. | File hiện tại. |

## 4. Hoạt động thực tế và Coursera

- **Hoạt động thực tế có bằng chứng:** đọc và đối chiếu kế hoạch; nghiên cứu tài liệu sản phẩm chính thức; kiểm tra source, chạy build và tương tác trên prototype local; lập báo cáo UI/UX và weekly.
- **Coursera:** bộ tài liệu/session evidence được cung cấp không có thông tin khóa học, thời lượng hoặc tiến độ Coursera của M04. Không ghi nhận hoàn thành khóa học để tránh suy đoán.

## 5. Việc chưa hoàn thành và lý do

- **Chưa kiểm tra workbook Excel gốc:** trong repo và thư mục AI-context được cung cấp chỉ có `03_Tien_Do_18_Tuan.md`, được ghi là bản xuất từ workbook; không có file `.xlsx`. Không xác minh được format/formula/hidden sheets hoặc ngày lịch cụ thể của W01.
- **Chưa xác nhận khoảng ngày W01 và tên Leader:** tài liệu có mã tuần và vai trò M01 nhưng không có lịch tuần hoặc tên Leader. Ngày 20/11/2026 chỉ là ngày lập báo cáo/kiểm tra.
- **Chưa xác minh tải CSV hoàn tất:** browser automation chờ sự kiện download hết timeout. Đây là giới hạn bằng chứng; không kết luận chức năng export hỏng, cũng không ghi là tải thành công.
- **Chưa có đánh giá accessibility/UX người dùng:** chưa chạy contrast checker, screen reader, keyboard-only test đầy đủ hoặc thử với người dùng. Browser viewport cấu hình 390px cho CSS viewport khác 390px, nên chưa xác nhận layout trên thiết bị thật ở kích thước đó.
- **Prototype vẫn là mock:** API/Prometheus không được xác nhận đã tích hợp; tính đúng của metrics/alert thực tế chưa kiểm tra.

## 6. Rủi ro, đề xuất xử lý

| Rủi ro | Tác động | Đề xuất |
|---|---|---|
| Health score 96.8% không có định nghĩa, trong khi danh sách có host Warning và Offline. | Người xem có thể hiểu nhầm sức khỏe hệ thống hoặc bỏ sót sự cố. | Thống nhất công thức với owner dữ liệu; nếu chưa có thì không trình bày như KPI đã đo. |
| Legend metric và đường chart lấy từ các dữ liệu mô phỏng tách rời; range chỉ thay đổi số điểm/ticks. | Khi trình bày, người xem có thể tưởng biểu đồ là lịch sử đo thật. | Giữ nhãn demo; khi tích hợp API dùng cùng series/time range cho chart, legend và summary. |
| Ngày hiển thị cố định là 19/11/2026. | UI có thể hiển thị timestamp cũ hoặc gây nhầm snapshot. | Thay bằng timestamp dữ liệu có nguồn hoặc đánh dấu rõ ngày demo. |
| Chưa có file Excel gốc và mapping ngày W01. | Không thể xác minh timeline, formula và khoảng báo cáo theo lịch. | Xin Leader cung cấp workbook/lịch chính thức trước khi chốt ngày bắt đầu–kết thúc. |
| Export và accessibility chưa được kiểm chứng. | Evidence nghiệm thu còn thiếu; chưa nên tuyên bố đạt WCAG hoặc export đã test. | Bổ sung kiểm tra có lưu log/screenshot, contrast/keyboard/screen reader ở vòng UI validation. |

## 7. Kế hoạch tuần sau

Theo kế hoạch (không phải công việc đã thực hiện trong báo cáo này), **W02/M04** là xác định người dùng, màn hình và luồng Dashboard. Đề xuất thực hiện sau khi Leader xác nhận:

1. Chốt nhóm người dùng và tác vụ thường gặp cùng M01/M05/M06.
2. Lập danh sách màn hình/luồng điều hướng ở mức phạm vi, ưu tiên Overview → Host/Service/Alert theo yêu cầu đã thống nhất.
3. Xác định thông tin tối thiểu cần có trên từng màn hình và dữ liệu/API phụ thuộc; ghi nhận phần chưa được xác nhận.
4. Đưa các phát hiện prototype (health score, chart data, thời gian, accessibility) thành câu hỏi/acceptance criteria trước khi thay đổi code.

## Ghi chú về trạng thái nguồn và working tree

Thư mục `docs/ai-context` không tồn tại trong repository; các tài liệu đã đọc nằm trong `C:\Users\TAN THUAN\Downloads\InfraWatch_M04_AI_Context`. Khi bắt đầu, working tree có sẵn các file chưa theo dõi `frontend/MetricCard.jsx`, `frontend/package-lock.json`, `package-lock.json`; chúng không thuộc deliverable W01 này và không bị chỉnh sửa. Không tạo commit, push hoặc merge.

