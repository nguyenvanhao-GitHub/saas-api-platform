package com.saas.api.modules.audit.dto.response;

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
public class AuditLogResponse {

    private UUID id;
    private String userEmail;
    private String action;
    private String resourceType;
    private String resourceId;
    private String clientIp;
    private String userAgent;
    private String description;
    private Instant createdAt;
}
