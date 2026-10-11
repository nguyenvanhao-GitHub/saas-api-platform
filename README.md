# 🚀 SaaS API Platform - Developer Marketplace & Metered Billing Platform

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 3.3.5" />
  <img src="https://img.shields.io/badge/Angular-18.0-DD0031?logo=angular&logoColor=white" alt="Angular 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16%20Alpine-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Redis-7%20Alpine-DC382D?logo=redis&logoColor=white" alt="Redis 7" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Docker-Multi--Stage-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/VietQR-Dynamic%20Banking-8A2BE2" alt="VietQR" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

---

## 📖 1. Giới Thiệu (Overview)

**SaaS API Platform** là giải pháp nền tảng API toàn diện chuẩn doanh nghiệp cho phép các tổ chức và lập trình viên đóng gói, thương mại hóa, giám sát và tự động hóa thanh toán các dịch vụ API theo hai mô hình:
1. **Đo đếm lưu lượng sử dụng thực tế (Metered Billing & Telemetry)**.
2. **Gói cước định kỳ linh hoạt (Subscription Tiers: Free, Starter, Pro, Enterprise)**.

Hệ thống bao gồm trọn bộ:
* **Backend**: Xây dựng trên **Java 17 & Spring Boot 3.3.5**, Spring Data JPA, Flyway Migration, PostgreSQL 16, Redis 7 (Token Bucket Rate Limiting), AWS S3/MinIO và Mailpit.
* **Frontend**: Cổng thông tin nhà phát triển (Developer Portal) & Bảng điều khiển quản trị (Admin Dashboard) trên **Angular 18 & Tailwind CSS**.

---

## ✨ 2. Tính Năng Nổi Bật (Key Features)

### 🛡️ API Gateway & Bảo Mật
- **Quản lý API Key**: Cấp phát, thu hồi và xoay vòng khóa (`sk_live_...`) định danh cho từng đối tác / nhà phát triển.
- **Rate Limiting**: Thuật toán Redis Token Bucket (60 req/phút hoặc tùy biến theo gói cước).
- **Tường lửa & WAF**: Quản lý IP Blacklist/Whitelist, phát hiện và chặn các truy cập bất thường.
- **HMAC-SHA256 Webhook**: Ký số và gửi thông báo biến động tức thì đến hệ thống của đối tác.

### 📊 Metered Billing & Thanh Toán
- **Telemetry Metering**: Đo đếm chính xác từng request thời gian thực trên Redis, ghi log bất đồng bộ chống nghẽn cơ sở dữ liệu.
- **Tự động xuất hóa đơn**: Scheduler định kỳ ngày 1 hàng tháng tính toán overage, tự sinh file PDF hóa đơn và lưu trữ lên S3/MinIO.
- **Cổng thanh toán VietQR động**: Tự động sinh mã QR ngân hàng chuẩn NAPAS (Vietcombank, MBBank...) kèm nội dung chuyển khoản để tự động gạch nợ 24/7.
- **Hệ thống Mã giảm giá (Coupons)**: Quản lý voucher, chiết khấu phần trăm hoặc số tiền cố định.

### 💻 Developer Portal & Admin Dashboard
- **Developer Portal**: Xem tài liệu API, lấy API Key, theo dõi biểu đồ tiêu thụ realtime, tra cứu hóa đơn, Webhook playground.
- **Admin Dashboard**: Quản trị người dùng, danh mục API Products, xem Audit Logs an ninh, theo dõi doanh thu và trạng thái hệ thống.

### 🌐 10 API Thương Mại Mẫu Tích Hợp Sẵn
| STT | Nhóm Dịch Vụ | Tên Dịch Vụ | Endpoint |
| :-: | :--- | :--- | :--- |
| 1 | 🏢 Doanh Nghiệp | Tra Cứu Mã Số Thuế | `/api/v1/business/tax-lookup` |
| 2 | 🏢 Doanh Nghiệp | Tra Cứu Mã BIN & Ngân Hàng | `/api/v1/business/bank-bin-lookup` |
| 3 | 🤖 Trí Tuệ AI | AI Tạo Nội Dung Marketing | `/api/v1/ai/generate-content` |
| 4 | 🤖 Trí Tuệ AI | AI Phân Tích Cảm Xúc | `/api/v1/ai/sentiment-analysis` |
| 5 | 🤖 Trí Tuệ AI | AI OCR Quét Thẻ CCCD | `/api/v1/ai/ocr-id-card` |
| 6 | 📈 Tài Chính | Tỷ Giá Ngoại Tệ & Giá Vàng SJC | `/api/v1/finance/exchange-rates` |
| 7 | 📈 Tài Chính | Giá Tiền Số (Crypto Realtime) | `/api/v1/finance/crypto-price` |
| 8 | 🚗 Giao Thông | Tra Cứu Phạt Nguội Phương Tiện | `/api/v1/traffic/traffic-fine-lookup` |
| 9 | 🚗 Địa Lý | Đơn Vị Hành Chính 63 Tỉnh Thành | `/api/v1/geo/vietnam-provinces` |
| 10 | 📲 Viễn Thông | Gửi Tin Nhắn SMS OTP / Brandname | `/api/v1/telecom/sms-otp-send` |

