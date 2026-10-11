#!/usr/bin/env bash
# ==============================================================================
# Script Triển Khai Production 1-Click cho SaaS API Platform & Metered Billing
# ==============================================================================

set -e

echo "🚀 [1/5] Kiểm tra môi trường Docker & Docker Compose..."
if ! command -v docker &> /dev/null; then
    echo "Đang cài đặt Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

echo "📦 [2/5] Dừng và dọn dẹp các container cũ..."
docker compose down || true

echo "🔨 [3/5] Build và khởi chạy Backend + PostgreSQL + Redis + Mailpit..."
docker compose up -d --build

echo "⏳ [4/5] Đang chờ hệ thống khởi động và nạp Flyway Migration..."
sleep 10

echo "✅ [5/5] Kiểm tra trạng thái các dịch vụ đang chạy:"
docker compose ps

echo "=============================================================================="
echo "🎉 TRIỂN KHAI THÀNH CÔNG!"
echo "👉 Backend API Docs : http://localhost:3000/docs"
echo "👉 Email Testing UI : http://localhost:8025"
echo "👉 Frontend Web App : http://localhost:4200"
echo "=============================================================================="
