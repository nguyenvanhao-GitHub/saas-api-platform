#!/usr/bin/env bash
# ==============================================================================
# Script tự động sao lưu cơ sở dữ liệu PostgreSQL cho SaaS API Platform
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/saas_platform}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/saas_platform_${TIMESTAMP}.sql.gz"

DB_HOST="${DATABASE_HOST:-localhost}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-saas_platform}"
DB_USER="${DATABASE_USER:-postgres}"
PGPASSWORD="${DATABASE_PASSWORD:-12345678}"
export PGPASSWORD

mkdir -p "${BACKUP_DIR}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Đang tiến hành sao lưu database ${DB_NAME} từ ${DB_HOST}:${DB_PORT}..."

pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists | gzip > "${BACKUP_FILE}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sao lưu hoàn tất: ${BACKUP_FILE} ($(du -sh "${BACKUP_FILE}" | cut -f1))"

# Xóa các bản backup cũ hơn 7 ngày
find "${BACKUP_DIR}" -type f -name "saas_platform_*.sql.gz" -mtime +7 -delete
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Đã dọn dẹp các bản backup cũ hơn 7 ngày."
