package com.saas.api.modules.mockapis.service;

import com.saas.api.modules.mockapis.dto.CreateMockEndpointRequest;
import com.saas.api.modules.mockapis.dto.MockEndpointResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

public interface MockApiService {
    List<MockEndpointResponse> getMyMockEndpoints(UUID userId);
    MockEndpointResponse createMockEndpoint(UUID userId, CreateMockEndpointRequest request);
    MockEndpointResponse toggleMockEndpoint(UUID userId, UUID id);
    void deleteMockEndpoint(UUID userId, UUID id);
    ResponseEntity<String> executeMock(String rawPath, String httpMethod);
}