# 🚀 SaaS API Platform - Developer Marketplace & Metered Billing Backend

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 3.3.5" />
  <img src="https://img.shields.io/badge/Spring%20Data%20JPA-3.3-6DB33F" alt="Spring Data JPA" />
  <img src="https://img.shields.io/badge/Flyway-10.x-CC0200?logo=flyway&logoColor=white" alt="Flyway" />
  <img src="https://img.shields.io/badge/PostgreSQL-16%20Alpine-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Redis-7%20Alpine%20Token%20Bucket-DC382D?logo=redis&logoColor=white" alt="Redis 7" />
  <img src="https://img.shields.io/badge/VietQR-Dynamic%20Banking%20QR-8A2BE2" alt="VietQR" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
</p>

---

## 📖 1. Giới Thiệu Tổng Quan (Overview)

**SaaS API Platform Backend** là hệ thống máy chủ dịch vụ chuẩn doanh nghiệp (Enterprise SaaS Platform) phát triển trên nền tảng **Java 17 & Spring Boot 3.3.5**, cho phép các công ty công nghệ đóng gói, thương mại hóa, bảo vệ và tự động hóa thu tiền dịch vụ API của mình theo mô hình **Đo đếm lưu lượng sử dụng thực tế (Metered Billing & Telemetry)** và **Gói cước định kỳ (Subscription)**.

### 💡 Các tính năng lõi sẵn có:
- **Tự động cấp quyền truy cập**: Cấp phát API Key (`sk_live_...`) định danh riêng cho từng đối tác / lập trình viên.
- **Bảo vệ hệ thống & Chống DDoS**: Tích hợp thuật toán **Redis Token Bucket Rate Limiting (60 req/phút)** và tường lửa IP Firewall Rule.
- **Đo đếm lưu lượng chính xác (Telemetry Metering)**: Ghi nhận từng request thời gian thực qua Redis mà không làm nghẽn Database.
- **Tự động xuất hóa đơn & Thu tiền ngày 1 hàng tháng**: Cron scheduler định kỳ tự động tính cước overage và xuất hóa đơn PDF lưu lên AWS S3 / MinIO.
- **Cổng chuyển khoản ngân hàng VietQR động**: Tự động sinh mã QR Vietcombank/MBBank kèm đúng số tiền và nội dung chuyển khoản để tự động gạch nợ 24/7.
- **Hệ thống Webhook an ninh HMAC-SHA256**: Bắn sự kiện biến động tức thì đến các hệ thống đối tác.
- **Tài liệu Swagger OpenAPI 3.0**: Trực quan hóa toàn bộ phân hệ API tại `http://localhost:3000/docs` hoặc `/swagger-ui.html`.

---

## 🏛️ 2. Kiến Trúc Phân Hệ (Modular Architecture)

Dự án được cấu trúc theo mô hình phân lớp rõ ràng:

```text
saas-api-platform-backend/
├── src/main/java/com/saas/api/
│   ├── core/                            # Cấu hình chung, Security, JWT, Filter, Exception Handler
│   ├── modules/                         # Các phân hệ nghiệp vụ
│   │   ├── aicopilot/                   # Trợ lý AI Copilot kỹ thuật cho lập trình viên
│   │   ├── alerts/                      # Cảnh báo hạn mức sử dụng (Quota & Usage alerts)
│   │   ├── analytics/                   # Báo cáo thống kê, metrics
│   │   ├── apiproducts/                 # Danh mục gói API (Free, Starter, Pro, Enterprise)
│   │   ├── audit/                       # Ghi nhận nhật ký an ninh hệ thống
│   │   ├── auth/                        # Đăng ký, Đăng nhập, Cấp JWT Access & Refresh Token
│   │   ├── coupons/                     # Hệ thống mã giảm giá & Khuyến mãi
│   │   ├── firewall/                    # WAF, IP Blacklist/Whitelist
│   │   ├── invoices/                    # Tạo hóa đơn, Xuất PDF lưu trữ S3
│   │   ├── mockapis/                    # 10 Dịch vụ API thương mại mẫu đang hoạt động
│   │   ├── notifications/               # Hệ thống thông báo nội bộ
│   │   ├── payments/                    # Payment Intent & Cổng Chuyển Khoản Ngân Hàng VietQR
│   │   ├── slaprobes/                   # SLA Uptime probes giám sát sức khỏe
│   │   ├── subscriptions/               # Quản lý thuê bao & Động cơ tính cước
│   │   ├── teams/                       # Quản lý tổ chức, nhóm làm việc & thành viên
│   │   ├── usage/                       # Cổng API Gateway, Telemetry Metering & Logs
│   │   ├── users/                       # Hồ sơ người dùng, Xoay vòng API Key
│   │   └── webhooks/                    # Dispatcher bản tin sự kiện có ký HMAC-SHA256
│   └── SaasApiApplication.java          # Spring Boot Main Application
│
├── src/main/resources/
│   ├── application.yml                  # Cấu hình Spring Boot chính
│   ├── application-dev.yml              # Cấu hình môi trường dev
│   └── db/migration/                    # Flyway Migration scripts (V1 -> V12)
│
├── pom.xml                              # Maven Configuration
└── docker-compose.yml                   # Khởi chạy Postgres 16, Redis 7, Mailpit
```