---

## 🏗️ 3. Cấu Trúc Dự Án (Repository Structure)

```text
saas-api-platform/
├── saas-api-platform-backend/       # Phân hệ Backend API (Java 17, Spring Boot 3.3.5, Maven)
│   ├── src/main/java/               # Mã nguồn Java (Controllers, Services, Repositories, Entities)
│   ├── src/main/resources/          # application.yml, Flyway migrations (db/migration), templates
│   ├── pom.xml                      # Cấu hình Maven Dependencies & Plugins
│   └── docker-compose.yml           # Compose chạy Postgres + Redis + Mailpit
│
├── saas-api-platform-frontend/      # Phân hệ Web (Angular 18 + Tailwind CSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                # JWT Auth, HTTP Interceptors, Services
│   │   │   ├── layouts/             # Sidebar, Header, Auth layouts
│   │   │   └── pages/               # Phân hệ Developer Portal & Admin Dashboard
│   │   └── environments/            # Cấu hình đa môi trường (Dev, Testing, Prod)
│   ├── docker/                      # Nginx configs tối ưu hiệu năng và bảo mật
│   ├── Dockerfile                   # Nginx Multi-stage build
│   └── docker-compose.yml           # Chạy frontend độc lập qua Docker
│
├── .gitignore                       # Cấu hình loại trừ file rác, dependencies và bí mật
└── README.md                        # Tài liệu hướng dẫn dự án tổng quan
```

---

## ⚡ 4. Hướng Dẫn Cài Đặt & Chạy Dự Án (Getting Started)

### Yêu cầu tiên quyết:
- **Java Development Kit (JDK)**: `>= 17`
- **Maven**: `>= 3.8` (hoặc sử dụng Maven Wrapper)
- **Node.js**: `>= 20.x` & **npm**: `>= 10.x`
- **Docker & Docker Compose** (để chạy PostgreSQL, Redis, Mailpit)

---

### 🔹 1. Khởi chạy Backend (`Java Spring Boot 3.3.5`):

```powershell
cd saas-api-platform-backend

# 1. Khởi chạy PostgreSQL, Redis và Mailpit nền bằng Docker
docker-compose up -d postgres redis mailpit

# 2. Biên dịch và khởi chạy ứng dụng Spring Boot
mvn spring-boot:run
```
* Backend chạy tại: `http://localhost:3000` (hoặc `http://localhost:8080` theo cấu hình)
* Swagger / OpenAPI UI: `http://localhost:3000/docs` hoặc `http://localhost:3000/swagger-ui.html`
* Mailpit (Xem email gửi ra): `http://localhost:8025`

---

### 🔹 2. Khởi chạy Frontend (`Angular 18`):

```powershell
cd ../saas-api-platform-frontend

# 1. Cài đặt thư viện phụ thuộc
npm install

# 2. Khởi chạy Development Server
npm start
```
* Frontend chạy tại: `http://localhost:4200`

---

## 🔑 5. Tài Khoản & Thông Tin Mẫu (Demo Credentials)

| Thông Tin | Giá Trị |
| :--- | :--- |
| **Tài Khoản Developer Demo** | `dev@saas-platform.com` |
| **Mật Khẩu Mẫu** | `Dev@123456` |
| **Default API Key** | `sk_live_developer_test_key_888` |
| **Swagger API Docs** | [http://localhost:3000/docs](http://localhost:3000/docs) |
| **Health Check** | [http://localhost:3000/health](http://localhost:3000/health) |

---

## 📄 6. Giấy Phép (License)

Dự án phát hành theo giấy phép [MIT License](LICENSE).
