@echo off
REM ==============================================================================
REM Script tu dong sao luu co so du lieu PostgreSQL tren Windows
REM ==============================================================================

set TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=C:\var\backups\saas_platform
set BACKUP_FILE=%BACKUP_DIR%\saas_platform_%TIMESTAMP%.sql

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

set PGPASSWORD=12345678
echo [%DATE% %TIME%] Dang sao luu database saas_platform...

pg_dump -h localhost -p 5432 -U postgres -d saas_platform --clean --if-exists > "%BACKUP_FILE%"

echo [%DATE% %TIME%] Sao luu thanh cong: %BACKUP_FILE%
