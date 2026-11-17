# InfraWatch Frontend — Operations Web Dashboard

Web Dashboard xây dựng bằng **React 18 + Vite**, là giao diện trực quan trung tâm dành cho các kỹ sư DevOps / SRE để theo dõi trạng thái hệ thống, tài nguyên máy chủ, container và các cảnh báo hạ tầng.

## 1. Cấu trúc thư mục

```text
frontend/
├── public/              # Static assets công khai
├── src/
│   ├── assets/          # Hình ảnh, biểu tượng cục bộ
│   ├── components/      # UI components tái sử dụng (Card, Badge, Button, Modal)
│   ├── layouts/         # Layout khung (Header, Sidebar, Main Layout)
│   ├── pages/           # Các trang giao diện chính (Overview, Hosts, Containers, Alerts)
│   ├── services/        # Tầng gọi API Backend (Axios/Fetch client)
│   ├── hooks/           # Custom React hooks (usePolling, useMetrics)
│   ├── utils/           # Định dạng thời gian, dung lượng (bytes to GB), formatters
│   ├── styles/          # File CSS toàn cục
│   ├── App.jsx          # Root Component của ứng dụng
│   └── main.jsx         # Điểm khởi tạo ứng dụng React
├── index.html           # File HTML gốc
├── vite.config.js       # Cấu hình Vite bundler
├── package.json         # Danh sách thư viện và scripts npm
└── .env.example         # Biến môi trường mẫu
```

## 2. Hướng dẫn chạy cục bộ (Development)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt thư viện dependencies
npm install

# Khởi chạy Vite dev server (mặc định tại http://localhost:5173 hoặc 3000)
npm run dev

# Kiểm tra build cho production
npm run build
```

