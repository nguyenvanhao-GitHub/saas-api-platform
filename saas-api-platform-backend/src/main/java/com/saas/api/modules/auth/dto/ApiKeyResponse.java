package com.saas.api.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyResponse {
    private UUID id;
    private UUID userId;
    private String keyName;
    private String apiKey;
    private String maskedKey;
    private String scopes;
    private String ipWhitelist;
    private Integer rateLimitPerMinute;
    private Boolean isActive;
    private Instant expiresAt;
    private Instant lastUsedAt;
    private Instant createdAt;
}
