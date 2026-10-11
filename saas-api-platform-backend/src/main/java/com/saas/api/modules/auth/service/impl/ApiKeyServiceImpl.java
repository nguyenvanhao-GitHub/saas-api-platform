package com.saas.api.modules.auth.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.auth.domain.ApiKeyEntity;
import com.saas.api.modules.auth.dto.ApiKeyResponse;
import com.saas.api.modules.auth.dto.CreateApiKeyRequest;
import com.saas.api.modules.auth.repository.ApiKeyRepository;
import com.saas.api.modules.auth.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiKeyServiceImpl implements ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ApiKeyResponse> getMyApiKeys(UUID userId) {
        return apiKeyRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiKeyResponse createApiKey(UUID userId, CreateApiKeyRequest request) {
        long count = apiKeyRepository.countByUserIdAndIsDeletedFalse(userId);
        if (count >= 10) {
            throw new BusinessException(ErrorCode.INVALID_KEY, "Mỗi tài khoản được tạo tối đa 10 API Keys!");
        }

        String rawToken = "sk_live_" + UUID.randomUUID().toString().replace("-", "");

        ApiKeyEntity entity = ApiKeyEntity.builder()
                .userId(userId)
                .keyName(request.getKeyName())
                .apiKey(rawToken)
                .scopes(request.getScopes() != null && !request.getScopes().isBlank() ? request.getScopes() : "read:all,write:all")
                .ipWhitelist(request.getIpWhitelist())
                .rateLimitPerMinute(request.getRateLimitPerMinute() != null ? request.getRateLimitPerMinute() : 60)
                .isActive(true)
                .expiresAt(request.getExpiresAt())
                .build();

        ApiKeyEntity saved = apiKeyRepository.save(entity);
        log.info("Đã tạo API Key mới: id={}, userId={}, name={}", saved.getId(), userId, saved.getKeyName());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ApiKeyResponse toggleApiKey(UUID userId, UUID keyId) {
        ApiKeyEntity key = apiKeyRepository.findByIdAndUserIdAndIsDeletedFalse(keyId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy API Key"));

        key.setIsActive(!key.getIsActive());
        ApiKeyEntity updated = apiKeyRepository.save(key);
        log.info("Đã toggle trạng thái API Key: id={}, active={}", keyId, updated.getIsActive());
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteApiKey(UUID userId, UUID keyId) {
        ApiKeyEntity key = apiKeyRepository.findByIdAndUserIdAndIsDeletedFalse(keyId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy API Key"));

        key.setDeleted(true);
        apiKeyRepository.save(key);
        log.info("Đã xóa API Key: id={}, userId={}", keyId, userId);
    }

    private ApiKeyResponse mapToResponse(ApiKeyEntity entity) {
        String fullKey = entity.getApiKey();
        String masked = fullKey.length() > 12 
                ? fullKey.substring(0, 10) + "••••••••" + fullKey.substring(fullKey.length() - 4)
                : fullKey;

        return ApiKeyResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .keyName(entity.getKeyName())
                .apiKey(fullKey)
                .maskedKey(masked)
                .scopes(entity.getScopes())
                .ipWhitelist(entity.getIpWhitelist())
                .rateLimitPerMinute(entity.getRateLimitPerMinute())
                .isActive(entity.getIsActive())
                .expiresAt(entity.getExpiresAt())
                .lastUsedAt(entity.getLastUsedAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
