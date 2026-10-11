package com.saas.api.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EndpointUsageStat {
    private String endpoint;
    private String method;
    private long callCount;
    private double percentage;
    private double avgLatencyMs;
    private String category;
}
