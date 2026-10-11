package com.saas.api.modules.tracing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TraceWaterfallDto {
    private String traceId;
    private String endpoint;
    private String httpMethod;
    private Integer httpStatus;
    private Long totalDurationMs;
    private Long gatewayLatencyMs;
    private Long authLatencyMs;
    private Long upstreamLatencyMs;
    private OffsetDateTime timestamp;
    private List<SpanDetail> spans;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpanDetail {
        private String spanId;
        private String name;
        private Long durationMs;
        private Double offsetPercent;
        private Double widthPercent;
        private String status;
    }
}