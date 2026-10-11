package com.saas.api.modules.slaprobes;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "sla_probes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlaProbe {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "target_url", nullable = false, length = 500)
    private String targetUrl;

    @Column(name = "http_method", nullable = false, length = 10)
    @Builder.Default
    private String httpMethod = "GET";

    @Column(name = "expected_status", nullable = false)
    @Builder.Default
    private Integer expectedStatus = 200;

    @Column(name = "check_interval_seconds", nullable = false)
    @Builder.Default
    private Integer checkIntervalSeconds = 60;

    @Column(name = "last_latency_ms")
    @Builder.Default
    private Long lastLatencyMs = 0L;

    @Column(name = "uptime_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal uptimePercentage = new BigDecimal("99.99");

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "HEALTHY"; // HEALTHY, DEGRADED, DOWN

    @Column(name = "last_checked_at")
    private OffsetDateTime lastCheckedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}