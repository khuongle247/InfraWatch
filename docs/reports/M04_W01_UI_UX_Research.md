# InfraWatch M04 — Báo cáo khảo sát UI/UX Dashboard (W01)

**Người thực hiện:** Phan Tấn Thuận — M04, Frontend Dashboard Engineer  
**Ngày lập:** 20/11/2026  
**Phạm vi:** Khảo sát UI monitoring tham khảo và đánh giá prototype Overview hiện có. Không sửa source code, Backend, Infrastructure hoặc phần việc thành viên khác.

## 1. Tóm tắt

Prototype Overview hiện có là một concept có chất lượng trình bày tốt: cấu trúc điều hướng, chỉ số, biểu đồ xu hướng, phân bố trạng thái, bảng host và hoạt động cảnh báo đã được thể hiện trong một màn hình; các số liệu được đánh dấu là mô phỏng. Build production và kiểm tra một số thao tác trên trình duyệt đều thành công.

Đối chiếu với tài liệu chính thức của Grafana, Datadog và Elastic, đề xuất định hướng cho InfraWatch là giữ Overview gọn và hướng vận hành: ưu tiên nhận biết host/service lỗi và cảnh báo cần xử lý; giữ cùng ngữ cảnh thời gian và bộ lọc; dùng drill-down theo host/service thay vì nhồi mọi loại phân tích vào Overview. Không sao chép toàn bộ chức năng sản phẩm thương mại: Core MVP của InfraWatch tập trung Linux VM, Docker, metrics và alert.

Prototype hiện chưa phải dữ liệu giám sát thật. Một số con số và cách trình bày chưa có nguồn/công thức thống nhất, do đó chưa được xem là chính xác nghiệp vụ hoặc đạt chuẩn accessibility. Các điểm này cần được giải quyết trước khi tích hợp API hoặc dùng trong demo có tuyên bố vận hành.

## 2. Căn cứ và giới hạn khảo sát

### Tài liệu nhóm và phạm vi

- Kế hoạch 18 tuần xác định W01/M04 là “Khảo sát dashboard monitoring và UI tham khảo”; W02 mới xác định người dùng, màn hình và luồng Dashboard. Vì vậy báo cáo này không thiết kế các màn hình Host, Container, Service, Alert như các deliverable đã hoàn thành.
- Project Plan mô tả Overview gồm tổng host, host hoạt động/mất kết nối, service, cảnh báo và tài nguyên; đồng thời phân biệt Dashboard Web (giao diện chính, thông tin nghiệp vụ) với Grafana (truy vấn/phân tích kỹ thuật).
- Vai trò người dùng trong tài liệu dự án gồm DevOps/SysAdmin/SRE, Developer và Team Lead/IT Manager. Bối cảnh Core MVP là Linux VM + Docker Lab; các tính năng mở rộng không được tự đưa vào cam kết.
- Nguồn nhóm đã đọc: `00_START_HERE.md`, `01_Project_Plan_v2.md`, `02_Phan_Cong_Tien_Do.md`, `03_Tien_Do_18_Tuan.md`, `04_PROMPT_DAN_VAO_VSCODE.txt` và sơ đồ kiến trúc được cung cấp; kiểm tra thêm README, Requirements, KPI Definitions, project overview, monitoring data flow và contributing trong repo.

### Giới hạn nguồn kế hoạch

Repo không có `docs/ai-context`; các tài liệu AI-context được cung cấp trong `Downloads/InfraWatch_M04_AI_Context`. Thư mục này có 5 tài liệu văn bản và ảnh kiến trúc, không có workbook Excel gốc. `03_Tien_Do_18_Tuan.md` xác nhận là bản xuất từ `InfraWatch_PhanCong_TienDo_18Tuan.xlsx`, đồng thời cảnh báo tracker là mẫu trống. Báo cáo dựa trên nội dung bản xuất Markdown; không xác minh được định dạng, công thức, ẩn sheet hay nội dung nào chỉ tồn tại trong workbook.

Không có danh tính Leader cụ thể hoặc ngày lịch bắt đầu/kết thúc của W01 trong các tài liệu đã cung cấp. W01 được dùng như mã tuần kế hoạch; 20/11/2026 là ngày lập báo cáo và ngày kiểm tra hiện trạng, không suy diễn thành khoảng ngày của cả tuần.

### Nguồn tham khảo công khai

Các nguồn sau là tài liệu chính thức của nhà cung cấp hoặc W3C. So sánh dưới đây là tổng hợp từ mô tả/chức năng trong tài liệu, không phải kiểm thử usability độc lập hay benchmark đầy đủ mọi phiên bản sản phẩm.

