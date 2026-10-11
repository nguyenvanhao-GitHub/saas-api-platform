-- Flyway Database Migration V2: Seed Initial Master Data for SaaS API Platform

-- 1. Seed Default Admin & Developer Users (Password: Admin@123456 / Dev@123456)
-- BCrypt hash for "Admin@123456": $2a$10$pT3eRzZSX2/G.W.LnLTC/.dJtSZtYM3crwLGcqMx2w30Bl/NUcvoG
-- BCrypt hash for "Dev@123456": $2a$10$kE4xLp8WzhhD3dUj/Az32.BUOkZnyjYSnRvd455XGkOpGxJW5Zq8y
INSERT INTO users (id, email, password_hash, full_name, role, api_key, status, created_by, is_deleted)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'admin@saas-platform.com', '$2a$10$pT3eRzZSX2/G.W.LnLTC/.dJtSZtYM3crwLGcqMx2w30Bl/NUcvoG', 'System Administrator', 'ROLE_ADMIN', 'sk_live_admin_master_key_999', 'ACTIVE', 'SYSTEM', FALSE),
('a0000000-0000-0000-0000-000000000002', 'dev@saas-platform.com', '$2a$10$kE4xLp8WzhhD3dUj/Az32.BUOkZnyjYSnRvd455XGkOpGxJW5Zq8y', 'Senior Developer', 'ROLE_DEVELOPER', 'sk_live_developer_test_key_888', 'ACTIVE', 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Standard API Catalog Products
INSERT INTO api_products (id, code, name, description, base_price, plan_type, rate_limit_per_minute, created_by, is_deleted)
VALUES 
('b0000000-0000-0000-0000-000000000001', 'FREE_TIER', 'Gói Miễn Phí (Developer Free)', 'Gói dùng thử nghiệm miễn phí tối đa 30 requests/phút', 0.00, 'FIXED', 30, 'SYSTEM', FALSE),
('b0000000-0000-0000-0000-000000000002', 'PRO_METERED', 'Gói Chuyên Nghiệp (Metered Pro)', 'Tính phí linh hoạt theo lưu lượng thực tế 0.001 USD/req + 15 USD phí duy trì', 15.00, 'METERED', 300, 'SYSTEM', FALSE),
('b0000000-0000-0000-0000-000000000003', 'ENTERPRISE_UNLIMITED', 'Gói Doanh Nghiệp Không Giới Hạn', 'Gói trọn gói băng thông lớn cho tập đoàn, hỗ trợ SLA 99.99%', 199.00, 'FIXED', 1000, 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Initial Subscription for Developer
INSERT INTO subscriptions (id, user_id, product_id, status, total_requests_used, created_by, is_deleted)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'ACTIVE', 1250, 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Initial Sample Invoice
INSERT INTO invoices (id, invoice_number, user_id, amount, s3_pdf_url, status, created_by, is_deleted)
VALUES 
('d0000000-0000-0000-0000-000000000001', 'INV-202608-001', 'a0000000-0000-0000-0000-000000000002', 16.25, 'https://saas-invoices-storage.s3.amazonaws.com/invoices/INV-202608-001.pdf', 'PAID', 'SYSTEM', FALSE)
ON CONFLICT (id) DO NOTHING;
