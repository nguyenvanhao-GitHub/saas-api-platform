-- Flyway Database Migration V6: Multi-Key Management, Scopes, IP Whitelisting, and Webhook Delivery Enhancements

-- 1. Multi API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(64) NOT NULL UNIQUE,
    scopes VARCHAR(255) DEFAULT 'read:all,write:all',
    ip_whitelist TEXT,
    rate_limit_per_minute INT NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(64),
    updated_by VARCHAR(64),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2. Enhance Webhook Delivery Logs Table with latency, retries, and status
ALTER TABLE webhook_delivery_logs ADD COLUMN IF NOT EXISTS latency_ms BIGINT DEFAULT 0;
ALTER TABLE webhook_delivery_logs ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0;
ALTER TABLE webhook_delivery_logs ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'DELIVERED';
ALTER TABLE webhook_delivery_logs ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMP WITH TIME ZONE;

-- 3. Migrate existing User API Keys to api_keys table for seamless backward-compatibility
INSERT INTO api_keys (id, user_id, key_name, api_key, scopes, rate_limit_per_minute, is_active, created_at, updated_at, is_deleted)
SELECT 
    gen_random_uuid(), 
    id, 
    'Primary Production Key', 
    api_key, 
    'read:all,write:all', 
    60, 
    TRUE, 
    created_at, 
    updated_at, 
    FALSE
FROM users
WHERE api_key IS NOT NULL AND is_deleted = FALSE
ON CONFLICT (api_key) DO NOTHING;

-- 4. Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id, is_active, is_deleted);
CREATE INDEX IF NOT EXISTS idx_api_keys_token ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_webhook_delivery_logs_wh ON webhook_delivery_logs(endpoint_id, created_at DESC);