1. Grafana, [Dashboards](https://grafana.com/docs/grafana/latest/visualizations/dashboards/): dashboard gồm các panel theo hàng/tab, lấy dữ liệu từ data source; phù hợp để đối chiếu cách nhóm biểu đồ/phân tích có liên hệ.
2. Grafana, [Variables](https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/): biến như server, application hoặc interval có thể tái sử dụng để điều khiển nhiều panel. Gợi ý quan trọng là bộ lọc/time context nên nhất quán thay vì độc lập từng biểu đồ.
3. Datadog, [Dashboards](https://docs.datadoghq.com/dashboards/): mô tả dashboard dạng grid cho status board/debugging và timeboard dạng tự động cho troubleshooting, correlation, exploration; tài liệu cũng nêu widget, refresh theo time frame và trải nghiệm xem mobile.
4. Elastic, [Observability solution overview](https://www.elastic.co/docs/solutions/observability): mô tả điều tra thống nhất metrics, logs, traces, infrastructure và incident management. Đây là tham chiếu về mối liên hệ vận hành; InfraWatch chưa có Logs/Traces trong Core MVP.
5. W3C, [WCAG 2.2 — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): tỉ lệ tương phản tối thiểu 4.5:1 cho văn bản thường, 3:1 cho văn bản lớn theo điều kiện của tiêu chí.
6. W3C, [WCAG 2.2 — Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) và [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html): chức năng cần thao tác được bằng bàn phím và trạng thái focus cần nhìn thấy.

## 3. So sánh tham khảo và áp dụng cho InfraWatch

| Tham khảo | Mô hình/năng lực được tài liệu mô tả | Bài học UI áp dụng cho InfraWatch | Không nên suy diễn |
|---|---|---|---|
| Grafana | Panel, rows/tabs; query từ data source; variables điều khiển server, datasource hoặc time interval và cập nhật các phần liên quan. | Giữ nhóm biểu đồ có quan hệ trong một vùng phân tích; nếu bổ sung bộ lọc host/time về sau, đồng bộ bộ lọc trên các phần phụ thuộc; tách “xem nhanh” khỏi truy vấn chuyên sâu. | InfraWatch Web không cần trở thành Grafana clone; truy vấn PromQL chuyên sâu thuộc vai trò Grafana theo Project Plan. |
| Datadog | Grid dashboard có widget tự bố trí; timeboard dùng cho tương quan/khám phá; hỗ trợ refresh theo time frame và xem dashboard trên mobile. | Dùng thứ bậc và nhóm thông tin rõ; chọn cách bố trí theo tác vụ; thể hiện rõ time range, trạng thái cập nhật và nhãn mô phỏng; kiểm tra layout ở màn hình hẹp. | Không lấy lịch refresh của Datadog làm yêu cầu hay cam kết hiệu năng cho InfraWatch. |
| Elastic Observability | Hợp nhất metrics, logs, traces, hạ tầng và incident để hỗ trợ điều tra. | Thiết kế đường đi từ dấu hiệu → đối tượng (host/service) → sự kiện/cảnh báo; giữ liên kết ngữ cảnh để người vận hành tiếp tục điều tra. | Không mở rộng W01/Core MVP sang logs, traces, APM hoặc AI; những phần này ngoài phạm vi đã chốt trong Project Plan. |
| WCAG 2.2 (W3C) | Ngưỡng tương phản chữ, thao tác bằng keyboard, focus nhìn thấy. | Kiểm tra contrast thực đo cho nhãn nhỏ/trạng thái; bảo đảm focus và thao tác menu/bộ lọc/tìm kiếm bằng bàn phím; không chỉ truyền đạt trạng thái bằng màu. | Có CSS `:focus-visible` hoặc `aria-label` riêng lẻ không đủ để kết luận giao diện đạt WCAG. |

### Nguyên tắc UI đề xuất

1. **Ưu tiên nhận biết sự cố:** trạng thái offline/firing và hành động cần chú ý nên dễ nhận biết trước các phần trang trí. KPI/biểu đồ hỗ trợ quyết định, không thay thế danh sách lỗi.
2. **Ngữ cảnh rõ:** thời gian, phạm vi host/service, nguồn dữ liệu, thời điểm cập nhật và đơn vị phải được diễn đạt nhất quán. Khi refresh là mô phỏng, không dùng copy tạo cảm giác backend đã cập nhật thật.
3. **Tổng quan dẫn tới điều tra:** Overview làm nhiệm vụ tổng hợp và điều hướng; màn hình chi tiết theo host/container/service/alert được làm theo kế hoạch từng tuần sau.
4. **Dữ liệu trung thực:** giá trị tổng hợp phải có định nghĩa và nguồn; nếu chỉ là mock thì gắn nhãn DEMO/Simulated sát chỗ hiển thị, tránh từ “Live” gây hiểu nhầm.
5. **Responsive và accessible:** thiết kế lại thứ bậc trên viewport hẹp, không chỉ thu nhỏ desktop; hỗ trợ keyboard/focus, contrast, tên accessible và trạng thái văn bản bổ sung cho biểu đồ.

## 4. Đánh giá prototype Overview hiện có

### Phạm vi và dấu vết kiểm tra

- Nhánh hiện tại là `feat/phan-tan-thuan-frontend`, HEAD trùng `origin/feat/phan-tan-thuan-frontend` tại commit `aa634fe` (`feat(frontend): demo overview dashboard`). `main` không được checkout hoặc sửa.
- Bố cục và dữ liệu được đọc tại `frontend/src/pages/Overview.jsx`; CSS responsive tại `frontend/src/styles/overview.css`; root app tại `frontend/src/App.jsx`.
- Chạy `npm --prefix frontend run build`: thành công với Vite 5.4.21; 32 modules transformed; tạo bundle production.
- Mở Vite local trên trình duyệt: tiêu đề/trang Overview hiển thị; snapshot xác nhận nhãn PREVIEW/MOCK DATA, các metric, chart, bảng host và event feed.
- Thao tác trình duyệt: tìm `lab-edge` lọc còn một host; chọn `24H` đặt `aria-pressed=true`; nút “Làm mới” thông báo rõ dữ liệu mô phỏng; tìm chuỗi không tồn tại hiển thị empty state; menu mobile mở/đóng được.
- Không có test automation/audit WCAG trong repo. Lệnh chờ sự kiện tải CSV trong browser automation hết thời gian chờ; vì vậy **chưa xác minh tải file CSV hoàn tất**. Cấu hình viewport 390 của browser tool cho CSS viewport thực tế khác 390; không coi đây là kiểm tra thiết bị di động chính xác. Không có kiểm thử người dùng, screen reader, keyboard-only đầy đủ hay đo tương phản.

### Điểm làm tốt

- **Phủ đúng mục đích Overview:** metric cards, biểu đồ CPU/Memory, phân bố host, bảng host và hoạt động/cảnh báo gần đây; phù hợp cấu phần dự kiến trong Project Plan.
- **Visual hierarchy và độ hoàn thiện:** sidebar/topbar, nhóm panel, khoảng trắng, typography, màu accent và nhãn trạng thái tạo cảm giác sản phẩm SaaS thống nhất; CSS có breakpoint ở 1400/1180/790/520px và `prefers-reduced-motion`.
- **Tính tương tác có ích:** lọc host theo nhiều trường, chọn 1H/6H/24H, điều hướng tới khối trên trang, xem cảnh báo mô phỏng, refresh-state và empty state. Search/time range/refresh/empty state đã được xác nhận trên trình duyệt.
- **Minh bạch mock ở nhiều vị trí:** `MOCK DATA`, `PREVIEW BUILD`, `SIMULATION DATA`, `Simulated`, thông báo refresh chưa kết nối API. Host dùng các dải địa chỉ tài liệu RFC 5737 và bảng ghi “Sample IPs · RFC 5737”.
- **Nền accessibility ban đầu:** heading có cấp bậc, bảng HTML có header, input có accessible label, icon trang trí ẩn với assistive technology ở component Icon, một số nút có tên accessible, time selector dùng `aria-pressed`, chuông có `aria-expanded`; CSS có `:focus-visible`.

### Phát hiện cần xử lý trước khi dùng dữ liệu thật

| Mức | Phát hiện kiểm chứng được | Tác động | Đề xuất |
|---|---|---|---|
| Cao | Hero hiển thị `96.8% / Stable` nhưng không thấy định nghĩa/công thức health score; cùng trang lại có 3 healthy, 1 warning, 1 offline trên tổng 5 host. | Người vận hành có thể hiểu “Stable” là trạng thái tính từ các host dù chưa có bằng chứng về cách tính; trạng thái offline cần được ưu tiên rõ. | Trước tích hợp API, hoặc bỏ điểm số không có định nghĩa, hoặc định nghĩa và kiểm thử công thức; không để nhãn tổng hợp che khuất cảnh báo/offline. |
| Cao | Giá trị CPU/Memory trong legend được đặt cố định 42.8%/67.4%; `TrendChart` sinh series bằng công thức mô phỏng riêng. Chọn time range đổi số điểm và tick nhãn nhưng không chọn chuỗi dữ liệu theo một cửa sổ thời gian thực. | Tooltip/legend và đường biểu đồ có thể bị hiểu là cùng bộ số liệu lịch sử; không thể dùng xác minh độ chính xác dashboard. | Khi dùng API, cùng một query/response phải cấp số cuối, series, timestamp, đơn vị và range; hiện diện nhãn DEMO ở cả legend và chart. |
| Trung bình | Ngày trong header cố định “19 tháng 11, 2026” trong khi ngày lập báo cáo/kiểm tra là 20/11/2026. | Ngày cứng dễ lỗi thời và gây nhầm ngày snapshot. | Dùng thời điểm dữ liệu do API cung cấp, hoặc đồng hồ có timezone/format rõ; trong mock ghi đây là ngày dữ liệu mẫu hoặc bỏ date cứng. |
| Trung bình | Health score chưa có công thức; giá trị delta metric hiển thị dấu tăng/giảm, nhưng cách phân loại tích cực phụ thuộc dấu âm chung (`startsWith('−')`), không theo ngữ nghĩa tốt/xấu của từng metric. | Tăng disk/CPU có thể mang ý nghĩa rủi ro, còn giảm có thể tốt; màu không đủ để diễn giải mức độ. | Xác định semantics per metric, baseline và kỳ so sánh; bổ sung chữ/aria status thay vì dựa vào màu. |
| Trung bình | Dashboard đặt hero lớn trước vùng metric và feed; trạng thái offline/cảnh báo chi tiết chỉ xuất hiện sâu hơn ở trang. | Với người vận hành theo tác vụ, cần cuộn trước khi thấy danh sách host cần ưu tiên; phần marketing-like hero chiếm ưu tiên của viewport đầu. | Giữ concept visual nhưng cân nhắc đưa critical/offline/active alert lên vùng tóm tắt đầu trang sau khi hiểu luồng người dùng W02. |
| Thấp / cần xác minh | Chữ phụ nhỏ, một số màu trung tính mờ; chưa đo ratio màu thực tế. Biểu đồ có accessible name tổng quát nhưng chưa có bảng/tóm tắt textual của giá trị series. | Chưa đủ cơ sở tuyên bố đạt WCAG; người dùng screen reader có thể không nhận được số liệu chính xác của biểu đồ. | Đo contrast với màu thực tế; kiểm tra keyboard và screen reader; cung cấp text/data alternative cho biểu đồ. |
| Thấp / cần xác minh | Menu cảnh báo có trạng thái `aria-expanded`, nhưng chưa kiểm tra Escape, click-outside, focus restore; menu điều hướng mobile không có trạng thái `aria-expanded` trên nút mở. | Trạng thái tương tác có thể chưa đủ dễ đoán cho keyboard/assistive tech. | Kiểm tra vòng đời focus/menu và keyboard; bổ sung state semantics nếu cần trong task UI phù hợp. |

**Ghi chú maintainability:** `Overview.jsx` đang chứa dữ liệu demo, icon, chart, sidebar, metric card và toàn trang; CSS là các rule dài/ghép selector trong một file. Chấp nhận được cho prototype W01/W09 nhưng nên tách component khi bắt đầu xây skeleton/component map (W03–W06). Báo cáo này không sửa code hoặc thay đổi scope.

## 5. Kết luận và hành động đề xuất

**Kết luận W01/M04:** khảo sát UI tham khảo, đánh giá prototype và ghi nhận minh chứng đã thực hiện trong phạm vi cá nhân. Prototype phù hợp làm concept Overview/demo, chưa đủ căn cứ để gọi là dashboard giám sát thời gian thực, chưa tích hợp API và chưa được đánh giá accessibility đầy đủ.

### Việc tiếp theo (chưa thực hiện trong báo cáo W01)

1. **W02:** xác nhận personas, tác vụ ưu tiên, màn hình và luồng điều tra với nhóm/Leader; đặc biệt thứ tự ưu tiên alert/offline so với KPI.
2. Khi có luồng và API contract: thống nhất nguồn cho time range, refresh, metric card, chart, host status và alert event; xác định định nghĩa health score hoặc loại bỏ.
3. Trước khi coi UI sẵn sàng: kiểm tra viewport thực trên desktop/tablet/mobile, keyboard & focus, contrast và nội dung biểu đồ bằng assistive technology; lưu evidence.
4. Chạy kiểm tra tải CSV và xác nhận quy trình export sau khi giải quyết được giới hạn browser automation.

## 6. Liên kết minh chứng trong repo

- [Overview.jsx](../../frontend/src/pages/Overview.jsx)
- [overview.css](../../frontend/src/styles/overview.css)
- [App.jsx](../../frontend/src/App.jsx)
- [frontend package.json](../../frontend/package.json)
- [REQUIREMENTS.md](../REQUIREMENTS.md)
- [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md)
- [monitoring-data-flow.md](../architecture/monitoring-data-flow.md)
- [KPI_DEFINITIONS.md](../KPI_DEFINITIONS.md)
- Commit prototype hiện có: `aa634fe86fe2c6c0c4de720419b3e1b275d76a7c` (không phải commit của báo cáo này).

