package com.saas.api.modules.mockapis.service.impl;

import com.saas.api.core.constant.ErrorCode;
import com.saas.api.core.exception.BusinessException;
import com.saas.api.modules.mockapis.domain.MockEndpointEntity;
import com.saas.api.modules.mockapis.dto.CreateMockEndpointRequest;
import com.saas.api.modules.mockapis.dto.MockEndpointResponse;
import com.saas.api.modules.mockapis.repository.MockEndpointRepository;
import com.saas.api.modules.mockapis.service.MockApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MockApiServiceImpl implements MockApiService {

    private final MockEndpointRepository mockEndpointRepository;
    private final Random random = new Random();

    @Override
    @Transactional(readOnly = true)
    public List<MockEndpointResponse> getMyMockEndpoints(UUID userId) {
        return mockEndpointRepository.findByUserIdAndIsDeletedFalse(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MockEndpointResponse createMockEndpoint(UUID userId, CreateMockEndpointRequest request) {
        String normalizedPath = request.getPath().trim();
        if (!normalizedPath.startsWith("/")) {
            normalizedPath = "/" + normalizedPath;
        }

        final String pathToCheck = normalizedPath;
        mockEndpointRepository.findByUserIdAndPathAndHttpMethodAndIsDeletedFalse(userId, pathToCheck, request.getHttpMethod().toUpperCase())
                .ifPresent(m -> {
                    throw new BusinessException(ErrorCode.PRODUCT_CODE_EXISTS, "Đã tồn tại Mock Endpoint với Path và HTTP Method này");
                });

        MockEndpointEntity entity = MockEndpointEntity.builder()
                .userId(userId)
                .name(request.getName().trim())
                .path(normalizedPath)
                .httpMethod(request.getHttpMethod().toUpperCase())
                .responseStatus(request.getResponseStatus())
                .responseBody(request.getResponseBody())
                .responseHeaders(request.getResponseHeaders() != null ? request.getResponseHeaders() : "{\"Content-Type\": \"application/json\"}")
                .isActive(true)
                .callCount(0L)
                .build();

        return mapToResponse(mockEndpointRepository.save(entity));
    }

    @Override
    @Transactional
    public MockEndpointResponse toggleMockEndpoint(UUID userId, UUID id) {
        MockEndpointEntity entity = mockEndpointRepository.findById(id)
                .filter(m -> !m.isDeleted() && m.getUserId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy Mock Endpoint"));

        entity.setIsActive(!Boolean.TRUE.equals(entity.getIsActive()));
        return mapToResponse(mockEndpointRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteMockEndpoint(UUID userId, UUID id) {
        MockEndpointEntity entity = mockEndpointRepository.findById(id)
                .filter(m -> !m.isDeleted() && m.getUserId().equals(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy Mock Endpoint"));

        entity.setDeleted(true);
        mockEndpointRepository.save(entity);
    }

    @Override
    @Transactional
    public ResponseEntity<String> executeMock(String rawPath, String httpMethod) {
        String normalizedPath = rawPath.trim();
        if (!normalizedPath.startsWith("/")) normalizedPath = "/" + normalizedPath;

        MockEndpointEntity mock = mockEndpointRepository
                .findFirstByPathAndHttpMethodAndIsActiveTrueAndIsDeletedFalse(normalizedPath, httpMethod.toUpperCase())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy Mock Endpoint khả dụng cho: " + httpMethod + " " + rawPath));

        mock.setCallCount(mock.getCallCount() + 1);
        mockEndpointRepository.save(mock);

        String transformedBody = renderDynamicTags(mock.getResponseBody());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("X-Mock-Engine", "SaaS-SmartGate-v8");
        headers.add("X-Mock-Call-Count", String.valueOf(mock.getCallCount()));

        HttpStatus status = HttpStatus.resolve(mock.getResponseStatus());
        if (status == null) status = HttpStatus.OK;

        return new ResponseEntity<>(transformedBody, headers, status);
    }

    private String renderDynamicTags(String template) {
        if (template == null) return "{}";
        return template
                .replace("{{timestamp}}", Instant.now().toString())
                .replace("{{uuid}}", UUID.randomUUID().toString())
                .replace("{{randomNumber}}", String.valueOf(10000 + random.nextInt(90000)))
                .replace("{{date}}", LocalDate.now().toString());
    }

    private MockEndpointResponse mapToResponse(MockEndpointEntity entity) {
        return MockEndpointResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .name(entity.getName())
                .path(entity.getPath())
                .httpMethod(entity.getHttpMethod())
                .responseStatus(entity.getResponseStatus())
                .responseBody(entity.getResponseBody())
                .responseHeaders(entity.getResponseHeaders())
                .isActive(entity.getIsActive())
                .callCount(entity.getCallCount())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}