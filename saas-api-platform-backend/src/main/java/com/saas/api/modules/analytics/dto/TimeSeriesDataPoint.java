package com.saas.api.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesDataPoint {
    private String timeLabel; // e.g. "00:00", "04:00", "08:00"
    private long totalRequests;
    private long successRequests; // 2xx
    private long clientErrors; // 4xx
    private long serverErrors; // 5xx
    private double avgLatencyMs;
}
