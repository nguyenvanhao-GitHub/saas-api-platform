-- Flyway Database Migration V13: Comprehensive Master Demo Dataset
-- Seeds rich, production-grade test data across 100% of tables and UI pages

-- 1. Master Users (Admin & Developer accounts)
-- Password for Dev accounts: Dev@123456 ($2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK)
-- Password for Admin accounts: Admin@123456 ($2a$10$Ju7QLd46CqfIcvPYbkKOm.jw1N7li5wxZHzod6JejenNdXDcMv1RG)
INSERT INTO users (id, email, password_hash, full_name, role, api_key, status, created_by, is_deleted)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'admin@saas-platform.com', '$2a$10$Ju7QLd46CqfIcvPYbkKOm.jw1N7li5wxZHzod6JejenNdXDcMv1RG', 'System Administrator', 'ROLE_ADMIN', 'sk_live_admin_master_key_999', 'ACTIVE', 'SYSTEM', FALSE),
('a0000000-0000-0000-0000-000000000002', 'dev@saas-platform.com', '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK', 'Senior Developer', 'ROLE_DEVELOPER', 'sk_live_developer_test_key_888', 'ACTIVE', 'SYSTEM', FALSE),
('a0000000-0000-0000-0000-000000000003', 'techlead@saas-platform.com', '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK', 'Alexander Vance (Tech Lead)', 'ROLE_DEVELOPER', 'sk_live_techlead_key_777', 'ACTIVE', 'SYSTEM', FALSE),
('a0000000-0000-0000-0000-000000000004', 'qa.engineer@saas-platform.com', '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK', 'Elena Rostova (QA Engineer)', 'ROLE_DEVELOPER', 'sk_live_qa_engineer_key_666', 'ACTIVE', 'SYSTEM', FALSE),
('a0000000-0000-0000-0000-000000000005', 'john.doe@enterprise.com', '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK', 'John Doe (Enterprise Architect)', 'ROLE_DEVELOPER', 'sk_live_enterprise_client_555', 'ACTIVE', 'SYSTEM', FALSE),
('a0000000-0000-0000-0000-000000000006', 'sarah.connor@fintech.io', '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK', 'Sarah Connor (Fintech CTO)', 'ROLE_DEVELOPER', 'sk_live_fintech_partner_444', 'ACTIVE', 'SYSTEM', FALSE)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    status = 'ACTIVE',
    is_deleted = FALSE;

-- 2. Master API Products Catalog
INSERT INTO api_products (id, code, name, description, base_price, plan_type, rate_limit_per_minute, created_by, is_deleted)
VALUES 
('b0000000-0000-0000-0000-000000000001', 'FREE_TIER', 'Gói Miễn Phí (Developer Free)', 'Gói dùng thử nghiệm miễn phí tối đa 30 requests/phút', 0.00, 'FIXED', 30, 'SYSTEM', FALSE),
('b0000000-0000-0000-0000-000000000002', 'PRO_METERED', 'Gói Chuyên Nghiệp (Metered Pro)', 'Tính phí linh hoạt theo lưu lượng thực tế 0.001 USD/req + 15 USD phí duy trì', 15.00, 'METERED', 300, 'SYSTEM', FALSE),
('b0000000-0000-0000-0000-000000000003', 'ENTERPRISE_UNLIMITED', 'Gói Doanh Nghiệp Không Giới Hạn', 'Gói trọn gói băng thông lớn cho tập đoàn, hỗ trợ SLA 99.99%', 199.00, 'FIXED', 1000, 'SYSTEM', FALSE),
('b0000000-0000-0000-0000-000000000004', 'AI_VISION_OCR', 'Gói AI Computer Vision & OCR', 'Bóc tách thông tin CCCD gắn chip, hộ chiếu và hóa đơn điện tử tự động', 49.00, 'FIXED', 500, 'SYSTEM', FALSE),
('b0000000-0000-0000-0000-000000000005', 'FINTECH_VIETQR', 'Gói Open Banking & VietQR Core', 'Tự động tạo mã thanh toán VietQR động và đối soát giao dịch ngân hàng 24/7', 99.00, 'METERED', 800, 'SYSTEM', FALSE),
('b0000000-0000-0000-0000-000000000006', 'IOT_TELEMETRY', 'Gói IoT Smart Gate Telemetry', 'Thu thập luồng dữ liệu cảm biến, biển số xe và thiết bị Gateway thời gian thực', 79.00, 'METERED', 600, 'SYSTEM', FALSE)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    rate_limit_per_minute = EXCLUDED.rate_limit_per_minute;

