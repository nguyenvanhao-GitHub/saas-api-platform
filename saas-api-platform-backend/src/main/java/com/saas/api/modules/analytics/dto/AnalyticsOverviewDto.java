package com.saas.api.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewDto {
    private long totalRequests24h;
    private double successRate;
    private double avgLatencyMs;
    private long rateLimitBlocks;
    private List<TimeSeriesDataPoint> timeSeries;
    private List<EndpointUsageStat> topEndpoints;
}
