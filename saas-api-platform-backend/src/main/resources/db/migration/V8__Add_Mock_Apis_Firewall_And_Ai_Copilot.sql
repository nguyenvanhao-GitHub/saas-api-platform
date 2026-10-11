-- Flyway Database Migration V8: Dynamic Mock API Engine, CIDR IP Firewall, and AI Copilot Logs

-- 1. Dynamic Mock Endpoints Table
CREATE TABLE IF NOT EXISTS mock_endpoints (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    path VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL DEFAULT 'GET',
    response_status INT NOT NULL DEFAULT 200,
    response_body TEXT NOT NULL DEFAULT '{}',
    response_headers TEXT DEFAULT '{"Content-Type": "application/json"}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    call_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mock_endpoints_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_path_method UNIQUE (user_id, path, http_method)
);

CREATE INDEX IF NOT EXISTS idx_mock_endpoints_user_id ON mock_endpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_endpoints_path ON mock_endpoints(path);

-- 2. CIDR IP Firewall Rules Table
CREATE TABLE IF NOT EXISTS ip_firewall_rules (
    id UUID PRIMARY KEY,
    rule_type VARCHAR(20) NOT NULL DEFAULT 'DENY', -- ALLOW, DENY
    cidr_ip VARCHAR(50) NOT NULL, -- e.g. 192.168.1.0/24 or 203.0.113.5/32
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    blocked_hits BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ip_firewall_type ON ip_firewall_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_ip_firewall_cidr ON ip_firewall_rules(cidr_ip);

-- 3. AI Copilot Chat Logs Table
CREATE TABLE IF NOT EXISTS ai_chat_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    prompt TEXT NOT NULL,
    response_text TEXT NOT NULL,
    language_used VARCHAR(30) DEFAULT 'ALL',
    tokens_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_user_id ON ai_chat_logs(user_id);