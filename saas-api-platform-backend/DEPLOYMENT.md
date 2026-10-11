# Cẩm Nang Triển Khai Saas API Platform Backend (Production & Staging)

Tài liệu này hướng dẫn chi tiết quy trình triển khai dịch vụ Backend **SaaS API Platform** (Spring Boot 3 / Java 17/21) trên máy chủ ảo (VPS), cụm Docker, hoặc Kubernetes.

---

## 1. Yêu cầu hệ thống

| Thành phần | Phiên bản tối thiểu | Ghi chú |
| :--- | :--- | :--- |
| **Java JDK** | OpenJDK 17 hoặc 21 | Môi trường biên dịch / chạy standalone |
| **PostgreSQL** | 15+ hoặc 16 | Cơ sở dữ liệu chính |
| **Redis** | 7.x | Cache và Rate Limiting |
| **Mail Server** | SMTP / SendGrid / SES | Gửi email kích hoạt, hóa đơn |
| **Object Storage** | S3 / MinIO | Lưu trữ file PDF hóa đơn |
| **Docker & Compose**| Docker 24+, Compose v2 | Đóng gói và chạy container |

---

## 2. Các phương thức triển khai

### Phương thức A: Triển khai Cục bộ / Sandbox (Docker Compose)

Đây là cách nhanh nhất để khởi động toàn bộ hệ sinh thái (PostgreSQL, Redis, Mailpit, MinIO, Backend):

```bash
# 1. Sao chép file cấu hình môi trường
cp .env.example .env

# 2. Khởi động toàn bộ cụm dịch vụ
docker compose up -d --build

# 3. Xem log dịch vụ
docker compose logs -f app
```

- **API Base URL**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/docs`
- **Mailpit Web UI (xem email thử nghiệm)**: `http://localhost:8025`
- **MinIO Console (quản trị file S3)**: `http://localhost:9001` (user: `minioadmin`, pass: `minioadmin`)

---

### Phương thức B: Triển khai Production bằng Docker & Nginx Reverse Proxy

#### Bước 1: Chuẩn bị file `.env.production`
Tạo file `.env.production` trên server và điền các thông số thực:
```bash
PORT=3000
SPRING_PROFILES_ACTIVE=production
DATABASE_HOST=postgres.internal.net
DATABASE_PORT=5432
DATABASE_NAME=saas_platform_prod
DATABASE_USER=saas_prod_user
DATABASE_PASSWORD=<MAT_KHAU_MANH>

REDIS_HOST=redis.internal.net
REDIS_PORT=6379

AUTH_TOKEN_SECRET=<CHUOI_JWT_SECRET_TOI_THIEU_32_KY_TU>
```

#### Bước 2: Kéo image và chạy qua `docker-compose.prod.yml`
```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

#### Bước 3: Cấu hình Nginx Reverse Proxy (SSL/HTTPS với Certbot)
File mẫu `/etc/nginx/sites-available/api.saas-platform.com`:
```nginx
server {
    listen 80;
    server_name api.saas-platform.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.saas-platform.com;

    ssl_certificate /etc/letsencrypt/live/api.saas-platform.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.saas-platform.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Tự động hóa CI/CD với GitLab CI

File `.gitlab-ci.yml` định nghĩa quy trình tự động:
1. **Push vào nhánh `develop` hoặc `testing`**: Tự động build, chạy Unit Test và đóng gói Docker image tag `testing-latest`.
2. **Push vào nhánh `main` hoặc tạo Git Tag `vX.Y.Z`**: Tự động đóng gói Docker image Production và đẩy lên Container Registry.
