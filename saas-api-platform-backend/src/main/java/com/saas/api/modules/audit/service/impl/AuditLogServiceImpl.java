package com.saas.api.modules.audit.service.impl;

import com.saas.api.core.model.PageResponse;
import com.saas.api.modules.audit.domain.AuditLogEntity;
import com.saas.api.modules.audit.dto.response.AuditLogResponse;
import com.saas.api.modules.audit.repository.AuditLogRepository;
import com.saas.api.modules.audit.service.AuditLogService;
import com.saas.api.modules.users.domain.UserEntity;
import com.saas.api.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    @Async
    @Transactional
    public void logAction(UUID userId, String userEmail, String action, String resourceType, String resourceId, String clientIp, String userAgent, String description) {
        try {
            UserEntity user = userId != null ? userRepository.findById(userId).orElse(null) : null;

            AuditLogEntity logEntity = AuditLogEntity.builder()
                    .user(user)
                    .userEmail(userEmail != null ? userEmail : (user != null ? user.getEmail() : "ANONYMOUS"))
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .clientIp(clientIp)
                    .userAgent(userAgent)
                    .description(description)
                    .build();

            auditLogRepository.save(logEntity);
            log.info("[AUDIT] Action: {} on {} (User: {}, IP: {})", action, resourceType, userEmail, clientIp);
        } catch (Exception e) {
            log.error("Lỗi khi ghi Audit Log: {}", e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> getAllAuditLogs(Pageable pageable) {
        Page<AuditLogEntity> page = auditLogRepository.findAll(pageable);
        return PageResponse.from(page.map(this::mapToResponse));
    }

    private AuditLogResponse mapToResponse(AuditLogEntity entity) {
        return AuditLogResponse.builder()
                .id(entity.getId())
                .userEmail(entity.getUserEmail())
                .action(entity.getAction())
                .resourceType(entity.getResourceType())
                .resourceId(entity.getResourceId())
                .clientIp(entity.getClientIp())
                .userAgent(entity.getUserAgent())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
