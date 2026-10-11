-- Flyway Database Migration V12: Ensure all accounts and passwords are valid and synced
-- Password for Dev accounts: Dev@123456
-- Password for Admin accounts: Admin@123456

-- 1. Ensure dev@saas-platform.com exists with active status and valid password hash
INSERT INTO users (id, email, password_hash, full_name, role, api_key, status, created_by, is_deleted)
VALUES ('a0000000-0000-0000-0000-000000000002', 'dev@saas-platform.com', '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK', 'Senior Developer', 'ROLE_DEVELOPER', 'sk_live_developer_test_key_888', 'ACTIVE', 'SYSTEM', FALSE)
ON CONFLICT (id) DO UPDATE 
SET email = 'dev@saas-platform.com',
    password_hash = '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK',
    status = 'ACTIVE',
    is_deleted = FALSE;

-- 2. Update by email as well in case the user was created with a different ID
UPDATE users 
SET password_hash = '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK',
    status = 'ACTIVE',
    is_deleted = FALSE
WHERE email = 'dev@saas-platform.com';

-- 3. Ensure techlead & QA accounts have valid password hash
UPDATE users 
SET password_hash = '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK',
    status = 'ACTIVE',
    is_deleted = FALSE
WHERE email IN ('techlead@saas-platform.com', 'qa.engineer@saas-platform.com');

-- 4. Ensure admin@saas-platform.com has valid password hash & active status
UPDATE users 
SET password_hash = '$2a$10$Ju7QLd46CqfIcvPYbkKOm.jw1N7li5wxZHzod6JejenNdXDcMv1RG',
    status = 'ACTIVE',
    is_deleted = FALSE
WHERE email = 'admin@saas-platform.com';

-- 5. If dev@smartgate.vn exists, migrate it to dev@saas-platform.com
UPDATE users 
SET email = 'dev@saas-platform.com',
    password_hash = '$2a$10$Ts2Kv3S9JnTvkuwwr0OuwO0U7OXhqrRfL/gLoPTqY4I1eELy6KdoK'
WHERE email = 'dev@smartgate.vn' AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'dev@saas-platform.com');
