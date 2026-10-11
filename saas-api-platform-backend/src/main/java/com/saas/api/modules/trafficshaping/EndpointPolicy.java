package com.saas.api.modules.trafficshaping;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "endpoint_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndpointPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "endpoint_path", nullable = false)
    private String endpointPath;

    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    @Column(name = "rate_limit_per_min", nullable = false)
    @Builder.Default
    private Integer rateLimitPerMin = 60;

    @Column(name = "burst_capacity", nullable = false)
    @Builder.Default
    private Integer burstCapacity = 10;

    @Column(name = "json_schema_validation", columnDefinition = "TEXT")
    private String jsonSchemaValidation;

    @Column(name = "is_pii_masking_enabled", nullable = false)
    @Builder.Default
    private Boolean isPiiMaskingEnabled = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}