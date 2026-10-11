package com.saas.api.modules.tracing;

import java.util.List;

public interface TraceService {
    List<RequestTrace> getRecentTraces();
    TraceWaterfallDto getTraceWaterfall(String traceId);
    RequestTrace recordTrace(String endpoint, String method, int status, long gatewayMs, long authMs, long upstreamMs);
}