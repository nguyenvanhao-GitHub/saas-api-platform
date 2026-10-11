-- V9: Add Tier-4, Tier-5, Tier-6 Master Enterprise Features

-- 1. Endpoint Policies (Granular Rate Limiting, JSON Schema Validation, PII Masking)
CREATE TABLE IF NOT EXISTS endpoint_policies (
    id UUID PRIMARY KEY,
    endpoint_path VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    rate_limit_per_min INT NOT NULL DEFAULT 60,
    burst_capacity INT NOT NULL DEFAULT 10,
    json_schema_validation TEXT,
    is_pii_masking_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_endpoint_policies_path_method ON endpoint_policies(endpoint_path, http_method);

-- 2. Distributed Request Tracing
CREATE TABLE IF NOT EXISTS request_traces (
    id UUID PRIMARY KEY,
    trace_id VARCHAR(64) NOT NULL,
    span_id VARCHAR(64) NOT NULL,
    parent_span_id VARCHAR(64),
    service_name VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    http_status INT NOT NULL,
    duration_ms BIGINT NOT NULL,
    gateway_latency_ms BIGINT NOT NULL DEFAULT 0,
    auth_latency_ms BIGINT NOT NULL DEFAULT 0,
    upstream_latency_ms BIGINT NOT NULL DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_request_traces_trace_id ON request_traces(trace_id);
CREATE INDEX IF NOT EXISTS idx_request_traces_timestamp ON request_traces(timestamp);

-- 3. Traffic Replay Jobs
CREATE TABLE IF NOT EXISTS traffic_replay_jobs (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_env_url VARCHAR(500) NOT NULL,
    recorded_requests_count INT NOT NULL DEFAULT 0,
    success_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SLA Synthetic Probes & Health Monitors
CREATE TABLE IF NOT EXISTS sla_probes (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    http_method VARCHAR(10) NOT NULL DEFAULT 'GET',
    expected_status INT NOT NULL DEFAULT 200,
    check_interval_seconds INT NOT NULL DEFAULT 60,
    last_latency_ms BIGINT DEFAULT 0,
    uptime_percentage NUMERIC(5,2) DEFAULT 99.99,
    status VARCHAR(50) NOT NULL DEFAULT 'HEALTHY',
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial SLA Probes and Policies
INSERT INTO sla_probes (id, name, target_url, http_method, expected_status, check_interval_seconds, last_latency_ms, uptime_percentage, status, last_checked_at, created_at)
VALUES 
(gen_random_uuid(), 'Core API Gateway Health', 'https://api.example.com/health', 'GET', 200, 30, 42, 99.99, 'HEALTHY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Auth Token Verification', 'https://api.example.com/api/v1/auth/verify', 'POST', 200, 60, 65, 99.95, 'HEALTHY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Payment Webhook Dispatcher', 'https://api.example.com/api/v1/webhooks/dispatch', 'POST', 200, 60, 110, 99.90, 'HEALTHY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO endpoint_policies (id, endpoint_path, http_method, rate_limit_per_min, burst_capacity, is_pii_masking_enabled, is_active, created_at, updated_at)
VALUES
(gen_random_uuid(), '/api/v1/payments/checkout', 'POST', 10, 2, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), '/api/v1/users/profile', 'GET', 120, 20, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), '/api/v1/products', 'GET', 300, 50, FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;