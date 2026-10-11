# SaaS API Platform Frontend (Developer Portal & Admin Dashboard)

Cổng thông tin quản trị và giao diện nhà phát triển (Developer & Admin Web Portal) phục vụ hệ sinh thái **SaaS API Platform**.

---

## 1. Công nghệ sử dụng
- **Framework**: Angular 18 (Standalone Components, Signals, Control Flow `@if/@for`, Reactive Forms)
- **UI & Styling**: Tailwind CSS, SCSS, Lucide Icons, Responsive Dark/Light UI
- **Routing & Guards**: Angular Router với `AuthGuard` bảo vệ phân quyền Admin & Developer
- **Web Server (Docker Runtime)**: Nginx Alpine (Multi-stage build tối ưu kích thước ~25MB)

---

## 2. Cấu trúc thư mục

```text
saas-api-platform-frontend/
├── src/
│   ├── app/
│   │   ├── core/               # Guards, Interceptors (JWT, Correlation ID), Services (Auth, Products, Invoices, Webhooks, v.v.)
│   │   ├── layouts/            # MainLayout (Sidebar + Header), AuthLayout
│   │   └── pages/              # Phân hệ Developer Portal & Admin Dashboard
│   │       ├── admin/          # Admin Dashboard, Users, Products, Coupons, Audit Logs
│   │       ├── auth/           # Login, Register
│   │       └── developer/      # Dashboard, API Products, Subscriptions, Invoices, Webhooks, Playground
│   ├── environments/           # Cấu hình môi trường đa profile
│   │   ├── environment.ts            # Local Dev (http://localhost:3000/api/v1)
│   │   ├── environment.testing.ts    # Staging/Testing
│   │   └── environment.production.ts # Production
│   └── styles.scss
├── docker/
│   ├── nginx.conf              # Nginx cơ bản cho Local Dev
│   ├── nginx.testing.conf      # Nginx Testing (Gzip, Cache)
│   └── nginx.production.conf   # Nginx Production (Gzip, HTTP Security Headers, Cache)
├── Dockerfile                  # Dockerfile đa môi trường
├── Dockerfile.Testing          # Dockerfile build Testing
├── Dockerfile.Production       # Dockerfile build Production
├── Dockerfile.CI               # Dockerfile dựng môi trường CI
├── docker-compose.yml          # Chạy Docker độc lập
└── .gitlab-ci.yml              # Pipeline tự động hóa CI/CD
```

---

## 3. Cấu hình môi trường (`src/environments/`)

| File | Môi trường | `apiBaseUrl` Mặc định | Ghi chú |
| :--- | :--- | :--- | :--- |
| `environment.ts` | Local Development | `http://localhost:3000/api/v1` | Dùng khi chạy `npm start` |
| `environment.testing.ts` | Testing / Staging | `https://saas-api-testing.example.com/api/v1` | Tự động thay thế khi build `--configuration=testing` |
| `environment.production.ts` | Production | `https://saas-api.example.com/api/v1` | Tự động thay thế khi build `--configuration=production` |

---

## 4. Hướng dẫn chạy Local (Development)

### Yêu cầu:
- Node.js `>= 20.x`
- npm `>= 10.x`

### Cài đặt và khởi chạy:
```bash
# 1. Cài đặt thư viện
npm ci

# 2. Khởi chạy dev server (Port 4200)
npm start
```
Truy cập tại: `http://localhost:4200`

### Biên dịch mã nguồn:
```bash
# Build chế độ Production
npm run build
```

---

## 5. Đóng gói & Chạy bằng Docker

```bash
# Build và chạy container bằng Docker Compose
docker compose up -d --build

# Xem log container
docker compose logs -f
```
Truy cập cổng: `http://localhost:4200`