---

## 🌟 3. Danh Mục 10 Dịch Vụ API Thương Mại Đang Hoạt Động

| Nhóm | Tên Dịch Vụ | Endpoint | Mô Tả Dữ Liệu |
| :--- | :--- | :--- | :--- |
| **🏢 Doanh Nghiệp** | **Tra Cứu Mã Số Thuế** | `/api/v1/business/tax-lookup` | Tra cứu ĐKKD, Tên công ty, Đại diện pháp luật, Ngành nghề chính. |
| **🏢 Doanh Nghiệp** | **Mã BIN & Ngân Hàng** | `/api/v1/business/bank-bin-lookup` | Danh mục 54 ngân hàng NAPAS & VietQR, giải mã mã thẻ 9704. |
| **🤖 Trí Tuệ AI** | **AI Content Marketing** | `/api/v1/ai/generate-content` | Tạo bài viết marketing chuẩn SEO, tiêu đề giật tít, SEO Keywords. |
| **🤖 Trí Tuệ AI** | **AI Phân Tích Cảm Xúc** | `/api/v1/ai/sentiment-analysis` | Đánh giá phản hồi khách hàng (Tích cực/Tiêu cực) & Mức độ hài lòng. |
| **🤖 Trí Tuệ AI** | **AI OCR Quét Thẻ CCCD** | `/api/v1/ai/ocr-id-card` | Trích xuất tự động Số CCCD, Họ tên, Ngày sinh, Quê quán, Thường trú. |
| **📈 Tài Chính** | **Tỷ Giá & Giá Vàng SJC** | `/api/v1/finance/exchange-rates` | Tỷ giá USD, EUR, JPY, GBP, CNY và Giá vàng SJC 9999 Realtime. |
| **📈 Tài Chính** | **Giá Crypto Realtime** | `/api/v1/finance/crypto-price` | Giá Bitcoin (BTC), Ethereum (ETH), Solana (SOL), USDT & Biến động 24h. |
| **🚗 Giao Thông** | **Tra Cứu Phạt Nguội** | `/api/v1/traffic/traffic-fine-lookup` | Tra cứu vi phạm giao thông, mức phạt, địa điểm theo biển số xe. |
| **🚗 Giao Thông** | **Đơn Vị Hành Chính 63 Tỉnh** | `/api/v1/geo/vietnam-provinces` | Danh mục 63 Tỉnh/Thành phố, Quận/Huyện chuẩn Tổng Cục Thống Kê. |
| **📲 Viễn Thông** | **Gửi Tin Nhắn SMS OTP** | `/api/v1/telecom/sms-otp-send` | Cổng gửi tin nhắn SMS Brandname và Zalo ZNS xác thực OTP. |

---

## ⚡ 4. Hướng Dẫn Cài Đặt & Khởi Chạy (Quickstart)

### 📋 Yêu cầu môi trường:
- Java JDK 17+
- Maven 3.8+ (hoặc Maven Wrapper)
- Docker & Docker Compose (cho Postgres, Redis, Mailpit)

### 🔹 Các bước khởi chạy:
```powershell
# 1. Khởi chạy cơ sở dữ liệu và cache nền
docker-compose up -d postgres redis mailpit

# 2. Biên dịch và khởi động ứng dụng Spring Boot
mvn spring-boot:run
```

---

## 🌐 5. Địa Chỉ Truy Cập Dịch Vụ
- 📚 **Tài Liệu Swagger OpenAPI UI**: `http://localhost:3000/docs` (hoặc `/swagger-ui.html`)
- 🩺 **Kiểm Tra Sức Khỏe (Health Check)**: `http://localhost:3000/actuator/health`
- 📬 **Giao Diện Kiểm Tra Email (Mailpit)**: `http://localhost:8025`

---

## 🔑 6. Tài Khoản & Khóa Mẫu (Demo Credentials)
- **Email Developer Demo**: `dev@saas-platform.com` / `Dev@123456`
- **Default API Key**: `sk_live_developer_test_key_888`
