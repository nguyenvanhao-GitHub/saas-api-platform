package com.saas.api.modules.tracing;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "request_traces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestTrace {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "trace_id", nullable = false, length = 64)
    private String traceId;

    @Column(name = "span_id", nullable = false, length = 64)
    private String spanId;

    @Column(name = "parent_span_id", length = 64)
    private String parentSpanId;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;

    @Column(nullable = false)
    private String endpoint;

    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    @Column(name = "http_status", nullable = false)
    private Integer httpStatus;

    @Column(name = "duration_ms", nullable = false)
    private Long durationMs;

    @Column(name = "gateway_latency_ms", nullable = false)
    @Builder.Default
    private Long gatewayLatencyMs = 0L;

    @Column(name = "auth_latency_ms", nullable = false)
    @Builder.Default
    private Long authLatencyMs = 0L;

    @Column(name = "upstream_latency_ms", nullable = false)
    @Builder.Default
    private Long upstreamLatencyMs = 0L;

    @CreationTimestamp
    @Column(name = "timestamp", updatable = false)
    private OffsetDateTime timestamp;
}