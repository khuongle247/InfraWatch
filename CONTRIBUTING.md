# Quy chuẩn Đóng góp Mã nguồn — InfraWatch (N4.7)

Tài liệu này quy định các nguyên tắc cộng tác mã nguồn dành cho tất cả thành viên trong nhóm dự án InfraWatch. Mọi thành viên bắt buộc phải tuân thủ để đảm bảo tính toàn vẹn của mã nguồn và tính chuyên nghiệp trong quản trị phiên bản.

---

## 1. Quy tắc Phân nhánh (Branching Strategy)

Dự án áp dụng mô hình biến thể từ **GitFlow / GitHub Flow**:
- **Nhánh `main`:** Chứa mã nguồn ổn định, đã qua kiểm thử và được phê duyệt.
  - **TUYỆT ĐỐI KHÔNG commit hoặc push trực tiếp vào `main`.**
  - Nhánh `main` được bảo vệ (Branch Protection), chỉ có thể cập nhật thông qua Pull Request (PR).
- **Nhánh tính năng / công việc (Feature / Task branches):**
  - Mỗi thành viên tạo nhánh riêng bắt đầu từ `main` mới nhất:
    ```bash
    git checkout main
    git pull origin main
    git checkout -b <type>/<short-description>
    ```
  - Định dạng đặt tên nhánh:
    - `feat/dashboard-overview`
    - `feat/prometheus-query-service`
    - `fix/alertmanager-telegram-template`
    - `docs/update-architecture`
    - `infra/cadvisor-docker-compose`
    - `test/chaos-cpu-script`

---

## 2. Quy tắc Commit Message (Conventional Commits)

Mọi commit message phải viết theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <mô tả ngắn gọn bằng thể mệnh lệnh>

[Mô tả chi tiết tùy chọn: nguyên nhân, giải pháp, lưu ý]

[Footer: Closes #issue-id nếu có]
```

### Các tiền tố `<type>` được chấp nhận:
- `feat`: Tính năng mới cho người dùng hoặc hệ thống.
- `fix`: Sửa lỗi (bug fix).
- `docs`: Thêm hoặc cập nhật tài liệu kỹ thuật.
- `style`: Thay đổi định dạng mã, whitespace, không ảnh hưởng logic.
- `refactor`: Tái cấu trúc mã nguồn, không thêm tính năng mới và không sửa bug.
- `perf`: Tối ưu hóa hiệu năng hệ thống hoặc truy vấn.
- `test`: Thêm hoặc sửa đổi các bộ kiểm thử.
- `chore`: Công việc bảo trì phụ thuộc, cấu hình build, cấu hình git.
- `infra`: Thay đổi hạ tầng Docker, Prometheus, Grafana, Alertmanager.

### Ví dụ chuẩn:
```text
feat(backend): add prometheus client health check endpoint
infra(grafana): provision default prometheus datasource
docs(api): define metrics query request contract
fix(scripts): resolve path syntax error in health-check.sh
```

---

## 3. Quy trình Tạo và Đánh giá Pull Request (PR)

### Khi chuẩn bị tạo PR:
1. Đảm bảo mã nguồn chạy ổn định ở môi trường cục bộ:
   - Backend pass linter và tests (nếu có).
   - Frontend build thành công (`npm run build`).
   - Docker Compose khởi chạy không bị lỗi container nào.
2. Kiểm tra kỹ không có secrets/token trong mã nguồn (`git diff`).
3. Đồng bộ nhánh hiện tại với `main` mới nhất:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### Tiêu chuẩn nội dung PR:
- **Tiêu đề PR:** Theo cú pháp Conventional Commit (ví dụ: `feat(infra): add prometheus scrape config for cadvisor`).
- **Nội dung PR:** Phải trình bày đủ các phần:
  1. **Mục đích:** Lý do và bối cảnh thay đổi.
  2. **Các thay đổi chính:** Danh sách file hoặc tính năng được thêm/sửa.
  3. **Bằng chứng kiểm thử (Evidence):** Ảnh chụp màn hình, log đầu ra hoặc kết quả test.
  4. **Tác động phụ:** Những thành phần khác có thể bị ảnh hưởng.

### Quy tắc Review & Merge:
- **Tối thiểu 1 thành viên hoặc Team Leader review và phê duyệt (Approve)** trước khi merge.
- Không tự ý merge PR của chính mình khi chưa có phê duyệt.
- Áp dụng phương thức **Squash and Merge** hoặc **Rebase and Merge** để giữ git log sạch sẽ.

---

## 4. An toàn thông tin và Quản lý Secrets

- Tuyệt đối không commit file `.env`, khóa SSH, Telegram Bot Token, mật khẩu cơ sở dữ liệu hoặc Grafana.
- Mọi biến nhạy cảm phải được khai báo trong `.env.example` dưới dạng placeholder.
- Nếu lỡ commit secret, phải báo ngay cho Team Leader để thu hồi (revoke) credential và xử lý lịch sử git (git filter-repo/BFG).

---

## 5. Phân công vai trò trong nhóm (Team Roles)
- **DevOps / Infra Lead:** Quản lý Docker Compose, Prometheus, Alertmanager, Grafana, Scrape configs.
- **Backend Engineer:** Quản lý FastAPI app, API Gateway, Prometheus integration, Service logic.
- **Frontend Engineer:** Quản lý React Web Dashboard, UI/UX components, Real-time charts.
- **QA & Automation Engineer:** Quản lý test suites, chaos scripts, benchmark dataset, nghiệm thu.