-- 3. Subscriptions
INSERT INTO subscriptions (id, user_id, product_id, status, total_requests_used, created_by, is_deleted)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'ACTIVE', 1250, 'SYSTEM', FALSE),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'ACTIVE', 3420, 'SYSTEM', FALSE),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'ACTIVE', 890, 'SYSTEM', FALSE),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 'ACTIVE', 154200, 'SYSTEM', FALSE),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', 'ACTIVE', 45000, 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. Invoices
INSERT INTO invoices (id, invoice_number, user_id, amount, s3_pdf_url, status, created_by, is_deleted, created_at)
VALUES 
('d0000000-0000-0000-0000-000000000001', 'INV-202608-001', 'a0000000-0000-0000-0000-000000000002', 16.25, 'https://saas-invoices-storage.s3.amazonaws.com/invoices/INV-202608-001.pdf', 'PAID', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '30 days'),
('d0000000-0000-0000-0000-000000000002', 'INV-202609-001', 'a0000000-0000-0000-0000-000000000002', 49.00, 'https://saas-invoices-storage.s3.amazonaws.com/invoices/INV-202609-001.pdf', 'PAID', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('d0000000-0000-0000-0000-000000000003', 'INV-202609-002', 'a0000000-0000-0000-0000-000000000002', 18.45, 'https://saas-invoices-storage.s3.amazonaws.com/invoices/INV-202609-002.pdf', 'PENDING', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('d0000000-0000-0000-0000-000000000004', 'INV-202609-003', 'a0000000-0000-0000-0000-000000000005', 199.00, 'https://saas-invoices-storage.s3.amazonaws.com/invoices/INV-202609-003.pdf', 'PAID', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('d0000000-0000-0000-0000-000000000005', 'INV-202609-004', 'a0000000-0000-0000-0000-000000000006', 99.00, 'https://saas-invoices-storage.s3.amazonaws.com/invoices/INV-202609-004.pdf', 'PAID', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (invoice_number) DO NOTHING;

-- 5. Payment Transactions
INSERT INTO payment_transactions (id, user_id, invoice_id, payment_method, amount, currency, transaction_reference, status, payment_gateway_response, created_by, is_deleted)
VALUES 
('d0000000-0000-0000-0001-000000000001', 'a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'CREDIT_CARD', 16.25, 'USD', 'ch_stripe_3M9281aBcDeFg', 'SUCCESS', '{"status": "succeeded", "brand": "visa", "last4": "4242"}', 'SYSTEM', FALSE),
('d0000000-0000-0000-0001-000000000002', 'a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'VIETQR', 49.00, 'USD', 'vqr_MB_98273615498', 'SUCCESS', '{"status": "PAID", "bankCode": "MBBANK", "amountVND": 1225000}', 'SYSTEM', FALSE),
('d0000000-0000-0000-0001-000000000003', 'a0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000004', 'CREDIT_CARD', 199.00, 'USD', 'ch_stripe_ent_8899aabb', 'SUCCESS', '{"status": "succeeded", "brand": "mastercard", "last4": "8888"}', 'SYSTEM', FALSE),
('d0000000-0000-0000-0001-000000000004', 'a0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000005', 'VIETQR', 99.00, 'USD', 'vqr_VCB_4455667788', 'SUCCESS', '{"status": "PAID", "bankCode": "VCB", "amountVND": 2475000}', 'SYSTEM', FALSE)
ON CONFLICT (transaction_reference) DO NOTHING;

-- 6. Coupons & Usages
INSERT INTO coupons (id, code, discount_type, discount_value, max_uses, times_used, expires_at, created_by, is_deleted)
VALUES 
('e0000000-0000-0000-0000-000000000001', 'WELCOME50', 'PERCENTAGE', 50.00, 1000, 48, '2028-12-31 23:59:59+00', 'SYSTEM', FALSE),
('e0000000-0000-0000-0000-000000000002', 'SAASVIP20', 'PERCENTAGE', 20.00, 500, 12, '2027-12-31 23:59:59+00', 'SYSTEM', FALSE),
('e0000000-0000-0000-0000-000000000003', 'STARTUP100', 'FIXED_AMOUNT', 100.00, 200, 8, '2027-12-31 23:59:59+00', 'SYSTEM', FALSE),
('e0000000-0000-0000-0000-000000000004', 'BLACKFRIDAY70', 'PERCENTAGE', 70.00, 100, 0, '2026-11-30 23:59:59+00', 'SYSTEM', FALSE),
('e0000000-0000-0000-0000-000000000005', 'DEVCOMMUNITY', 'FIXED_AMOUNT', 15.00, 3000, 156, '2028-01-01 00:00:00+00', 'SYSTEM', FALSE)
ON CONFLICT (code) DO UPDATE
SET discount_value = EXCLUDED.discount_value,
    max_uses = EXCLUDED.max_uses,
    expires_at = EXCLUDED.expires_at;

INSERT INTO coupon_usages (id, coupon_id, user_id, invoice_id, discount_amount, created_by, is_deleted)
VALUES 
('e0000000-0000-0000-0001-000000000001', 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 16.25, 'SYSTEM', FALSE),
('e0000000-0000-0000-0001-000000000002', 'e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000004', 100.00, 'SYSTEM', FALSE)
ON CONFLICT (user_id, coupon_id) DO NOTHING;

-- 7. Multi API Keys for Developer
INSERT INTO api_keys (id, user_id, key_name, api_key, scopes, ip_whitelist, rate_limit_per_minute, is_active, created_by, is_deleted)
VALUES 
('e0000000-0000-0000-0002-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Production Backend Master Key', 'sk_live_developer_test_key_888', 'read:all,write:all', NULL, 300, TRUE, 'SYSTEM', FALSE),
('e0000000-0000-0000-0002-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Mobile Client iOS/Android Key', 'sk_live_mobile_app_sec_777', 'read:products,read:analytics', '192.168.1.0/24', 120, TRUE, 'SYSTEM', FALSE),
('e0000000-0000-0000-0002-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Staging Microservices Cluster Key', 'sk_live_staging_cluster_666', 'read:all,write:all', NULL, 300, TRUE, 'SYSTEM', FALSE),
('e0000000-0000-0000-0002-000000000004', 'a0000000-0000-0000-0000-000000000002', 'IoT Gate Telemetry Ingestion Key', 'sk_live_iot_gate_sensor_555', 'write:telemetry,read:status', '10.0.0.0/16', 600, TRUE, 'SYSTEM', FALSE)
ON CONFLICT (api_key) DO UPDATE
SET key_name = EXCLUDED.key_name,
    scopes = EXCLUDED.scopes,
    ip_whitelist = EXCLUDED.ip_whitelist,
    rate_limit_per_minute = EXCLUDED.rate_limit_per_minute,
    is_active = TRUE;

-- 8. API Key Rotations History
INSERT INTO api_key_rotations (id, user_id, old_api_key_masked, reason, ip_address, rotated_at, created_by, is_deleted)
VALUES 
('e0000000-0000-0000-0003-000000000001', 'a0000000-0000-0000-0000-000000000002', 'sk_live_dev_old_***999', 'Định kỳ nâng cấp an ninh định kỳ theo quý', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '15 days', 'SYSTEM', FALSE),
('e0000000-0000-0000-0003-000000000002', 'a0000000-0000-0000-0000-000000000002', 'sk_live_dev_test_***444', 'Xoay vòng sau khi chạy bài kiểm thử tải Staging', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '2 days', 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 9. Webhooks & Delivery Logs
INSERT INTO webhook_endpoints (id, user_id, target_url, secret_key, events, status, created_by, is_deleted)
VALUES 
('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'https://webhook.site/saas-demo-receiver', 'whsec_a8f9e01bc3d4567890ef123456789abc', 'invoice.paid,subscription.created,quota.warning', 'ACTIVE', 'SYSTEM', FALSE),
('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'https://api.mycorp.internal/webhooks/billing', 'whsec_9988aabbccddee112233445566778899', 'invoice.paid,payment.failed', 'ACTIVE', 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO webhook_delivery_logs (id, endpoint_id, event_type, payload, response_status, response_body, success, latency_ms, retry_count, status, created_by, is_deleted, created_at)
VALUES 
('f0000000-0000-0000-0001-000000000001', 'f0000000-0000-0000-0000-000000000001', 'invoice.paid', '{"event": "invoice.paid", "invoiceId": "INV-202609-001", "amount": 49.00, "currency": "USD", "timestamp": 1789000000}', 200, '{"received": true}', TRUE, 45, 0, 'DELIVERED', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('f0000000-0000-0000-0001-000000000002', 'f0000000-0000-0000-0000-000000000001', 'quota.warning', '{"event": "quota.warning", "threshold": 80, "currentUsage": 240, "maxLimit": 300}', 200, '{"ack": 1}', TRUE, 62, 0, 'DELIVERED', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('f0000000-0000-0000-0001-000000000003', 'f0000000-0000-0000-0000-000000000002', 'invoice.paid', '{"event": "invoice.paid", "invoiceId": "INV-202608-001", "amount": 16.25, "currency": "USD"}', 200, '{"status": "ok"}', TRUE, 38, 0, 'DELIVERED', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '30 days'),
('f0000000-0000-0000-0001-000000000004', 'f0000000-0000-0000-0000-000000000001', 'subscription.created', '{"event": "subscription.created", "plan": "AI_VISION_OCR", "userId": "a0000000-0000-0000-0000-000000000002"}', 201, '{"created": true}', TRUE, 51, 0, 'DELIVERED', 'SYSTEM', FALSE, CURRENT_TIMESTAMP - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- 10. Automated Usage Alerts
INSERT INTO usage_alerts (id, user_id, threshold_percentage, channel, destination, is_triggered, created_by, is_deleted)
VALUES 
('f0000000-0000-0000-0002-000000000001', 'a0000000-0000-0000-0000-000000000002', 80, 'IN_APP', NULL, TRUE, 'SYSTEM', FALSE),
('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 90, 'EMAIL', 'dev@saas-platform.com', FALSE, 'SYSTEM', FALSE),
('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 95, 'SLACK', 'https://hooks.slack.com/services/T00/B00/mock-webhook', FALSE, 'SYSTEM', FALSE),
('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 99, 'DISCORD', 'https://discord.com/api/webhooks/12345/mock-alert', FALSE, 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 11. Organizations & Team Members
INSERT INTO organizations (id, name, slug, owner_id, created_by, is_deleted)
VALUES 
('10000000-0000-0000-0000-000000000001', 'SaaS Platform Core Engineering', 'saas-eng-core', 'a0000000-0000-0000-0000-000000000002', 'SYSTEM', FALSE),
('10000000-0000-0000-0000-000000000002', 'Fintech Open Banking Lab', 'fintech-open-bank', 'a0000000-0000-0000-0000-000000000006', 'SYSTEM', FALSE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO team_members (id, organization_id, user_id, invited_email, role, status, created_by, is_deleted)
VALUES 
('10000000-0000-0000-0001-000000000001', '10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'dev@saas-platform.com', 'OWNER', 'ACTIVE', 'SYSTEM', FALSE),
('10000000-0000-0000-0001-000000000002', '10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'techlead@saas-platform.com', 'ADMIN', 'ACTIVE', 'SYSTEM', FALSE),
('10000000-0000-0000-0001-000000000003', '10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'qa.engineer@saas-platform.com', 'DEVELOPER', 'ACTIVE', 'SYSTEM', FALSE),
('10000000-0000-0000-0001-000000000004', '10000000-0000-0000-0000-000000000001', NULL, 'finance.auditor@saas-platform.com', 'VIEWER', 'PENDING', 'SYSTEM', FALSE),
('10000000-0000-0000-0001-000000000005', '10000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'sarah.connor@fintech.io', 'OWNER', 'ACTIVE', 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 12. Mock API Endpoints
INSERT INTO mock_endpoints (id, user_id, name, path, http_method, response_status, response_body, response_headers, is_active, call_count, created_by, is_deleted)
VALUES 
('20000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Mock Tra Cứu Đơn Hàng Gần Đây', '/orders/recent', 'GET', 200, '{"code": 1000, "message": "Success", "orders": [{"id": "ORD-991", "item": "Cloud Server Pro", "amount": 120.50, "status": "COMPLETED"}, {"id": "ORD-992", "item": "SSL Certificate Multi-Domain", "amount": 49.00, "status": "PROCESSING"}]}', '{"Content-Type": "application/json"}', TRUE, 128, 'SYSTEM', FALSE),
('20000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Mock Đồng Bộ Thiết Bị IoT Gateway', '/devices/sync', 'POST', 201, '{"code": 1000, "status": "DEVICE_SYNCED", "syncedAt": "2026-09-11T09:00:00Z", "deviceId": "iot_gate_08a"}', '{"Content-Type": "application/json"}', TRUE, 45, 'SYSTEM', FALSE),
('20000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Mock Xác Thực KYC & Face Match', '/kyc/verify-match', 'POST', 200, '{"code": 1000, "matchScore": 0.982, "status": "VERIFIED_PASSED", "faceMatched": true}', '{"Content-Type": "application/json"}', TRUE, 92, 'SYSTEM', FALSE),
('20000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Mock Dự Báo Thời Tiết & Chất Lượng Không Khí', '/weather/realtime', 'GET', 200, '{"city": "Ha Noi", "tempC": 28.5, "humidity": 65, "aqi": 42, "status": "GOOD"}', '{"Content-Type": "application/json"}', TRUE, 310, 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 13. IP Firewall CIDR Rules
INSERT INTO ip_firewall_rules (id, rule_type, cidr_ip, description, is_active, blocked_hits, created_by, is_deleted)
VALUES 
('30000000-0000-0000-0000-000000000001', 'ALLOW', '192.168.1.0/24', 'Dải mạng nội bộ Internal Office VPC', TRUE, 0, 'SYSTEM', FALSE),
('30000000-0000-0000-0000-000000000002', 'DENY', '45.33.32.156/32', 'IP botnet nghi vấn scan lỗ hổng hệ thống', TRUE, 1420, 'SYSTEM', FALSE),
('30000000-0000-0000-0000-000000000003', 'DENY', '103.245.10.0/24', 'Dải IP quốc tế phát tán DDoS', TRUE, 8950, 'SYSTEM', FALSE),
('30000000-0000-0000-0000-000000000004', 'ALLOW', '173.245.48.0/20', 'Dải IP Cloudflare Reverse Proxy CDN', TRUE, 0, 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 14. AI Copilot Chat Logs
INSERT INTO ai_chat_logs (id, user_id, prompt, response_text, language_used, tokens_used, created_by, is_deleted)
VALUES 
('40000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Làm thế nào để xác thực HMAC-SHA256 cho Webhook nhận được từ SaaS API?', 'Để xác thực webhook, bạn lấy header X-Signature và tính toán HMAC-SHA256 với secretKey của endpoint trên toàn bộ chuỗi raw payload JSON.', 'NodeJS', 145, 'SYSTEM', FALSE),
('40000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Giải thích cơ chế Redis Token Bucket Rate Limiting trên Gateway', 'Hệ thống sử dụng Redis Lua script kiểm tra số lượng token còn lại trong cửa sổ 60 giây của từng API Key, đảm bảo atomic và độ trễ dưới 2ms.', 'Python', 210, 'SYSTEM', FALSE),
('40000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Hướng dẫn tích hợp tạo VietQR động bằng Java Spring Boot', 'Bạn chỉ cần gửi POST request tới /api/v1/payments/vietqr/generate kèm mã hóa đơn và số tiền VND, Gateway sẽ trả về chuỗi EMVCo QR chuẩn NAPAS.', 'Java', 180, 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 15. Endpoint Policies
INSERT INTO endpoint_policies (id, endpoint_path, http_method, rate_limit_per_min, burst_capacity, is_pii_masking_enabled, is_active, created_at, updated_at)
VALUES 
('50000000-0000-0000-0000-000000000001', '/api/v1/business/tax-lookup', 'GET', 60, 10, FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('50000000-0000-0000-0000-000000000002', '/api/v1/ai/summarize', 'POST', 30, 5, FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('50000000-0000-0000-0000-000000000003', '/api/v1/payments/checkout', 'POST', 20, 4, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('50000000-0000-0000-0000-000000000004', '/api/v1/users/profile', 'GET', 120, 20, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 16. Distributed Request Traces
INSERT INTO request_traces (id, trace_id, span_id, parent_span_id, service_name, endpoint, http_method, http_status, duration_ms, gateway_latency_ms, auth_latency_ms, upstream_latency_ms, timestamp)
VALUES 
(gen_random_uuid(), 'tr-8f92a10b4c', 'span-gw-01', NULL, 'api-gateway', '/api/v1/business/tax-lookup', 'GET', 200, 48, 5, 12, 31, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
(gen_random_uuid(), 'tr-8f92a10b4c', 'span-auth-02', 'span-gw-01', 'auth-service', '/api/v1/auth/verify', 'POST', 200, 12, 0, 12, 0, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
(gen_random_uuid(), 'tr-8f92a10b4c', 'span-biz-03', 'span-gw-01', 'tax-lookup-upstream', '/internal/tax/lookup', 'GET', 200, 31, 0, 0, 31, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
(gen_random_uuid(), 'tr-4d71e99c1a', 'span-gw-10', NULL, 'api-gateway', '/api/v1/payments/checkout', 'POST', 200, 115, 6, 14, 95, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(gen_random_uuid(), 'tr-4d71e99c1a', 'span-pay-11', 'span-gw-10', 'payment-vietqr-engine', '/internal/napas/qr', 'POST', 200, 95, 0, 0, 95, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(gen_random_uuid(), 'tr-2a88c33d9f', 'span-gw-20', NULL, 'api-gateway', '/api/v1/ai/ocr-id-card', 'POST', 200, 240, 4, 11, 225, CURRENT_TIMESTAMP - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 17. Traffic Replay Jobs
INSERT INTO traffic_replay_jobs (id, name, target_env_url, recorded_requests_count, success_count, failed_count, status, created_at)
VALUES 
('60000000-0000-0000-0000-000000000001', 'Canary Staging Stress Test 2026', 'https://staging-cluster.internal:8443', 1500, 1495, 5, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('60000000-0000-0000-0000-000000000002', 'Gateway v3.2 Shadow Traffic Replay', 'https://canary-gateway.internal:8080', 800, 760, 10, 'RUNNING', CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
('60000000-0000-0000-0000-000000000003', 'DR Cluster Failover Simulation', 'https://dr-cluster.singapore.internal', 3000, 0, 0, 'PENDING', CURRENT_TIMESTAMP),
('60000000-0000-0000-0000-000000000004', 'Nightly Regression Load Benchmark', 'https://benchmark-test.internal:9000', 5000, 4980, 20, 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 18. SLA Synthetic Probes
INSERT INTO sla_probes (id, name, target_url, http_method, expected_status, check_interval_seconds, last_latency_ms, uptime_percentage, status, last_checked_at, created_at)
VALUES 
('70000000-0000-0000-0000-000000000001', 'Core API Gateway Health Check', 'http://localhost:3000/actuator/health', 'GET', 200, 30, 18, 99.99, 'HEALTHY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('70000000-0000-0000-0000-000000000002', 'Auth Token Verification Service', 'http://localhost:3000/api/v1/auth/verify', 'POST', 200, 60, 35, 99.95, 'HEALTHY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('70000000-0000-0000-0000-000000000003', 'Webhook Dispatcher Queue Probe', 'http://localhost:3000/api/v1/webhooks/health', 'GET', 200, 60, 62, 99.90, 'HEALTHY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('70000000-0000-0000-0000-000000000004', 'VietQR Open Banking Core Settlement', 'https://api.vietqr.io/v2/banks', 'GET', 200, 60, 42, 99.98, 'HEALTHY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 19. In-App Notifications
INSERT INTO notifications (id, user_id, title, content, type, is_read, created_at, created_by, is_deleted)
VALUES 
('80000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Chào mừng đến với SaaS Developer Platform Master Edition', 'Tài khoản của bạn đã được khởi tạo thành công với quyền truy cập API Key sk_live_ và đầy đủ bộ công cụ Enterprise.', 'INFO', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 day', 'SYSTEM', FALSE),
('80000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Hóa đơn tháng INV-202609-001 đã thanh toán thành công', 'Thanh toán tự động qua VietQR đã được gạch nợ thành công với số tiền 49.00 USD.', 'BILLING', FALSE, CURRENT_TIMESTAMP - INTERVAL '6 hours', 'SYSTEM', FALSE),
('80000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Cảnh báo hạn mức lưu lượng 80%', 'Lưu lượng API gói Metered Pro của bạn đã đạt 80% hạn mức trong tháng. Hệ thống đang tự động mở rộng.', 'WARNING', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 hour', 'SYSTEM', FALSE),
('80000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Cập nhật tính năng: IP Firewall & Multi API Keys', 'Hệ thống đã hỗ trợ cấp nhiều API Key với scopes phân quyền chi tiết và IP Whitelisting theo chuẩn CIDR.', 'SUCCESS', TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days', 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 20. Security Audit Logs
INSERT INTO audit_logs (id, user_id, user_email, action, resource_type, resource_id, client_ip, user_agent, description, created_at, created_by, is_deleted)
VALUES 
('90000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'dev@saas-platform.com', 'USER_LOGIN', 'AUTH', 'a0000000-0000-0000-0000-000000000002', '127.0.0.1', 'Mozilla/5.0 Chrome/128.0', 'Developer signed in successfully with JWT token generated', CURRENT_TIMESTAMP - INTERVAL '3 hours', 'SYSTEM', FALSE),
('90000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'dev@saas-platform.com', 'KEY_CREATE', 'API_KEY', 'e0000000-0000-0000-0002-000000000002', '127.0.0.1', 'Mozilla/5.0 Chrome/128.0', 'Created new scoped API Key: Mobile Client API Key', CURRENT_TIMESTAMP - INTERVAL '2 hours', 'SYSTEM', FALSE),
('90000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'admin@saas-platform.com', 'POLICY_UPDATE', 'TRAFFIC_POLICY', '50000000-0000-0000-0000-000000000001', '127.0.0.1', 'Mozilla/5.0 Chrome/128.0', 'Admin configured PII masking on /api/v1/payments/checkout', CURRENT_TIMESTAMP - INTERVAL '1 hour', 'SYSTEM', FALSE),
('90000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'dev@saas-platform.com', 'COUPON_REDEEM', 'COUPON', 'e0000000-0000-0000-0000-000000000001', '127.0.0.1', 'Mozilla/5.0 Chrome/128.0', 'Redeemed coupon WELCOME50 for 50% discount on invoice INV-202608-001', CURRENT_TIMESTAMP - INTERVAL '30 days', 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;
