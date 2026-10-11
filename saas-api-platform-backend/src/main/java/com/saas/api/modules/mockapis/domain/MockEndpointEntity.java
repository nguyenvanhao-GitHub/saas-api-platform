package com.saas.api.modules.mockapis.domain;

import com.saas.api.core.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "mock_endpoints")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MockEndpointEntity extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "path", nullable = false, length = 255)
    private String path;

    @Column(name = "http_method", nullable = false, length = 10)
    @Builder.Default
    private String httpMethod = "GET";

    @Column(name = "response_status", nullable = false)
    @Builder.Default
    private Integer responseStatus = 200;

    @Column(name = "response_body", columnDefinition = "TEXT", nullable = false)
    @Builder.Default
    private String responseBody = "{}";

    @Column(name = "response_headers", columnDefinition = "TEXT")
    @Builder.Default
    private String responseHeaders = "{\"Content-Type\": \"application/json\"}";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "call_count", nullable = false)
    @Builder.Default
    private Long callCount = 0L;
}