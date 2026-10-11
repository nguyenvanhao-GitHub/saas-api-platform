package com.saas.api.modules.audit.service;

import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.audit.dto.response.AuditLogResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AuditLogService {

    void logAction(UUID userId, String userEmail, String action, String resourceType, String resourceId, String clientIp, String userAgent, String description);

    PageResponse<AuditLogResponse> getAllAuditLogs(Pageable pageable);
}
