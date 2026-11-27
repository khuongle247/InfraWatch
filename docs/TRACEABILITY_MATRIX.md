# Ma trận Truy vết Yêu cầu (Requirements Traceability Matrix — RTM)

Tài liệu này ánh xạ toàn bộ **86 yêu cầu chức năng (10 module)**, **22 yêu cầu phi chức năng** và **18 tiêu chí nghiệm thu** từ `InfraWatch - SRS.docx` (v1.0) sang các chỉ số KPI (`docs/KPI_DEFINITIONS.md`) và kịch bản kiểm thử (`docs/TEST_CASES.md`).

> **Trạng thái tài liệu (`[Synced with SRS v1.0 | Thresholds Proposed]`):** Đã đồng bộ bộ mã yêu cầu mới của SRS v1.0. Các ngưỡng định lượng mang nhãn `[Proposed]` sẽ được khóa chính thức sau khi hoàn tất đo thực nghiệm và được PM/mentor phê duyệt (tuân thủ `CON-007`).

---

## 1. Ma trận Truy vết Yêu cầu Chức năng (86 FR — 10 Modules)

| Nhóm Module SRS v1.0 | Mã Yêu cầu (`FR`) | Tiêu chí Nghiệm thu (`AC`) | Chỉ số KPI Liên quan (`[Proposed]`) | Mã Test Case (`TEST_CASES.md`) | Mã TC trong SRS v1.0 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A. Environment Management** | `FR-ENV-001` .. `FR-ENV-006` | `AC-002` | `Dashboard Accuracy = 100%` | `TC-ENV-01`, `TC-DATA-01` | `TC-018`, `TC-022` |
| **B. Node Monitoring** | `FR-NODE-001` .. `FR-NODE-011` | `AC-004`, `AC-005`, `AC-017` | `Scrape Success Rate >= 99.5%`<br>`Data Completeness >= 99.0%` | `TC-INFRA-02`, `TC-API-03`, `TC-DATA-01`, `TC-CHAOS-01..03`, `TC-HLT-01` | `TC-001` .. `TC-005`, `TC-019` |
| **C. Cloud Simulation** | `FR-CLOUD-001` .. `FR-CLOUD-008` | `AC-003`, `AC-005` | `Data Completeness >= 99.0%`<br>`Dashboard Accuracy = 100%` | `TC-ENV-01`, `TC-ENV-02` | `TC-006`, `TC-018` |
| **D. Data Center Simulation** | `FR-DC-001` .. `FR-DC-008` | `AC-003`, `AC-005` | `Data Completeness >= 99.0%`<br>`Dashboard Accuracy = 100%` | `TC-ENV-01`, `TC-ENV-02` | `TC-007`, `TC-018` |
| **E. Container Monitoring** | `FR-CON-001` .. `FR-CON-007` | `AC-006` | `Scrape Success Rate >= 99.5%`<br>`Dashboard Accuracy = 100%` | `TC-INFRA-03`, `TC-API-04`, `TC-DATA-02`, `TC-CHAOS-03` | `TC-008` |
| **F. Service Monitoring** | `FR-SVC-001` .. `FR-SVC-006` | `AC-007` | `Scrape Success Rate >= 99.5%`<br>`MTTD < 60s` | `TC-CHAOS-03` *(Blackbox HTTP/TCP probe `probe_success`)* | `TC-009` |
| **G. Overview Dashboard** | `FR-DASH-001` .. `FR-DASH-008` | `AC-001`, `AC-002` | `Dashboard Accuracy = 100%` | `TC-API-02`, `TC-DATA-01..03`, `TC-HLT-03` | `TC-018` |
| **H. Alert Management** | `FR-ALT-001` .. `FR-ALT-014` | `AC-008` .. `AC-012`, `AC-015` | `MTTD < 60s` (`KPI-001`), `Notification Time < 15s` (`KPI-002`), `E2E < 75s` (`KPI-003`), `MTTR < 90s` (`KPI-004`), `Alert Delivery = 100%`, `Precision >= 95%` (`KPI-006`), `Recall = 100%` (`KPI-007`), `FPR <= 5%` (`KPI-008`) | `TC-API-05`, `TC-DATA-03`, `TC-CHAOS-01..05`, `TC-ALT-01`, `TC-ALT-02` | `TC-010` .. `TC-015` |
| **I. Incident Management** | `FR-INC-001` .. `FR-INC-012` | `AC-013` .. `AC-016` | `Recovery Monitoring = 100%` | `TC-INC-01`, `TC-INC-02`, `TC-INC-03` | `TC-016`, `TC-017` |
| **J. Monitoring Health** | `FR-HLT-001` .. `FR-HLT-006` | `AC-017` | `Scrape Success Rate >= 99.5%` | `TC-API-01`, `TC-API-07`, `TC-HLT-01..03` | `TC-019` .. `TC-021` |

---

## 2. Ma trận Truy vết Yêu cầu Phi chức năng & Quy tắc Dữ liệu (`NFR-001..022`, `DR-010`)

| Nhóm NFR / Data Rule | Mã Yêu cầu | Chỉ số KPI & Ngưỡng `[Proposed]` | Mã Test Case (`TEST_CASES.md`) | Ghi chú Đối soát |
| :--- | :--- | :--- | :--- | :--- |
| **Performance** | `NFR-001` .. `NFR-003` | `API Latency (p95) < 300 ms`<br>`Resource Footprint <= 1.5 GB RAM, <= 10% CPU` | `TC-PERF-01`, `TC-PERF-02` | Baseline 27/11: `675.86 MiB` RAM, `1.71%` CPU (idle) |
| **Reliability & Observability** | `NFR-004` .. `NFR-006`, `NFR-021` | `Scrape Success Rate >= 99.5%` (`KPI-009`) | `TC-API-07`, `TC-CHAOS-03`, `TC-HLT-01..03`, `TC-PERF-03` | Phân biệt giá trị `0` với `missing/stale` (`DR-009`) |
| **Security** | `NFR-007` .. `NFR-010` | `Security = 0 vi phạm` | `TC-SEC-01`, `TC-SEC-02`, `TC-API-06` | Không lộ `.env`/token; khóa Grafana `ALLOW_SIGN_UP=false` |
| **Data Integrity & Time** | `NFR-018`, `NFR-019`, `NFR-022`, `DR-010` | `Dashboard Accuracy = 100%` | `TC-DATA-01..03`, `TC-ENV-01`, `TC-INC-02`, `TC-CHAOS-01..03` | Nhất quán metadata DB & PromQL labels; chuẩn UTC (`BR-012`) |
| **Maintainability, Scalability, Portability & Usability** | `NFR-011` .. `NFR-017`, `NFR-020` | `Deployment Reproducibility = 100%` | `TC-INFRA-01..04`, `TC-ENV-01`, `TC-HLT-03` | Khớp `AC-018` & ràng buộc tách rời cấu hình (`NFR-011`) |
