package com.saas.api.modules.auth.service;

import com.saas.api.modules.auth.dto.ApiKeyResponse;
import com.saas.api.modules.auth.dto.CreateApiKeyRequest;

import java.util.List;
import java.util.UUID;

public interface ApiKeyService {
    List<ApiKeyResponse> getMyApiKeys(UUID userId);
    ApiKeyResponse createApiKey(UUID userId, CreateApiKeyRequest request);
    ApiKeyResponse toggleApiKey(UUID userId, UUID keyId);
    void deleteApiKey(UUID userId, UUID keyId);
}
