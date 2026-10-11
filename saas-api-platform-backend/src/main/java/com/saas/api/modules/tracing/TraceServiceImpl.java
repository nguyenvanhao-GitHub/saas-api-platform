package com.saas.api.modules.tracing;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TraceServiceImpl implements TraceService {

    private final RequestTraceRepository repository;

    @Override
    public List<RequestTrace> getRecentTraces() {
        List<RequestTrace> traces = repository.findTop50ByOrderByTimestampDesc();
        if (traces.isEmpty()) {
            seedSampleTraces();
            return repository.findTop50ByOrderByTimestampDesc();
        }
        return traces;
    }

    @Override
    public TraceWaterfallDto getTraceWaterfall(String traceId) {
        List<RequestTrace> spans = repository.findByTraceIdOrderByTimestampAsc(traceId);
        if (spans.isEmpty()) {
            return generateMockWaterfall(traceId);
        }
        RequestTrace root = spans.get(0);
        long total = root.getDurationMs() > 0 ? root.getDurationMs() : (root.getGatewayLatencyMs() + root.getAuthLatencyMs() + root.getUpstreamLatencyMs());
        if (total <= 0) total = 100;

        List<TraceWaterfallDto.SpanDetail> spanDetails = new ArrayList<>();
        
        double gwOffset = 0.0;
        double gwWidth = ((double) root.getGatewayLatencyMs() / total) * 100.0;
        spanDetails.add(TraceWaterfallDto.SpanDetail.builder()
                .spanId(root.getSpanId() + "-gw")
                .name("API Gateway Rate Limit & SSL Termination")
                .durationMs(root.getGatewayLatencyMs())
                .offsetPercent(gwOffset)
                .widthPercent(Math.max(gwWidth, 5.0))
                .status("SUCCESS")
                .build());

        double authOffset = gwWidth;
        double authWidth = ((double) root.getAuthLatencyMs() / total) * 100.0;
        spanDetails.add(TraceWaterfallDto.SpanDetail.builder()
                .spanId(root.getSpanId() + "-auth")
                .name("OAuth2 / JWT Token Validation & Scope Check")
                .durationMs(root.getAuthLatencyMs())
                .offsetPercent(authOffset)
                .widthPercent(Math.max(authWidth, 5.0))
                .status("SUCCESS")
                .build());

        double upOffset = authOffset + authWidth;
        double upWidth = ((double) root.getUpstreamLatencyMs() / total) * 100.0;
        spanDetails.add(TraceWaterfallDto.SpanDetail.builder()
                .spanId(root.getSpanId() + "-upstream")
                .name("Upstream Microservice Execution & DB Query")
                .durationMs(root.getUpstreamLatencyMs())
                .offsetPercent(upOffset)
                .widthPercent(Math.max(upWidth, 10.0))
                .status(root.getHttpStatus() >= 400 ? "ERROR" : "SUCCESS")
                .build());

        return TraceWaterfallDto.builder()
                .traceId(root.getTraceId())
                .endpoint(root.getEndpoint())
                .httpMethod(root.getHttpMethod())
                .httpStatus(root.getHttpStatus())
                .totalDurationMs(total)
                .gatewayLatencyMs(root.getGatewayLatencyMs())
                .authLatencyMs(root.getAuthLatencyMs())
                .upstreamLatencyMs(root.getUpstreamLatencyMs())
                .timestamp(root.getTimestamp())
                .spans(spanDetails)
                .build();
    }

    @Override
    @Transactional
    public RequestTrace recordTrace(String endpoint, String method, int status, long gatewayMs, long authMs, long upstreamMs) {
        long total = gatewayMs + authMs + upstreamMs;
        RequestTrace trace = RequestTrace.builder()
                .traceId("tr-" + UUID.randomUUID().toString().substring(0, 12))
                .spanId("sp-" + UUID.randomUUID().toString().substring(0, 8))
                .serviceName("api-gateway")
                .endpoint(endpoint)
                .httpMethod(method)
                .httpStatus(status)
                .gatewayLatencyMs(gatewayMs)
                .authLatencyMs(authMs)
                .upstreamLatencyMs(upstreamMs)
                .durationMs(total)
                .build();
        return repository.save(trace);
    }

    private void seedSampleTraces() {
        recordTrace("/api/v1/payments/checkout", "POST", 200, 12, 18, 145);
        recordTrace("/api/v1/users/profile", "GET", 200, 5, 10, 32);
        recordTrace("/api/v1/products", "GET", 200, 8, 12, 54);
        recordTrace("/api/v1/mock/orders", "GET", 200, 4, 8, 20);
        recordTrace("/api/v1/webhooks/dispatch", "POST", 500, 10, 15, 320);
    }

    private TraceWaterfallDto generateMockWaterfall(String traceId) {
        return TraceWaterfallDto.builder()
                .traceId(traceId)
                .endpoint("/api/v1/payments/checkout")
                .httpMethod("POST")
                .httpStatus(200)
                .totalDurationMs(185L)
                .gatewayLatencyMs(15L)
                .authLatencyMs(25L)
                .upstreamLatencyMs(145L)
                .timestamp(OffsetDateTime.now())
                .spans(List.of(
                        TraceWaterfallDto.SpanDetail.builder()
                                .spanId("sp-gw-01")
                                .name("API Gateway Rate Limit & WAF Check")
                                .durationMs(15L)
                                .offsetPercent(0.0)
                                .widthPercent(10.0)
                                .status("SUCCESS")
                                .build(),
                        TraceWaterfallDto.SpanDetail.builder()
                                .spanId("sp-auth-02")
                                .name("JWT Token Scope Validation")
                                .durationMs(25L)
                                .offsetPercent(10.0)
                                .widthPercent(15.0)
                                .status("SUCCESS")
                                .build(),
                        TraceWaterfallDto.SpanDetail.builder()
                                .spanId("sp-db-03")
                                .name("Payment Processor & Database Commit")
                                .durationMs(145L)
                                .offsetPercent(25.0)
                                .widthPercent(75.0)
                                .status("SUCCESS")
                                .build()
                ))
                .build();
    }
}