# Infrastructure Docker Modules

Thư mục này chứa các file cấu hình Docker mở rộng và Dockerfile phục vụ cho việc build và đóng gói môi trường vận hành của InfraWatch.

## Thành phần:
- `Dockerfile.dashboard`: Dockerfile đa tầng (multi-stage build) để build ứng dụng React (Vite) và phục vụ thông qua Nginx web server trên môi trường container.

