package com.saas.api.modules.alerts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsageAlertResponse {
    private UUID id;
    private UUID userId;
    private Integer thresholdPercentage;
    private String channel;
    private String destination;
    private Boolean isTriggered;
    private Instant lastTriggeredAt;
    private Instant createdAt;
}
