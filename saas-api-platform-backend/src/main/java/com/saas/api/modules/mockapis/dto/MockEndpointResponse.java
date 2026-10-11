package com.saas.api.modules.mockapis.dto;

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
public class MockEndpointResponse {
    private UUID id;
    private UUID userId;
    private String name;
    private String path;
    private String httpMethod;
    private Integer responseStatus;
    private String responseBody;
    private String responseHeaders;
    private Boolean isActive;
    private Long callCount;
    private Instant createdAt;
}